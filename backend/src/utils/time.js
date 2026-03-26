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