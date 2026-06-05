import { useState, useEffect } from "react";
import { Tags, Plus, Trash2, Edit2 } from "lucide-react";
import { categoryAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);
	const [form, setForm] = useState({
		name: "",
		description: "",
		icon: "Store",
		color: "#f97316",
		sortOrder: 0,
		isActive: true,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// const fetchCategories = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const response = await categoryAPI.getAllAdmin();
	// 		setCategories(response.data || []);
	// 	} catch (error) {
	// 		console.error("Error fetching categories:", error);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// In AdminCategories.jsx
	const fetchCategories = async () => {
		setLoading(true);
		try {
			const response = await categoryAPI.getAllAdmin();
			setCategories(response.data || []);
		} catch (error) {
			console.error("Error fetching categories:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, [refetchKey]);

	const resetForm = () => {
		setForm({
			name: "",
			description: "",
			icon: "Store",
			color: "#f97316",
			sortOrder: 0,
			isActive: true,
		});
		setEditingCategory(null);
		setShowForm(false);
	};

	const handleEdit = (category) => {
		setEditingCategory(category);
		setForm({
			name: category.name || "",
			description: category.description || "",
			icon: category.icon || "Store",
			color: category.color || "#f97316",
			sortOrder: category.sortOrder || 0,
			isActive: category.isActive !== false,
		});
		setShowForm(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Generate slug from name
			const slug = form.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

			const categoryData = {
				...form,
				slug,
			};

			if (editingCategory) {
				await categoryAPI.update(editingCategory._id, categoryData);
			} else {
				await categoryAPI.create(categoryData);
			}

			setRefetchKey((prev) => prev + 1);
			resetForm();
		} catch (error) {
			console.error("Error saving category:", error);
			alert(error.response?.data?.message || "Failed to save category");
		} finally {
			setIsSubmitting(false);
		}
	};

	const toggleCategoryStatus = async (category, isActive) => {
		try {
			await categoryAPI.update(category._id, { isActive });
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error updating category status:", error);
			alert(
				error.response?.data?.message ||
					"Failed to update category status",
			);
		}
	};

	const deleteCategory = async () => {
		if (!deleteTarget) return;

		try {
			await categoryAPI.delete(deleteTarget._id);
			setRefetchKey((prev) => prev + 1);
			setDeleteTarget(null);
		} catch (error) {
			console.error("Error deleting category:", error);
			alert(error.response?.data?.message || "Failed to delete category");
		}
	};

	// Get icon preview URL (for common Lucide icons, we'll show a colored box)
	const getIconPreview = (iconName, color) => {
		const commonIcons = [
			"Store",
			"UtensilsCrossed",
			"Scissors",
			"Wrench",
			"Pill",
			"Smartphone",
			"ShoppingBasket",
			"BookOpen",
			"Car",
		];
		if (commonIcons.includes(iconName)) {
			return (
				<div
					className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
					style={{ backgroundColor: color }}
				>
					{iconName[0]}
				</div>
			);
		}
		return (
			<div
				className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
				style={{ backgroundColor: color }}
			>
				T
			</div>
		);
	};

	const columns = [
		{
			key: "color",
			label: "",
			className: "w-10",
			render: (row) => (
				<div
					className="w-6 h-6 rounded-lg shadow-sm"
					style={{ backgroundColor: row.color || "#f97316" }}
				/>
			),
		},
		{
			key: "name",
			label: "Name",
			render: (row) => (
				<div className="flex items-center gap-2">
					{getIconPreview(row.icon, row.color)}
					<span className="text-sm font-semibold text-gray-900">
						{row.name}
					</span>
				</div>
			),
		},
		{
			key: "slug",
			label: "Slug",
			render: (row) => (
				<span className="text-xs font-mono text-gray-500">
					{row.slug}
				</span>
			),
		},
		{
			key: "description",
			label: "Description",
			render: (row) => (
				<p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
					{row.description || (
						<span className="text-gray-300 italic">
							No description
						</span>
					)}
				</p>
			),
		},
		{
			key: "order",
			label: "Order",
			render: (row) => (
				<span className="text-sm text-gray-600">
					{row.sortOrder || 0}
				</span>
			),
		},
		{
			key: "businesses",
			label: "Businesses",
			render: (row) => (
				<span className="text-sm font-medium text-gray-700">
					{row.businessCount || 0}
				</span>
			),
		},
		{
			key: "status",
			label: "Status",
			render: (row) => (
				<button
					onClick={(e) => {
						e.stopPropagation();
						toggleCategoryStatus(row, !row.isActive);
					}}
					className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
						row.isActive !== false
							? "bg-green-100 text-green-700 hover:bg-green-200"
							: "bg-gray-100 text-gray-500 hover:bg-gray-200"
					}`}
				>
					{row.isActive !== false ? "Active" : "Inactive"}
				</button>
			),
		},
		{
			key: "actions",
			label: "",
			cellClassName: "text-right",
			render: (row) => (
				<div className="flex items-center justify-end gap-1">
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleEdit(row);
						}}
						className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
						title="Edit category"
					>
						<Edit2 className="w-3.5 h-3.5 text-blue-500" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setDeleteTarget(row);
						}}
						className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
						title="Delete category"
					>
						<Trash2 className="w-3.5 h-3.5 text-red-500" />
					</button>
				</div>
			),
		},
	];

	// Category Form Modal
	const CategoryFormModal = () => {
		if (!showForm) return null;

		return (
			<>
				<div
					className="fixed inset-0 bg-black/50 z-50"
					onClick={resetForm}
				/>
				<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
					<div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-2xl">
						<h3 className="text-lg font-bold text-gray-900">
							{editingCategory ? "Edit Category" : "New Category"}
						</h3>
						<button
							onClick={resetForm}
							className="p-1 rounded-lg hover:bg-gray-100"
						>
							✕
						</button>
					</div>
					<form onSubmit={handleSubmit} className="p-5 space-y-4">
						{/* Name */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Name *
							</label>
							<input
								type="text"
								value={form.name}
								onChange={(e) =>
									setForm({ ...form, name: e.target.value })
								}
								className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								required
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Description
							</label>
							<textarea
								value={form.description}
								onChange={(e) =>
									setForm({
										...form,
										description: e.target.value,
									})
								}
								rows={2}
								className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
							/>
						</div>

						{/* Icon and Color */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Icon (Lucide name)
								</label>
								<input
									type="text"
									value={form.icon}
									onChange={(e) =>
										setForm({
											...form,
											icon: e.target.value,
										})
									}
									placeholder="e.g. Store"
									className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
								/>
								<p className="text-[10px] text-gray-400 mt-0.5">
									Common: Store, UtensilsCrossed, Scissors,
									Wrench, Pill
								</p>
							</div>
							<div>
								<label className="block text-xs font-semibold text-gray-600 mb-1">
									Color
								</label>
								<div className="flex items-center gap-2">
									<input
										type="color"
										value={form.color}
										onChange={(e) =>
											setForm({
												...form,
												color: e.target.value,
											})
										}
										className="w-10 h-10 rounded-lg border-0 cursor-pointer"
									/>
									<input
										type="text"
										value={form.color}
										onChange={(e) =>
											setForm({
												...form,
												color: e.target.value,
											})
										}
										className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
									/>
								</div>
							</div>
						</div>

						{/* Sort Order */}
						<div>
							<label className="block text-xs font-semibold text-gray-600 mb-1">
								Sort Order
							</label>
							<input
								type="number"
								value={form.sortOrder}
								onChange={(e) =>
									setForm({
										...form,
										sortOrder: Number(e.target.value),
									})
								}
								className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
							/>
						</div>

						{/* Active Status */}
						<div className="flex items-center justify-between py-2">
							<label className="text-sm text-gray-700 font-medium">
								Active
							</label>
							<button
								type="button"
								onClick={() =>
									setForm({
										...form,
										isActive: !form.isActive,
									})
								}
								className={`w-11 h-6 rounded-full transition-colors relative ${
									form.isActive
										? "bg-orange-500"
										: "bg-gray-300"
								}`}
							>
								<div
									className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
										form.isActive
											? "translate-x-6"
											: "translate-x-1"
									}`}
								/>
							</button>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
						>
							{isSubmitting
								? "Saving..."
								: editingCategory
									? "Update Category"
									: "Create Category"}
						</button>
					</form>
				</div>
			</>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-4 max-w-7xl mx-auto">
			<PageHeader
				title="Categories"
				subtitle={`${categories.length} categories`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
				actions={
					<button
						onClick={() => setShowForm(true)}
						className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
					>
						<Plus className="w-3.5 h-3.5" /> Add Category
					</button>
				}
			/>

			<DataTable
				columns={columns}
				data={categories}
				emptyIcon={Tags}
				emptyMessage="No categories yet. Click 'Add Category' to create one."
			/>

			<CategoryFormModal />

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
				title="Delete Category?"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This will not delete businesses using this category, but they will become uncategorized.`}
				onConfirm={deleteCategory}
				destructive
			/>
		</div>
	);
}
