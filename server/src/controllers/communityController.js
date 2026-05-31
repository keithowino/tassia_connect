import CommunityPost from "../models/CommunityPost.js";

// Get all posts with filtering
export const getAllPosts = async (req, res) => {
	try {
		const { type, page = 1, limit = 20 } = req.query;
		const skip = (page - 1) * limit;

		let query = {};
		if (type && type !== "all" && type !== "undefined") {
			query.type = type;
		}

		const posts = await CommunityPost.find(query)
			.populate("authorId", "fullName email profileImage")
			.sort({ pinned: -1, createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		const total = await CommunityPost.countDocuments(query);

		res.json({
			posts,
			total,
			page: parseInt(page),
			pages: Math.ceil(total / limit),
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ message: error.message });
	}
};

// Get single post
export const getPostById = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id).populate(
			"authorId",
			"fullName email profileImage",
		);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create new post
export const createPost = async (req, res) => {
	try {
		const { title, content, type } = req.body;

		if (!title || !content) {
			return res
				.status(400)
				.json({ message: "Title and content are required" });
		}

		const post = await CommunityPost.create({
			title,
			content,
			type: type || "general",
			authorId: req.user._id,
		});

		await post.populate("authorId", "fullName email profileImage");

		res.status(201).json(post);
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ message: error.message });
	}
};

// Update post
export const updatePost = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if user is author or admin
		if (
			post.authorId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to edit this post" });
		}

		const updated = await CommunityPost.findByIdAndUpdate(
			req.params.id,
			{
				title: req.body.title,
				content: req.body.content,
				type: req.body.type,
			},
			{ returnDocument: "after", runValidators: true },
		).populate("authorId", "fullName email profileImage");

		res.json(updated);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete post
export const deletePost = async (req, res) => {
	try {
		const post = await CommunityPost.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Check if user is author or admin
		if (
			post.authorId.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this post" });
		}

		await post.deleteOne();
		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Toggle pin (admin only)
export const togglePin = async (req, res) => {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({ message: "Admin access required" });
		}

		const post = await CommunityPost.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		post.pinned = !post.pinned;
		await post.save();

		res.json({
			message: `Post ${post.pinned ? "pinned" : "unpinned"}`,
			pinned: post.pinned,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
