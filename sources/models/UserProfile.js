import { AUTH_USER, COOKIE_NAME } from "../config/config";
import { getMe } from "./session";

export let userProfile = {
  userId: 0,
  authEncoded: "",
  username: "",
  fullname: "",
  email: "",
};

export const getUserEncoded = () => {
  return userProfile.authEncoded || webix.storage.cookie.get(AUTH_USER);
};

export const getUserDecoded = () => {
  console.log("getUserEncoded() type", typeof getUserEncoded());
  const userStorage = getUserEncoded();
  if (userStorage !== null) {
    const user = window.atob(userStorage).split(":");
    return { login: user[0], pass: user[1] };
  }
  return {};
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
