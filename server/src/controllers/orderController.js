import Order from "../models/Order.js";
import Business from "../models/Business.js";
import Product from "../models/Product.js";

// Create order
export const createOrder = async (req, res) => {
	try {
		const {
			businessId,
			items,
			deliveryAddress,
			specialInstructions,
			paymentMethod,
		} = req.body;

		// Calculate totals
		let subtotal = 0;
		const orderItems = [];

		for (const item of items) {
			const product = await Product.findById(item.productId);
			if (!product) {
				return res
					.status(404)
					.json({ message: `Product ${item.productId} not found` });
			}

			const itemTotal = product.price * item.quantity;
			subtotal += itemTotal;

			orderItems.push({
				productId: product._id,
				name: product.name,
				price: product.price,
				quantity: item.quantity,
			});
		}

		const tax = subtotal * 0.16; // 16% VAT
		const deliveryFee = 100; // Fixed for now
		const total = subtotal + tax + deliveryFee;

		const order = await Order.create({
			userId: req.user._id,
			businessId,
			items: orderItems,
			subtotal,
			tax,
			deliveryFee,
			total,
			deliveryAddress,
			specialInstructions,
			paymentMethod,
			paymentStatus: paymentMethod === "mpesa" ? "pending" : "pending",
			status: "pending",
		});

		res.status(201).json(order);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get user's orders
export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.user._id })
			.populate("businessId", "businessName logo")
			.sort({ createdAt: -1 });
		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// // Get business orders (for owner)
export const getBusinessOrders = async (req, res) => {
	try {
		const business = await Business.findById(req.params.businessId);
		if (!business) {
			return res.status(404).json({ message: "Business not found" });
		}

		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const orders = await Order.find({ businessId: req.params.businessId })
			.populate("userId", "fullName email phoneNumber profileImage") // Get customer details
			.sort({ createdAt: -1 });

		// Enhance orders with customer contact info
		const enhancedOrders = orders.map((order) => ({
			...order.toObject(),
			customer: {
				name: order.userId?.fullName || "Customer",
				phone:
					order.userId?.phoneNumber ||
					order.userId?.email ||
					"No phone provided",
				email: order.userId?.email || "No email",
				userId: order.userId?._id,
			},
		}));

		res.json(enhancedOrders);
	} catch (error) {
		console.error("Get business orders error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Update order status
export const updateOrderStatus = async (req, res) => {
	try {
		const { status, note } = req.body;
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const business = await Business.findById(order.businessId);
		if (
			business.ownerId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Not authorized" });
		}

		// Add to timeline if you implement it
		order.status = status;
		if (note) {
			order.statusNote = note;
		}
		await order.save();

		// Populate customer info for response
		await order.populate("userId", "fullName email phoneNumber");

		res.json(order);
	} catch (error) {
		console.error("Update order status error:", error);
		res.status(500).json({ message: error.message });
	}
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("userId", "fullName email phoneNumber")
			.populate("businessId", "businessName logo")
			.sort({ createdAt: -1 });

		res.json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
