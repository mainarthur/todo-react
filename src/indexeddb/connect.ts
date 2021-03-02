export const defaultStoreName = 'main-store';

export function connectDB(name: string,
  version?: number,
  storeName: string = defaultStoreName): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const openRequest = indexedDB.open(name, version);

    openRequest.addEventListener('success', () => {
      const db = openRequest.result;

      db.addEventListener('versionchange', () => {
        db.close();
        window.location.reload();
      });

      res(db);
    });

    openRequest.addEventListener('upgradeneeded', () => {
      const db = openRequest.result;
      let store;

      if (!db.objectStoreNames.contains(storeName)) {
        store = db.createObjectStore(storeName, {
          keyPath: '_id',
        });
      } else {
        store = openRequest.transaction.objectStore(storeName);
      }

      if (store) {
        if (!store.indexNames.contains('_id')) {
          store.createIndex('_id', '_id');
        }
        if (!store.indexNames.contains('position')) {
          store.createIndex('position', 'position');
        }
      }
    });

    openRequest.addEventListener('error', () => {
      rej(openRequest.error);
    });

    openRequest.addEventListener('blocked', () => {
      rej(new Error('Connection blocked'));
    });
  });
}
