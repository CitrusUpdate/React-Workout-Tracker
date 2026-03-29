import Notification from "../models/Notification.js";

export const getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);

        res.json(notifications);
    } catch(error) {
        console.error("getNotifications", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAsRead = async(req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if(!notification) return res.status(404).json({ message: "Not found" });
        if(notification.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden"});

        notification.read = true;
        await notification.save();

        res.json({ message: "OK" });
    } catch(error) {
        console.error("markAsRead", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearNotifications = async(req, res) => {
    try {
        await Notification.deleteMany({
            user: req.user._id,
            read: true,
        });

        res.json({ message: "Cleared" });
    } catch(error) {
        console.error("clearNotifications", error);
        res.status(500).json({ message: "Internal server error" });
    }
}