const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: { type: String },
        type: { type: String },
        genre: { type: String },
        isChildren: { type: Boolean, default: false },
        isNewRelease: { type: Boolean, default: false },
        maxAge: { type: String, default: "80" },
        releaseYear: { type: String, default: "2020" },
    },
    { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
