import Notification from "../models/Notification";

export const createNotification = async({
    userId,
    type,
    title,
    message,
    meta = {}
}) => {
    return Notification.create({
        user: userId,
        type,
        title,
        message,
        meta,
    });
};