import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password_hash: string;
    is_admin: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    google_id?: string;
    timezone: string;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser, IUserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password_hash: { type: String },
        is_admin: { type: Boolean, required: true, default: false },
        google_id: { type: String, required: false, sparse: true, unique: true },
        timezone: { type: String, required: true, default: "UTC" }
    },
    { timestamps: true }
);

userSchema.statics.findByEmail = async function(email: string) {
    return await this.findOne({ email })
};

userSchema.method("toJSON", function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        isAdmin: this.is_admin,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        googleId: this.google_id,
        timezone: this.timezone
    }
});

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
