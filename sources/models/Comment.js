import { API_URL, CODE_PREFIX } from "../config/config";
import { getUserEncoded } from "./UserProfile";

const path = "comment";

export let state = {
  prefix: CODE_PREFIX + path,
  isEdit: false,
  dataSelected: {},
  dataComments: [],
  selId: null,
};

export let url = `${API_URL}/${path}`;

export function getAllComment(taskId) {
  const params = {
    jsonrpc: "2.0",
    method: "getAllComments",
    id: 148484683,
    params: {
      task_id: taskId,
    },
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result);
}

export function createComment(taskId, userId, content) {
  const params = {
    jsonrpc: "2.0",
    method: "createComment",
    id: 1580417921,
    params: {
      task_id: taskId,
      user_id: userId,
      content: content,
    },
  };
  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result);
}

export function updateComment(id, content) {
  const params = {
    jsonrpc: "2.0",
    method: "updateComment",
    id: 496470023,
    params: {
      id: id,
      content: content,
    },
  };
  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result);
}

export function removeComment(id) {
  const params = {
    "jsonrpc": "2.0",
    "method": "removeComment",
    "id": 328836871,
    "params": {
        "comment_id": id
    }
};
  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result);
}
