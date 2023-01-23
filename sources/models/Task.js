import { API_URL, BACKEND_URL, CODE_PREFIX } from "../config/config";
import { getUserEncoded } from "./UserProfile";

const path = "task";

export let state = {
  prefix: CODE_PREFIX + path,
  isEdit: false,
  dataSelected: {},
  dataSelectedProject: {},
  selId: null,
  selTaskId: null,
  routePath: "",
  images: [],
  imageView: [],
  fileNameUpload: "",
};

export let url = `${API_URL}/${path}`;

export function getColumnByProjectId(projectId) {
  const paramscol = {
    jsonrpc: "2.0",
    method: "getColumns",
    id: 887036325,
    params: [projectId],
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${getUserEncoded()}`,
    })
    .post(API_URL, paramscol)
    .then((r) => {
      return r.json().result[0];
    });
}

export function createTask(projectId, colBoardId, userId, title, description) {
  const params = {
    jsonrpc: "2.0",
    method: "createTask",
    id: 1176509098,
    params: {
      owner_id: userId,
      creator_id: userId,
      date_due: "",
      description: description,
      category_id: 0,
      score: 0,
      title: title,
      project_id: projectId,
      color_id: "green",
      column_id: colBoardId,
      recurrence_status: 0,
      recurrence_trigger: 0,
      recurrence_factor: 0,
      recurrence_timeframe: 0,
      recurrence_basedate: 0,
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

export function updateTask(id, title, description) {
  const params = {
    jsonrpc: "2.0",
    method: "updateTask",
    id: 1406803059,
    params: {
      id: id,
      title: title,
      description: description,
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

export function getMyTask(projectId) {
  const params = {
    jsonrpc: "2.0",
    method: "getAllTasks",
    id: 133280317,
    params: {
      project_id: projectId,
      status_id: 1,
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

export function getTaskById(taskId) {
  const params = {
    jsonrpc: "2.0",
    method: "getTask",
    id: 700738119,
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
    .then((r) => {

      return r.json().result;
    });
}

export function getFileByTaskId(taskId) {
  const params = {
    jsonrpc: "2.0",
    method: "getAllTaskFiles",
    id: 1880662820,
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
    .then((r) => {

      return r.json().result;
    });
}

export function uploadByTaskId(projectId, taskId, fileName, fileBase64) {
  const params = {
    jsonrpc: "2.0",
    method: "createTaskFile",
    id: 94500810,
    params: [projectId, taskId, fileName, fileBase64],
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

export function removeFile(taskId) {
  const params = {
    jsonrpc: "2.0",
    method: "removeTaskFile",
    id: 447036524,
    params: [taskId],
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

export function imgTemplate(obj) {
  return `<img src="${BACKEND_URL}/data/files/${
    obj.path
  }?${Date.now()}" class="photo_content" ondragstart="return false"/>`;
}

export function imgThumbTemplate(obj) {
  // return `<div style="background-image: url(${BACKEND_URL}/data/files/thumbnails/${obj.path}?${Date.now()});" class="content"></div>`;
  return `<img src="${BACKEND_URL}/data/files/thumbnails/${
    obj.path
  }?${Date.now()}" class="photo_content" ondragstart="return false"/>`;
}
