import mongoose, { model, Schema, models } from "mongoose";
import { TRACE_OUTPUT_VERSION } from "next/dist/shared/lib/constants";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object },
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);