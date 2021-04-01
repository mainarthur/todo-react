export const emailRegexp: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
export const nameRegexp: RegExp = /^([a-z]{2,}|[а-яё]{2,})$/i
export const passwordRegexp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,255}$/

export function isValidEmail(email: string): boolean {
  return emailRegexp.test(email.toLowerCase())
}

export function isValidName(name: string): boolean {
  return nameRegexp.test(name.toLowerCase())
}

export function isValidPassword(password: string): boolean {
  return password.match(passwordRegexp) != null
}
