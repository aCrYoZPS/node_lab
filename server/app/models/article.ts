import mongoose, { Document, Model, Schema, Types } from "mongoose";
import autopopulate from 'mongoose-autopopulate';

export interface IArticle extends Document {
    title: string;
    content: string;
    author: Types.ObjectId;
    abstract: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
}

export interface IArticleModel extends Model<IArticle> {
    findByAuthorId(authorId: string): Promise<IArticle[]>;
}

const articleSchema = new Schema<IArticle, IArticleModel>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        abstract: { type: String, required: true },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true,
            required: true,
        },
    },
    { timestamps: true }
);

articleSchema.statics.findByAuthorId = async function(author: string) {
    return await this.find({ author });
}

articleSchema.plugin(autopopulate as any, {
    maxDepth: 1,
    functions: ['find', 'findOne', 'save']
});

articleSchema.method("toJSON", function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.author,
        abstract: this.abstract,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
});

export const Article = mongoose.model<IArticle, IArticleModel>("Article", articleSchema);
