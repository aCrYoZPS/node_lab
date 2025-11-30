import mongoose, { Document, Model, Schema } from "mongoose";

export interface IServiceType extends Document {
    name: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface IServiceTypeModel extends Model<IServiceType> { }

const serviceTypeSchema = new Schema<IServiceType, IServiceTypeModel>(
    {
        name: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

serviceTypeSchema.method("toJSON", function() {
    return {
        id: this._id,
        name: this.name,
        created_at: this.createdAt,
        updated_at: this.updatedAt,
    }
});

export const ServiceType = mongoose.model<IServiceType, IServiceTypeModel>("ServiceType", serviceTypeSchema);
