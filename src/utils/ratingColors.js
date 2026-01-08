export function getRatingColor(rating) {
  if (rating > 10) return "rating-circle rating-gold";
  if (rating <= 10 && rating >= 9.0) return "rating-circle rating-dark-green";
  if (rating < 9.0 && rating >= 8.0) return "rating-circle rating-green";
  if (rating < 8.0 && rating >= 7.0) return "rating-circle rating-light-green";
  if (rating < 7.0 && rating >= 5.0) return "rating-circle rating-orange";
  return "rating-circle rating-red";
}
