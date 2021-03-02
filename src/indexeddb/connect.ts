
export function connectDB(name: string, version?: number): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
        const openRequest = indexedDB.open(name, version)

        openRequest.addEventListener("success", (ev) => {
            res(openRequest.result)
        })

        openRequest.addEventListener("error", () => {
            rej(openRequest.error)
        })
    })
}