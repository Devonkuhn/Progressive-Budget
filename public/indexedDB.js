export function checkForIndexedDb() {
    if (!window.indexedDB) {
      console.log("No stable version of IndexedDB.");
      return false;
    }
    return true;
  }
  
  export function useIndexedDb(databaseName, storeName, method, object) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, 1);
      let db,
        tx,
        store;
  
      request.onupgradeneeded = function(evt) {
        const db = request.result;
        db.createObjectStore(storeName, { keyPath: "_id" });
      };
  
      request.onerror = function(evt) {
        console.log("error");
      };
  
      request.onsuccess = function(evt) {
        db = request.result;
        tx = db.transaction(storeName, "readwrite");
        store = tx.objectStore(storeName);
  
        db.onerror = function(evt) {
          console.log("error");
        };
        if (method === "put") {
          store.put(object);
        } else if (method === "get") {
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
        } else if (method === "delete") {
          store.delete(object._id);
        }
        tx.oncomplete = function() {
          db.close();
        };
      };
    });
  }