export function getRelativeTimeString(date: Date | number): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === 'number' ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  let deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array representing one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year',
  ];

  // Find the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );

  // Create an object to store the relative time values for each unit
  const relativeValues: Record<string, number> = {};

  // Calculate the relative time values for hours, minutes, and seconds
  // eslint-disable-next-line no-plusplus
  for (let i = unitIndex; i >= 0; i--) {
    const divisor = i ? cutoffs[i - 1] : 1;
    const unit = units[i];
    relativeValues[unit] = Math.floor(deltaSeconds / divisor);
    deltaSeconds -= relativeValues[unit] * divisor;
  }

  // Build the relative time string
  const relativeTimeString = Object.entries(relativeValues)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value !== 0)
    .map(([unit, value]) => `${value} ${unit}${value !== 1 ? 's' : ''}`)
    .join(' ');

  return `${relativeTimeString} ago`;
}

export default getRelativeTimeString;
