export const isTokenExpired = (expiresAt) => {
    const nowInMs = Date.now();

    return nowInMs >= expiresAt;
}