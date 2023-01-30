import { API_URL } from "../config/config";
import { getUserEncoded } from "./UserProfile";

export function getUser(id) {
  const params = {
    jsonrpc: "2.0",
    method: "getUser",
    id: 1769674781,
    params: {
      user_id: parseInt(id),
    },
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })

    .post(API_URL, params)
    .then((r) => {
      return r.json().result;
    });
}
