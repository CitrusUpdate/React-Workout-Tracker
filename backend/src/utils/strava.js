export const isTokenExpired = (expiresAt) => {
    const nowInMs = Date.now();

    return nowInMs >= expiresAt;
}

export const formatPace = (pace) => {
    // we want to get format min/km from m/s
    if(!pace || pace === 0) return "00:00";
    const totalRunTimeInSeconds = 1000 / pace;
    const minutes = Math.floor(totalRunTimeInSeconds / 60);
    const seconds = Math.floor(totalRunTimeInSeconds % 60);

    const formattedString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedString;
}