import { useCallback, useEffect, useRef, useState } from "react";
import { estimateHoldMs } from "../utils/timing";
import { speak, cancelSpeech } from "../utils/speech";

const THINK_DELAY_MS = 550; // auto-play's simulated patient-response latency
const CHOICE_REVEAL_MS = 350; // interactive mode: brief pause before buttons appear
const POST_CHOICE_MS = 450; // beat between a chosen reply and Sara's next line

// Drives a script graph (see data/tab1Script.js / tab2Script.js) for both
// auto-play and interactive mode from ONE walk function. The only branch in
// behavior: at a patient choice-point, auto-play picks choices[0] after a
// short "thinking" timer; interactive mode pauses and waits for
// selectChoice(). Every timer is tracked and cancelled on reset/unmount, so
// tab switches and restarts never leave orphaned timers running.
export function useConversationEngine(script, { mode, voiceEnabled, onEvent }) {
  const [transcript, setTranscript] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | running | awaiting-choice | complete
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [pendingChoices, setPendingChoices] = useState(null);
  const [endNote, setEndNote] = useState(null);

  const timers = useRef([]);
  const runToken = useRef(0);
  const runStartMs = useRef(0); // wall-clock time the current run began
  const scriptRef = useRef(script);
  scriptRef.current = script;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const voiceRef = useRef(voiceEnabled);
  voiceRef.current = voiceEnabled;
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }, []);

  const reset = useCallback(() => {
    runToken.current += 1;
    clearTimers();
    cancelSpeech();
    setTranscript([]);
    setStatus("idle");
    setActiveSpeaker(null);
    setPendingChoices(null);
    setEndNote(null);
  }, [clearTimers]);

  // Full cleanup on unmount (e.g. switching tabs mid-run).
  useEffect(() => {
    return () => {
      runToken.current += 1;
      clearTimers();
      cancelSpeech();
    };
  }, [clearTimers]);

  function fireOpsEvents(events, token) {
    (events || []).forEach((evt) => {
      schedule(() => {
        if (runToken.current !== token) return;
        onEventRef.current?.(evt, { elapsedMs: Date.now() - runStartMs.current });
      }, evt.delay || 0);
    });
  }

  function pushLine(speaker, id, text) {
    setTranscript((prev) => [...prev, { id: `${id}-${prev.length}`, speaker, text }]);
    setActiveSpeaker(speaker);
    if (speaker === "sara" && voiceRef.current) speak(text, { enabled: true });
  }

  function endRun(node, token) {
    const holdMs = estimateHoldMs(node);
    schedule(() => {
      if (runToken.current !== token) return;
      setStatus("complete");
      setActiveSpeaker(null);
      setEndNote(node.endNote || null);
    }, holdMs);
  }

  function advance(node, token) {
    const holdMs = estimateHoldMs(node);
    schedule(() => {
      if (runToken.current !== token) return;
      goToNode(node.next, token);
    }, holdMs);
  }

  function resolveChoice(choice, token) {
    pushLine("patient", choice.next, choice.text);
    fireOpsEvents(choice.opsEvents, token);
    schedule(() => {
      if (runToken.current !== token) return;
      goToNode(choice.next, token);
    }, POST_CHOICE_MS);
  }

  function goToNode(nodeId, token) {
    if (runToken.current !== token) return;
    const node = scriptRef.current.nodes[nodeId];
    if (!node) return;

    const isChoicePoint = node.speaker === "patient" && node.choices && node.choices.length > 0;

    if (isChoicePoint) {
      if (modeRef.current === "interactive") {
        setActiveSpeaker(null);
        schedule(() => {
          if (runToken.current !== token) return;
          setStatus("awaiting-choice");
          setPendingChoices({ nodeId: node.id, choices: node.choices });
        }, CHOICE_REVEAL_MS);
        return;
      }
      schedule(() => {
        if (runToken.current !== token) return;
        resolveChoice(node.choices[0], token);
      }, THINK_DELAY_MS);
      return;
    }

    pushLine(node.speaker, node.id, node.text);
    fireOpsEvents(node.opsEvents, token);

    if (node.end) {
      endRun(node, token);
      return;
    }
    advance(node, token);
  }

  const run = useCallback(() => {
    reset();
    const token = runToken.current;
    runStartMs.current = Date.now();
    setStatus("running");
    schedule(() => goToNode(scriptRef.current.startId, token), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, schedule]);

  const selectChoice = useCallback((choice) => {
    const token = runToken.current;
    setPendingChoices(null);
    setStatus("running");
    resolveChoice(choice, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    transcript,
    status,
    activeSpeaker,
    pendingChoices,
    endNote,
    run,
    restart: reset,
    selectChoice,
  };
}
