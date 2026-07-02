import { formatDuration } from "../utils/duration";

export const initialOpsStateTab2 = {
  flagged: false,
  transferCard: false,
  callLog: null,
};

export function opsReducerTab2(state, event, meta) {
  switch (event.type) {
    case "clinical-escalated":
      return { ...state, flagged: true };
    case "warm-transfer":
      return { ...state, transferCard: true };
    case "fill-escalation":
      return {
        ...state,
        callLog: { duration: formatDuration(meta?.elapsedMs), disposition: "Escalated correctly — audited." },
      };
    default:
      return state;
  }
}
