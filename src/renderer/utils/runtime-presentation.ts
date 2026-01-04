export const formatDurationMs = (value?: number): string => {
  if (value === undefined || value < 0) {
    return '--:--';
  }

  const totalSeconds = Math.floor(value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatSpeed = (value?: number): string => {
  if (value === undefined || Number.isNaN(value)) {
    return '--';
  }

  return `${value.toFixed(2)}x`;
};
