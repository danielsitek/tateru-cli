export const getEndTime = (
    timeKey: [number, number],
): { s: number; ms: number; ns: number } => {
    const endTime = process.hrtime(timeKey);
    const s = endTime[0];
    const ns = endTime[1];
    const ms = ns / 1e6;

    return {
        s,
        ms,
        ns,
    };
};
