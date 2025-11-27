import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        password_hash: { type: String, required: true },
    },
    { timestamps: true }
);

userSchema.method("toJSON", function() {
    return {
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        id: this._id,
    }
});

export const User = mongoose.model("User", userSchema);
