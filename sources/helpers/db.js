import { DB_NAME, DB_VERSION, PROJECT_STORE_NAME } from "../config/config";

function openIDB() {
  // Check for support.
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB.");
    return;
  }
  return new Promise((resolve, reject) => {
    let theDB = self.indexedDB.open(DB_NAME, DB_VERSION);

    theDB.onsuccess = function (event) {
      console.log("openIDB: Successfully opened database");
      resolve(event.target.result);
    };

    theDB.onerror = function (event) {
      let msg = `Database error ${theDB.error}`;
      console.error(`openIDB: ${msg}`);
      webix.alert({
        title: "Database Error",
        text: msg,
        type: "alert-error",
      });
      reject(msg);
    };

    theDB.onupgradeneeded = function (event) {
      console.log("openIDB: Database upgrade needed", event);
    };
  });
}

export function writeIDB(item) {
  openIDB().then((db) => {
    const tx = db.transaction([`${PROJECT_STORE_NAME}`], "readwrite");
    item.forEach((data) => {
      tx.objectStore(`${PROJECT_STORE_NAME}`).add(data, data.id);
    });
    return tx.complete;
  });
}

export function readIDB() {
  return new Promise((resolve, reject) => {
    let items = [];
    openIDB()
      .then((db) => {
        let request = db
          .transaction([`${PROJECT_STORE_NAME}`], "readonly")
          .objectStore(`${PROJECT_STORE_NAME}`)
          .openCursor();

        request.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            items.push(cursor.value);
            cursor.continue();
          } else {
            resolve({ db: db, items: items });
          }
        };

        request.onerror = function (event) {
          console.error(request.error);
          reject(request.error);
        };
      })
      .catch((error) => {
        console.error(request.error);
        reject(request.error);
      });
  });
}
