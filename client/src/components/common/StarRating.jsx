import { Star } from "lucide-react";

const StarRating = ({
	rating,
	max = 5,
	size = 16,
	interactive = false,
	onChange,
}) => {
	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: max }, (_, i) => {
				const filled = i + 1 <= Math.round(rating);
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
						<Star
							size={size}
							className={
								filled
									? "text-amber-400 fill-amber-400"
									: "text-gray-300 fill-gray-300"
							}
						/>
					</button>
				);
			})}
		</div>
	);
};

export default StarRating;
