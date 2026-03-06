export const mapBatchProgress = (itemIndex: number, totalItems: number, itemProgress: number): number => {
  if (totalItems <= 1) {
    return itemProgress;
  }

  const normalizedItemProgress = Math.max(0, Math.min(99, itemProgress));
  return Math.max(1, Math.min(99, Math.round((itemIndex * 100 + normalizedItemProgress) / totalItems)));
};
