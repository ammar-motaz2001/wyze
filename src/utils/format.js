export function money(value) {
  return `$${Number(value).toFixed(2)}`
}

export function priceOrFree(value) {
  return Number(value) === 0 ? 'FREE' : money(value)
}
