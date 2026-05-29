db.communityposts.insertMany([
	{
		title: "Welcome to Tassia Connect!",
		content:
			"We're excited to launch this community platform. Share your thoughts, deals, and announcements here!",
		type: "announcement",
		authorId: ObjectId("your_user_id"),
		pinned: true,
		createdAt: new Date(),
	},
	{
		title: "Weekend Special at Java House",
		content:
			"20% off on all coffee orders this weekend! Use code: TASSIA20",
		type: "deal",
		authorId: ObjectId("your_user_id"),
		pinned: false,
		createdAt: new Date(),
	},
]);
