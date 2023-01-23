import { API_URL, CODE_PREFIX } from "../config/config";
import { getUserEncoded } from "./UserProfile";

const path = "project";

export let state = {
  prefix: CODE_PREFIX + path,
  isEdit: false,
  dataSelected: {},
  selId: null,
};

export let url = `${API_URL}/${path}`;

export function getMyProject() {
  const params = {
    jsonrpc: "2.0",
    method: "getmyProjects",
    id: 2134420212,
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

export function getProjectById(id) {
  const params = {
    jsonrpc: "2.0",
    method: "getProjectById",
    id: 226760253,
    params: {
      project_id: id,
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
