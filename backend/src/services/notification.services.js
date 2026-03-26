import Notification from "../models/Notification.js";

export const canSendNotification = async({
    userId,
    type, 
    exercise,
    sinceDate
}) => {
    const query = {
        user: userId,
        type,
        createdAt: { $gte: sinceDate },
    };

    if(exercise) query["meta.exercise"] = exercise;

    const exists = await Notification.findOne(query);
    return !exists;
}

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