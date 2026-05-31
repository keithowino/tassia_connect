import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	name: String,
	price: Number,
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
});

const orderSchema = new mongoose.Schema(
	{
		orderNumber: {
			type: String,
			unique: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
			required: true,
		},
		items: [orderItemSchema],
		subtotal: {
			type: Number,
			required: true,
		},
		tax: {
			type: Number,
			default: 0,
		},
		deliveryFee: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: [
				"pending",
				"confirmed",
				"preparing",
				"ready",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		paymentMethod: {
			type: String,
			enum: ["mpesa", "cash", "card"],
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed", "refunded"],
			default: "pending",
		},
		deliveryAddress: {
			street: String,
			city: String,
			instructions: String,
		},
		specialInstructions: String,
	},
	{
		timestamps: true,
	},
);

// Generate order number before saving
orderSchema.pre("save", async function () {
	if (!this.orderNumber) {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const random = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
		this.orderNumber = `ORD-${year}${month}${day}-${random}`;
	}
});

export default mongoose.model("Order", orderSchema);
