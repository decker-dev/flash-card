import { serialize, parse } from 'cookie'

export function setCookie(name: string, value: any, options: any = {}) {
  document.cookie = serialize(name, JSON.stringify(value), {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    ...options,
  })
}

export function getCookie(name: string) {
  const cookies = parse(document.cookie)
  const value = cookies[name]
  return value ? JSON.parse(value) : null
}

export function deleteCookie(name: string) {
  document.cookie = serialize(name, '', {
    maxAge: -1,
    path: '/',
  })
}

