import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// const AuthsKey = 'Admin-Auths'

// export function getAuths() {
//   return Cookies.get(AuthsKey)
// }

// export function setAuths(auths) {
//   return Cookies.set(AuthsKey, auths)
// }

// export function removeAuths() {
//   return Cookies.remove(AuthsKey)
// }

