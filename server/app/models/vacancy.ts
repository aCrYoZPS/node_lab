import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVacancy extends Document {
    title: string;
    comment: string;
    salary: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface IVacancyModel extends Model<IVacancy> {
}

const vacancySchema = new Schema<IVacancy, IVacancyModel>(
    {
        title: { type: String, required: true },
        comment: { type: String, required: true, unique: true, index: true },
        salary: { type: Number, required: true },
    },
    { timestamps: true }
);


vacancySchema.method("toJSON", function() {
    return {
        id: this._id,
        title: this.title,
        comment: this.comment,
        salary: this.salary
    }
});

export const Vacancy = mongoose.model<IVacancy, IVacancyModel>("Vacancy", vacancySchema);
