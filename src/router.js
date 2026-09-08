import { useEffect, useState } from 'react'
import { getCategory } from './data/categories'

export function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return parseRoute(hash)
}

function parseRoute(hash) {
  const clean = hash.replace(/^#\/?/, '').split('?')[0]
  const parts = clean.split('/').filter(Boolean)

  if (parts.length >= 2 && parts[0] === 'category') {
    const name = decodeURIComponent(parts.slice(1).join('/'))
    return { page: 'category', category: getCategory(name), categoryName: name }
  }

  return { page: 'home' }
}

export function navigate(path) {

  if (window.location.hash === `#${path}`) {
    if (path === '/') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }

  window.location.hash = path

  if (path !== '/') {
    window.scrollTo({ top: 0 })
  }
}

export function categoryPath(name) {
  return `#/category/${encodeURIComponent(name)}`
}
