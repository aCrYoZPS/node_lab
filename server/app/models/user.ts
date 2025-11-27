import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password_hash: string;
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
    },
    { timestamps: true }
);

userSchema.statics.findByEmail = async function(email: string) {
    return await this.findOne({ email })
};

userSchema.method("toJSON", function() {
    return {
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        id: this._id,
    }
});

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);
