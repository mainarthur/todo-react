import ObjectStore from './ObjectStore'

export default class Database {
  db: IDBDatabase

  constructor(db: IDBDatabase) {
    this.db = db
  }

  getStore(storeName: string, mode: IDBTransactionMode = 'readwrite'): ObjectStore {
    const transaction = this.db.transaction(storeName, mode)

    return new ObjectStore(transaction.objectStore(storeName))
  }
}
