import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, reviewCount = null, size = 'sm', showNumber = true }) {
  const numRating = Number(rating) || 5;
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              numRating >= star
                ? 'fill-amber-400 text-amber-400'
                : numRating >= star - 0.5
                ? 'fill-amber-200 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-slate-800">
          {numRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-slate-500">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

