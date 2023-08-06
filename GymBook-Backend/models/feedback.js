import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    feedBack:{type: String, required: true, trim: true}
});

const FeedbackModel = mongoose.model("feedbackSchema", feedbackSchema);

export default FeedbackModel;