import mongoose, { Document, Model, Schema, Types } from "mongoose";
import autopopulate from 'mongoose-autopopulate';

export interface IService extends Document {
    name: string;
    price: number;
    service_type: Types.ObjectId;
    description: string;
    image: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface IServiceModel extends Model<IService> {
}

const serviceSchema = new Schema<IService, IServiceModel>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        service_type: {
            type: Schema.Types.ObjectId,
            ref: "ServiceType",
            autopopulate: true,
            required: true,
        },
        image: { type: String, required: false }
    },
    { timestamps: true }
);

serviceSchema.plugin(autopopulate as any, {
    maxDepth: 1,
    functions: ['find', 'findOne', 'save']
});

serviceSchema.method("toJSON", function() {
    return {
        id: this._id,
        name: this.name,
        price: this.price,
        description: this.description,
        serviceType: this.service_type,
        image: this.image,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
});

export const Service = mongoose.model<IService, IServiceModel>("Service", serviceSchema);
