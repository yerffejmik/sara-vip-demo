export function initialOpsStateTab1(dates) {
  return {
    schedule: {
      thursday: { label: `Thu ${dates.thursday.label}`, time: "9:40 AM", status: "booked", patient: "R. Callahan", rev: 0 },
      tuesday: { label: `Tue ${dates.nextTuesday.label}`, time: "1:20 PM", status: "open", patient: null, rev: 0 },
      recordMatched: false,
      matchRev: 0,
      waitlistLine: null,
    },
    tasks: [],
    comms: [],
    callLog: null,
  };
}

import { formatDuration } from "../utils/duration";

export function opsReducerTab1(state, event, dates, meta) {
  switch (event.type) {
    case "record-match":
      return {
        ...state,
        schedule: { ...state.schedule, recordMatched: true, matchRev: state.schedule.matchRev + 1 },
      };
    case "clear-thursday":
      return {
        ...state,
        schedule: {
          ...state.schedule,
          thursday: { ...state.schedule.thursday, status: "open", patient: null, rev: state.schedule.thursday.rev + 1 },
        },
      };
    case "fill-tuesday":
      return {
        ...state,
        schedule: {
          ...state.schedule,
          tuesday: { ...state.schedule.tuesday, status: "booked", patient: "R. Callahan", rev: state.schedule.tuesday.rev + 1 },
        },
      };
    case "waitlist":
      return {
        ...state,
        schedule: { ...state.schedule, waitlistLine: `Waitlist: M. Okafor offered ${state.schedule.thursday.label} 9:40` },
      };
    case "sms":
      return {
        ...state,
        comms: [
          ...state.comms,
          {
            id: `sms-${state.comms.length}`,
            text: `VIP: Your appointment is confirmed for Tue ${dates.nextTuesday.label}, 1:20 PM with Dr. Patel. See you then!`,
          },
        ],
      };
    case "insurance-task":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: `task-${state.tasks.length}`,
            title: "Verify new insurance",
            patient: "R. Callahan",
            owner: "Front office",
            sla: "Before Tue visit",
          },
        ],
      };
    case "fill": {
      const reduced = event.payload?.reduced;
      return {
        ...state,
        callLog: {
          duration: formatDuration(meta?.elapsedMs),
          disposition: `Completed — 0 staff touches`,
          tags: reduced ? ["reschedule"] : ["reschedule", "insurance-change flag"],
        },
      };
    }
    default:
      return state;
  }
}
