import { AUTH_USER, COOKIE_NAME } from "../config/config";
import { getMe } from "./session";

export let userProfile = {
  userId: 0,
  authEncoded: "",
  username: "",
  fullname: "",
  email: "",
};

// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch (e) {
//     return null;
//   }
// };

export const getUserEncoded = () => {
  return userProfile.authEncoded || webix.storage.cookie.get(AUTH_USER);
};

export const setUserProfile = (dataProfile, userEncoded) => {
  webix.storage.cookie.put(AUTH_USER, userEncoded);
  if (userEncoded && dataProfile) {
    userProfile.userEncoded = userEncoded;
    userProfile.username = dataProfile.username;
    userProfile.fullname = dataProfile.name;
    userProfile.email = dataProfile.email;
    userProfile.userId = dataProfile.id;
  } else {
    userProfile = {};
  }
};

