export async function safeFetch(url, opts) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Network error')
  }
  return res.json()
}
