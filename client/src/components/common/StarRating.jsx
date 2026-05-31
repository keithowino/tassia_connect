import { Star } from "lucide-react";

const StarRating = ({
	rating,
	max = 5,
	size = 16,
	interactive = false,
	onChange,
}) => {
	// Calculate full, half, and empty stars
	const getStarType = (index) => {
		const starValue = index + 1;
		if (starValue <= Math.floor(rating)) return "full";
		if (starValue <= Math.ceil(rating) && rating % 1 !== 0) return "half";
		return "empty";
	};

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: max }, (_, i) => {
				const starType = getStarType(i);
				const filled = starType === "full";
				const half = starType === "half";

				return (
					<button
						key={i}
						type={interactive ? "button" : undefined}
						onClick={
							interactive && onChange
								? () => onChange(i + 1)
								: undefined
						}
						className={
							interactive
								? "cursor-pointer hover:scale-110 transition-transform"
								: "cursor-default"
						}
						disabled={!interactive}
					>
						{half ? (
							<div className="relative">
								<Star
									size={size}
									className="text-gray-300 fill-gray-300"
								/>
								<div className="absolute inset-0 overflow-hidden w-1/2">
									<Star
										size={size}
										className="text-amber-400 fill-amber-400"
									/>
								</div>
							</div>
						) : (
							<Star
								size={size}
								className={
									filled
										? "text-amber-400 fill-amber-400"
										: "text-gray-300 fill-gray-300"
								}
							/>
						)}
					</button>
				);
			})}
		</div>
	);
};

export default StarRating;
