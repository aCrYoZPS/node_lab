import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password_hash: string;
    is_admin: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser, IUserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password_hash: { type: String, required: true },
        is_admin: { type: Boolean, required: true, default: false },
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
        is_admin: this.is_admin,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
    }
});

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
