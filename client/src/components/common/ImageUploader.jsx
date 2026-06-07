import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadAPI } from "../../lib/api";

export default function ImageUploader({
	onUploadComplete,
	currentImage,
	label = "Upload Image",
	accept = "image/*",
	maxSize = 5,
}) {
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState(currentImage || null);
	const [error, setError] = useState(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		setPreview(currentImage || null);
	}, [currentImage]);

	const handleFileSelect = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		console.log("Selected file:", file.name, file.type, file.size);

		if (file.size > maxSize * 1024 * 1024) {
			setError(`File size must be less than ${maxSize}MB`);
			return;
		}

		if (!file.type.startsWith("image/")) {
			setError("Please select an image file");
			return;
		}

		setUploading(true);
		setError(null);

		// Show preview immediately
		const reader = new FileReader();
		reader.onloadend = () => setPreview(reader.result);
		reader.readAsDataURL(file);

		try {
			const formData = new FormData();
			formData.append("image", file);

			console.log("Uploading to:", "/api/upload/single");
			const response = await uploadAPI.uploadSingle(formData);
			console.log("Upload response:", response.data);

			// Only call onUploadComplete with the URL
			// DO NOT pass null or empty string
			if (response.data?.url) {
				onUploadComplete(response.data.url);
			} else {
				setError("Upload failed: No URL returned");
				// Keep the existing preview
				setPreview(currentImage || null);
			}
		} catch (err) {
			console.error("Upload error details:", err);
			console.error("Error response:", err.response?.data);
			setError(err.response?.data?.message || "Upload failed");
			// Keep existing image, don't clear it
			setPreview(currentImage || null);
			// DO NOT call onUploadComplete with null - this would clear the image!
		} finally {
			setUploading(false);
		}
	};

	const handleRemove = () => {
		setPreview(null);
		onUploadComplete(null); // This is intentional - user wants to remove
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="space-y-3">
			{label && (
				<label className="block text-sm font-semibold text-gray-700">
					{label}
				</label>
			)}

			<div className="flex flex-col sm:flex-row gap-4">
				{/* Preview / Upload Area */}
				<div
					onClick={() => !preview && fileInputRef.current?.click()}
					className={`relative w-full sm:w-32 h-32 rounded-2xl border-2 border-dashed flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-orange-400 group
                    ${preview ? "border-gray-200" : "border-gray-300"}`}
				>
					{preview ? (
						<>
							<img
								src={preview}
								alt="Preview"
								className="w-full h-full object-cover"
							/>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove();
								}}
								className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
							>
								<X size={16} />
							</button>
						</>
					) : (
						<div className="flex flex-col items-center text-center">
							{uploading ? (
								<Loader2
									size={28}
									className="animate-spin text-orange-500"
								/>
							) : (
								<>
									<div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
										<Upload
											size={24}
											className="text-orange-500"
										/>
									</div>
									<span className="text-xs text-gray-500 font-medium">
										Tap to upload
									</span>
								</>
							)}
						</div>
					)}
				</div>

				{/* URL Fallback */}
				<div className="flex-1 space-y-2">
					<input
						type="url"
						placeholder="Or paste image URL here..."
						value={currentImage || ""}
						onChange={(e) => onUploadComplete(e.target.value)}
						className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
					/>
					<p className="text-[10px] text-gray-400">
						Max {maxSize}MB • JPG, PNG, WEBP supported
					</p>
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				onChange={handleFileSelect}
				className="hidden"
			/>

			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}
