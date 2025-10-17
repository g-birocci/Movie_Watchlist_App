import mongoose, { Schema } from "mongoose";

const MovieSchema = new Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    watched: { type: Boolean, default: false },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Movie', MovieSchema);
