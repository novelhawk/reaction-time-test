/**
 * Removes items outside percentile range
 * @param data Sorted datapoints
 * @param minpercentile Minimum acceptable percentile
 * @param maxpercentile Maximum acceptable percentile
 */
export function fastpercentile<T>(
  data: Array<T>,
  minpercentile: number,
  maxpercentile: number,
): Array<T> {
  const minIndex = Math.floor((minpercentile / 100) * data.length);
  const maxIndex = Math.floor((maxpercentile / 100) * data.length);
  return data.slice(minIndex, maxIndex);
}

export function percentile(data: number[], num: number) {
  const score = (value: number) => {
    if (value < num) {
      return 1;
    }
    if (value === num) {
      return 0.5;
    }
    return 0;
  };

  const count = data.reduce((acc, item) => acc + score(item), 0);
  return (100 * count) / data.length;
}
