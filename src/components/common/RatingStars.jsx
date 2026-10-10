import React from 'react';

const RatingStars = ({ rating = 5.0, numReviews = null, size = '16px', showNum = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="inline-flex items-center gap-1 text-tertiary">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span
            key={`full-${i}`}
            className="material-symbols-outlined"
            style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        ))}
        {hasHalfStar && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
          >
            star_half
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span
            key={`empty-${i}`}
            className="material-symbols-outlined opacity-40 text-secondary"
            style={{ fontSize: size }}
          >
            star
          </span>
        ))}
      </div>

      {showNum && (
        <span className="font-label text-xs font-bold text-on-surface ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}

      {numReviews !== null && (
        <span className="font-body text-xs text-secondary">
          ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
