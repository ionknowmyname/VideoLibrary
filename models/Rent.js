const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema(
    {
        username: { type: String },
        title: { type: String },
        days: { type: String },
        rentcost: { type: String },
    },
    { timestamps: true }
);

const Rent = mongoose.model("Rent", rentSchema);
module.exports = Rent;
