export function priceHistogram(values, bucketCount = 12) {
  if (!values.length) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return [{ label: `${Math.round(min)}`, min, max, count: values.length }]
  const step = (max - min) / bucketCount
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    min: min + i * step,
    max: min + (i + 1) * step,
    count: 0,
  }))
  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / step), bucketCount - 1)
    buckets[idx].count++
  }
  return buckets.map(b => ({
    ...b,
    label: `${Math.round(b.min)}-${Math.round(b.max)}`,
  }))
}
