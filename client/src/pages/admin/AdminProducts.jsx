import { useState, useEffect } from "react";
import { Package, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { format } from "date-fns";
import { productAPI, businessAPI } from "../../lib/api";
import PageHeader from "../../components/admin/PageHeader";
import SearchFilter from "../../components/admin/SearchFilter";
import DataTable from "../../components/admin/DataTable";
import StatusBadge from "../../components/admin/StatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [availFilter, setAvailFilter] = useState("all");
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [refetchKey, setRefetchKey] = useState(0);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const response = await productAPI.getAll();
			setProducts(response.data || []);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, [refetchKey]);

	const toggleAvailability = async (product) => {
		try {
			await productAPI.update(product._id, {
				isAvailable: !product.isAvailable,
			});
			setRefetchKey((prev) => prev + 1);
		} catch (error) {
			console.error("Error toggling availability:", error);
			alert(
				error.response?.data?.message ||
					"Failed to update product availability",
			);
		}
	};

	const deleteProduct = async (productId) => {
		try {
			await productAPI.delete(productId);
			setRefetchKey((prev) => prev + 1);
			setDeleteTarget(null);
		} catch (error) {
			console.error("Error deleting product:", error);
			alert(error.response?.data?.message || "Failed to delete product");
		}
	};

	const filtered = products.filter((p) => {
		const businessName = p.businessId?.businessName || "";
		const matchSearch =
			!search ||
			p.name?.toLowerCase().includes(search.toLowerCase()) ||
			businessName.toLowerCase().includes(search.toLowerCase());
		const matchAvail =
			availFilter === "all" ||
			(availFilter === "available" ? p.isAvailable : !p.isAvailable);
		return matchSearch && matchAvail;
	});

	// Helper to get product image (handles both images array and image_url)
	const getProductImage = (product) => {
		if (product.images && product.images.length > 0) {
			return product.images[0];
		}
		return product.image_url || null;
	};

	const columns = [
		{
			key: "product",
			label: "Product",
			render: (row) => {
				const productImage = getProductImage(row);
				return (
					<div className="flex items-center gap-3">
						{productImage ? (
							<img
								src={productImage}
								alt=""
								className="w-10 h-10 rounded-lg object-cover"
							/>
						) : (
							<div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
								<Package className="w-4 h-4 text-gray-400" />
							</div>
						)}
						<div className="min-w-0">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{row.name}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{row.businessId?.businessName || "—"}
							</p>
						</div>
					</div>
				);
			},
		},
		{
			key: "category",
			label: "Category",
			render: (row) => (
				<span className="text-sm text-gray-700 capitalize">
					{row.category || "—"}
				</span>
			),
		},
		{
			key: "price",
			label: "Price",
			render: (row) => (
				<span className="text-sm font-semibold text-gray-900">
					KES {(row.price || 0).toLocaleString()}
				</span>
			),
		},
		{
			key: "stock",
			label: "Stock",
			render: (row) => (
				<span
					className={`text-sm ${(row.stock || 0) < 10 ? "text-orange-600 font-medium" : "text-gray-700"}`}
				>
					{row.stock ?? "—"}
					{(row.stock || 0) < 10 && row.stock > 0 && (
						<span className="text-xs text-orange-500 ml-1">
							(Low)
						</span>
					)}
					{row.stock === 0 && (
						<span className="text-xs text-red-500 ml-1">(Out)</span>
					)}
				</span>
			),
		},
		{
			key: "available",
			label: "Available",
			render: (row) => (
				<StatusBadge
					status={row.isAvailable ? "active" : "suspended"}
				/>
			),
		},
		{
			key: "date",
			label: "Added",
			render: (row) => (
				<span className="text-xs text-gray-500">
					{row.createdAt
						? format(new Date(row.createdAt), "MMM d, yyyy")
						: "—"}
				</span>
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
							toggleAvailability(row);
						}}
						className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
						title={
							row.isAvailable
								? "Mark as unavailable"
								: "Mark as available"
						}
					>
						{row.isAvailable ? (
							<ToggleRight className="w-4 h-4 text-emerald-500" />
						) : (
							<ToggleLeft className="w-4 h-4 text-gray-400" />
						)}
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setDeleteTarget(row);
						}}
						className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
						title="Delete product"
					>
						<Trash2 className="w-3.5 h-3.5 text-red-500" />
					</button>
				</div>
			),
		},
	];

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
				title="Products"
				subtitle={`${products.length} total products`}
				onRefresh={() => setRefetchKey((prev) => prev + 1)}
			/>

			<SearchFilter
				search={search}
				onSearchChange={setSearch}
				filters={[
					{
						key: "available",
						value: availFilter,
						onChange: setAvailFilter,
						placeholder: "Availability",
						allLabel: "All",
						options: [
							{ value: "available", label: "Available" },
							{ value: "unavailable", label: "Unavailable" },
						],
					},
				]}
			/>

			<DataTable
				columns={columns}
				data={filtered}
				emptyIcon={Package}
				emptyMessage="No products found"
			/>

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
				title="Delete Product?"
				description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
				onConfirm={() => deleteProduct(deleteTarget._id)}
				destructive
			/>
		</div>
	);
}
