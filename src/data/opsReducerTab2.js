export const initialOpsStateTab2 = {
  flagged: false,
  transferCard: false,
  callLog: null,
};

export function opsReducerTab2(state, event) {
  switch (event.type) {
    case "clinical-escalated":
      return { ...state, flagged: true };
    case "warm-transfer":
      return { ...state, transferCard: true };
    case "fill-escalation":
      return {
        ...state,
        callLog: { duration: "1m 48s", disposition: "Escalated correctly — audited." },
      };
    default:
      return state;
  }
}
