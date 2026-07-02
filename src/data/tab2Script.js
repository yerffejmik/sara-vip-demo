// Tab 2 — "When Sara shouldn't handle it". Short, auto-play only, same node
// graph shape as tab1Script so it can share the conversation engine hook.

export function buildTab2Script() {
  return {
    startId: "e1",
    nodes: {
      e1: {
        id: "e1",
        speaker: "sara",
        text: "Thanks for calling Frederick Eye Institute, part of Vision Innovation Partners. This is Sara, the practice's virtual assistant — I can help with scheduling, or connect you to our answering service anytime. How can I help?",
        next: "e2",
      },
      e2: {
        id: "e2",
        speaker: "patient",
        text: "I had cataract surgery Monday and my eye really hurts tonight.",
        next: "e3",
      },
      e3: {
        id: "e3",
        speaker: "sara",
        text: "I'm sorry you're dealing with that, Robert. Eye pain after surgery is something our on-call team needs to hear about right now — I'm connecting you to them directly. Please stay on the line.",
        next: "e4",
        opsEvents: [
          { panel: "flag", type: "clinical-escalated", delay: 250 },
          { panel: "transfer", type: "warm-transfer", delay: 900 },
        ],
      },
      e4: {
        id: "e4",
        speaker: "patient",
        text: "Okay... thank you.",
        next: "e5",
      },
      e5: {
        id: "e5",
        speaker: "system",
        text: "— Call transferred to on-call clinician. —",
        next: null,
        end: true,
        opsEvents: [{ panel: "calllog", type: "fill-escalation", delay: 400 }],
      },
    },
  };
}
