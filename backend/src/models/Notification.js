import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    type: {
        type: String,
        enum: ["progress", "volume", "rir", "system"],
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    read: {
        type: Boolean,
        default: false,
    },

    meta: {
        type: Object,
        default: {},
    },
}, { timestamps: true });

notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ "meta.exercise": 1 });

export default mongoose.model("Notification", notificationSchema);