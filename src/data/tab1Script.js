// Single source of truth for the Tab 1 "Live call" conversation.
// Both auto-play and interactive mode walk this same node graph.
//
// Node shape:
//   { id, speaker: 'sara' | 'patient' | 'system', text,
//     opsEvents?: [{ panel, type, payload, delay }],
//     next, end?, endNote?,
//     choices?: [{ label, text, next, opsEvents? }] }
//
// - `text` / `opsEvents` / `next` are the golden-path values auto-play always uses.
// - `choices` (patient turns only) is what interactive mode renders as buttons.
//   The first choice is always the golden-path option auto-play mimics automatically.

export function buildTab1Script(dates) {
  const { nextTuesday } = dates;

  return {
    startId: "t1",
    nodes: {
      t1: {
        id: "t1",
        speaker: "sara",
        text: "Thanks for calling Frederick Eye Institute, part of Vision Innovation Partners. This is Sara, the practice's virtual assistant — I can help with scheduling, or connect you to our answering service anytime. How can I help?",
        next: "t2",
      },
      t2: {
        id: "t2",
        speaker: "patient",
        text: "Oh — uh, hi. I have a cataract consultation Thursday morning, but my daughter can't drive me anymore. I need to move it.",
        next: "t3",
        choices: [
          {
            label: "Explain I need to reschedule Thursday's consult",
            text: "Oh — uh, hi. I have a cataract consultation Thursday morning, but my daughter can't drive me anymore. I need to move it.",
            next: "t3",
          },
        ],
      },
      t3: {
        id: "t3",
        speaker: "sara",
        text: "I can take care of that. Can I get your first and last name and date of birth?",
        next: "t4",
      },
      t4: {
        id: "t4",
        speaker: "patient",
        text: "Robert Callahan, March 9th, 1951.",
        next: "t5",
        opsEvents: [{ panel: "schedule", type: "record-match", delay: 250 }],
        choices: [
          {
            label: "Give name and DOB — Robert Callahan, 3/9/1951",
            text: "Robert Callahan, March 9th, 1951.",
            next: "t5",
            opsEvents: [{ panel: "schedule", type: "record-match", delay: 250 }],
          },
        ],
      },
      t5: {
        id: "t5",
        speaker: "sara",
        text: "Thank you, Robert. I see your cataract surgery consultation with Dr. Patel, this Thursday at 9:40 a.m. Since that visit includes dilation, you'll want a driver — would afternoons work better?",
        next: "t6",
      },
      t6: {
        id: "t6",
        speaker: "patient",
        text: "Afternoons, yeah. My daughter's free Tuesdays.",
        next: "t7",
        choices: [
          {
            label: "Afternoons — my daughter's free Tuesdays",
            text: "Afternoons, yeah. My daughter's free Tuesdays.",
            next: "t7",
          },
          {
            label: "Mornings are fine, actually",
            text: "Mornings are fine, actually.",
            next: "t6b",
          },
        ],
      },
      t6b: {
        id: "t6b",
        speaker: "sara",
        text: "Understood — let's see what else Dr. Patel has open.",
        next: "t7",
      },
      t7: {
        id: "t7",
        speaker: "sara",
        text: "Dr. Patel has next Tuesday at 1:20, or the following Tuesday at 2:40. Both are at the same Frederick office.",
        next: "t8",
      },
      t8: {
        id: "t8",
        speaker: "patient",
        text: "Next Tuesday, the 1:20.",
        next: "t9",
        opsEvents: [
          { panel: "schedule", type: "clear-thursday", delay: 300 },
          { panel: "schedule", type: "fill-tuesday", delay: 900 },
          { panel: "schedule", type: "waitlist", delay: 1500 },
        ],
        choices: [
          {
            label: "Next Tuesday, the 1:20",
            text: "Next Tuesday, the 1:20.",
            next: "t9",
            opsEvents: [
              { panel: "schedule", type: "clear-thursday", delay: 300 },
              { panel: "schedule", type: "fill-tuesday", delay: 900 },
              { panel: "schedule", type: "waitlist", delay: 1500 },
            ],
          },
        ],
      },
      t9: {
        id: "t9",
        speaker: "sara",
        text: `Done — you're rescheduled for Tuesday the ${nextTuesday.label} at 1:20 p.m., and Thursday is cancelled. I'm texting a confirmation to your phone ending in 4-4-7. Anything else?`,
        next: "t10",
        opsEvents: [{ panel: "comms", type: "sms", delay: 700 }],
      },
      t10: {
        id: "t10",
        speaker: "patient",
        text: "Actually — I switched to my wife's insurance last month. Is that a problem?",
        next: "t11",
        choices: [
          {
            label: "Mention I switched to my wife's insurance",
            text: "Actually — I switched to my wife's insurance last month. Is that a problem?",
            next: "t11",
          },
          {
            label: "No, that's all",
            text: "No, that's all.",
            next: "end-short",
          },
        ],
      },
      t11: {
        id: "t11",
        speaker: "sara",
        text: "Good thing you mentioned it. I've flagged that for our team — they'll verify your new coverage before Tuesday and call you only if they need anything. Bring the new card to your visit.",
        next: "t12",
        opsEvents: [{ panel: "tasks", type: "insurance-task", delay: 500 }],
      },
      t12: {
        id: "t12",
        speaker: "patient",
        text: "Well. That was easier than I expected.",
        next: "t13",
        choices: [
          {
            label: "That was easier than I expected",
            text: "Well. That was easier than I expected.",
            next: "t13",
          },
        ],
      },
      t13: {
        id: "t13",
        speaker: "sara",
        text: "That's the idea, Robert. We'll see you Tuesday at 1:20.",
        next: null,
        end: true,
        opsEvents: [{ panel: "calllog", type: "fill", delay: 500 }],
      },
      "end-short": {
        id: "end-short",
        speaker: "sara",
        text: "You're all set, Robert — we'll see you Tuesday at 1:20.",
        next: null,
        end: true,
        endNote: "Run ended one turn early — the insurance check wasn't triggered this time.",
        opsEvents: [{ panel: "calllog", type: "fill", delay: 500, payload: { reduced: true } }],
      },
    },
  };
}
