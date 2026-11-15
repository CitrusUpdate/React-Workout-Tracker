export const parsePaceToSeconds = (paceStr) => {
    if(!paceStr) return null;

    if(typeof paceStr === 'number') return paceStr;

    const normalized = paceStr.replace('.', ':');
    const [minutes, seconds] = normalized.split(":");

    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    return (m * 60) + s;
}

export const formatSecondsToTime = (totalSeconds) => {
    if(!totalSeconds) return "";
    if(typeof totalSeconds === 'string') return totalSeconds;

    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}