const emailRegexp: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegexp: RegExp = /^([a-z]{2,}|[а-яё]{2,})$/

export function uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c: string): string {
        let r: number = (Math.random() * 16) | 0
        let v: number = c == "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    });
}

export function isValidEmail(email: string): boolean {
    return emailRegexp.test(email.toLowerCase())
}

export function isValidName(name: string): boolean {
    return nameRegexp.test(name.toLowerCase())
}

export function isValidPassword(password: string): boolean {
    return password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,255}$/) != null
}
