import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const isUserLocalHour = (user, targetHour = 2) => {
    const now = dayjs().tz(user.timezone || "UTC");
    return now.hour() === targetHour;
};

export const isValidTimezone = (timezone) => {
    return Intl.supportedValuesOf("timeZone").includes(timezone);
}

export const formatSecondsToTime = (totalSeconds) => {
    if(!totalSeconds || isNaN(totalSeconds)) return "N/A";
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    const paddedM = m.toString().padStart(2, '0');
    const paddedS = s.toString().padStart(2, '0');

    if(h > 0) {
        return `${h}:${paddedM}:${paddedS}`;
    }

    return `${paddedM}:${paddedS}`;
};

export const formatTimeToSeconds = (timeStr) => {
    if(!timeStr || timeStr === "N/A") return null;
    if(!isNaN(timeStr)) return Number(timeStr);

    const parts = String(timeStr).trim().split(':').map(Number);

    if(parts.length === 3) {
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if(parts.length === 2) {
        return (parts[0] * 60) + parts[1];
    }

    return null;
}