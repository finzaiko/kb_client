import { API_URL, AUTH_USER, BACKEND_URL, COOKIE_NAME } from "../config/config";
import { defaultHeader } from "../helpers/api";
import { getUserEncoded, setUserProfile } from "./UserProfile";

export function ping() {
  return webix
    .ajax()
    .timeout(8000)
    .get(BACKEND_URL)
    .then((r) => r.json())
    .fail((err) => {
      webix.alert({
        type: "alert-error",
        title: "Connection Error",
        text: "Please make sure your network setting are correct.",
      });
    });
}

export function getMe(userEncoded) {
  const params = {
    jsonrpc: "2.0",
    method: "getMe",
    id: 1718627783,
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${userEncoded}`,
    })
    .post(API_URL, params)
    .then((r) => r.json())
    .fail((err) => {});
}

function status() {
  return getMe(getUserEncoded()).then((r) => {
    if (typeof r.result != "undefined") {
      setUserProfile(r.result, getUserEncoded());
    }
    return r.id;
  });
}

function login(username, password) {
  const credentials = `${username}:${password}`;
  const authEncoded = window.btoa(credentials);
  return getMe(authEncoded).then((r) => {
    setUserProfile(r.result, authEncoded);
    return r.result;
  });
}

function logout() {
  return new Promise((resolve, reject) => {
    webix.storage.cookie.remove(AUTH_USER);
    webix.storage.cookie.remove(COOKIE_NAME);
    resolve(true);
  });
}

export default {
  status,
  login,
  logout,
};
