import {
  DB_NAME,
  DB_VERSION,
  PROJECT_STORE_NAME,
  TASK_STORE_NAME,
  COMMENT_STORE_NAME,
} from "../config/config";

function idbOK() {
  return "indexedDB" in window && !/iPad|iPhone|iPod/.test(navigator.platform);
}
export function openIDB(dbVersion) {
  if (typeof dbVersion != "undefined") {
    dbVersion = 1;
  }
  if (!idbOK()) {
    console.log("IndexedDB not support");
    return;
  }

  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, dbVersion);
    console.log("OpenIDB--------------");

    openRequest.onupgradeneeded = function (e) {
      console.log("running onupgradeneeded");
      const db = e.target.result;
      if (!db.objectStoreNames.contains(`${PROJECT_STORE_NAME}`)) {
        db.createObjectStore(`${PROJECT_STORE_NAME}`, {
          autoIncrement: false,
        });
      }
      if (!db.objectStoreNames.contains(`${TASK_STORE_NAME}`)) {
        db.createObjectStore(`${TASK_STORE_NAME}`, {
          autoIncrement: false,
        });
      }
      if (!db.objectStoreNames.contains(`${COMMENT_STORE_NAME}`)) {
        db.createObjectStore(`${COMMENT_STORE_NAME}`, {
          autoIncrement: false,
        });
      }
    };
    openRequest.onsuccess = function (e) {
      console.log("running onsuccess");
      // db = e.target.result;
      resolve(e.target.result);
    };
    openRequest.onerror = function (e) {
      let msg = `Database error: ${theDB.error}`;
      console.error(`openIDB: ${msg}`);
      webix.alert({
        title: "Database Error",
        text: msg,
        type: "alert-error",
      });
      reject(msg);
      console.dir(e);
    };
  });
}

export function addStoreIDB(storeName, data) {
  console.log(`Store: ${storeName} adding...`);

  if (!Array.isArray(data)) {
    console.error("Data must an Array");
    return;
  }

  openIDB(DB_VERSION).then((dbx) => {
    const tx = dbx.transaction([`${storeName}`], "readwrite");
    const store = tx.objectStore(`${storeName}`);
    let request;
    data.forEach((item) => {
      console.log("item", item);

      if (typeof item.id == "undefined") {
        console.error("Data must have an ID");
        return;
      }
      request = store.add(item, item.id);
    });

    request.onerror = function (e) {
      console.log("Error", e.target.error.name);
    };
    request.onsuccess = function (e) {
      console.log(`Ok ${storeName} added`);
    };
  });
}
