export default class ObjectStore {
  store: IDBObjectStore

  constructor(store: IDBObjectStore) {
    this.store = store
  }

  put = (data: any, key?: IDBValidKey) => new Promise<void>((res, rej) => {
    const request = this.store.put(data, key)

    request.addEventListener('success', () => {
      res()
    })

    request.addEventListener('error', () => {
      rej(request.error)
    })
  })

  getAll = <T>(
    query?: IDBValidKey | IDBKeyRange,
    count?: number,
  ) => new Promise<T[]>((res, rej) => {
    const request = this.store.getAll(query, count)

    request.addEventListener('success', () => {
      res(request.result)
    })

    request.addEventListener('error', () => {
      rej(request.error)
    })
  })

  delete = (key: IDBValidKey | IDBKeyRange) => new Promise<void>((res, rej) => {
    const request = this.store.delete(key)

    request.addEventListener('success', () => {
      res()
    })

    request.addEventListener('error', () => {
      rej(request.error)
    })
  })
}
