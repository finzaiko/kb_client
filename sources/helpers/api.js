// import { getToken } from "../models/UserProfile";

export function defaultHeader() {
  return {
    "Content-Type": "application/json",
  };
}

export function setAppHeader(headers) {
  headers["Content-type"] = "application/json";
  // headers["Authorization"] = "Bearer " + getToken();
}

// export const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch (e) {
//     return null;
//   }
// };

// export const mergeByKey = (array1, array1Key, array2, array2Key) =>
export const mergeByKey = (array1, array2) =>
  array1.map((itm) => ({
    ...array2.find((item) => item.id === itm.column_id && item),
    // ...array2.find((item) => item[array2Key] === itm[array1Key] && item),
    ...itm,
  }));
