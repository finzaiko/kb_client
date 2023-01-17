import { JetView } from "webix-jet";
import { API_URL, COOKIE_NAME } from "../config/config";
import { defaultHeader } from "../helpers/api";
import { userProfile } from "../models/UserProfile";

const username = "arifin2";
const password = "arifin123";

const credentials = `${username}:${password}`;
const encoded = window.btoa(credentials);

function getMe() {
  const params = {
    jsonrpc: "2.0",
    method: "getMe",
    id: 1718627783,
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    })
    .post(API_URL, params)
    .then((r) => {
      // console.log("r", r.json());
      return r.json().result;
    });
}

function getColumnByProjectId(projectId) {
  // const projectId = 3;
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
      Authorization: `Basic ${encoded}`,
    })
    .post(API_URL, paramscol)
    .then((r) => {
      // console.log("r", r.json());
      return r.json().result[0];
    });
}

function createTask(projectId, colBoardId) {
  const userId = 3;
  // const colBoardId = 9;
  const title = "ggg";
  const descr = "gggg";
  const params = {
    jsonrpc: "2.0",
    method: "createTask",
    id: 1176509098,
    params: {
      owner_id: userId,
      creator_id: userId,
      date_due: "",
      description: descr,
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

  webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    })
    .post(API_URL, params)
    .then((r) => {
      console.log("r", r.json());
    });
}

function createComment(taskId, userId, comment) {
  const params = {
    jsonrpc: "2.0",
    method: "createComment",
    id: 1580417921,
    params: {
      task_id: taskId,
      user_id: userId,
      content: comment,
    },
  };

  return webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result[0]);
}

async function createComment2(taskId, comment) {
  const user = await getMe();
  console.log("userId", user.id);
  createComment(taskId, user.id, comment);
}

function getComments(taskId) {
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
      Authorization: `Basic ${encoded}`,
    })
    .post(API_URL, params)
    .then((r) => r.json().result);
}

export default class TestView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "button",
          label: "Get ME",
          click: async function () {
            const a = await getMe();
            console.log("a", a);
          },
        },
        {
          view: "button",
          label: "Get Projects",
          click: function () {
            const params = {
              jsonrpc: "2.0",
              method: "getmyProjects",
              id: 2134420212,
            };

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
              })
              .post(API_URL, params)
              .then((r) => {
                console.log("r", r.json());
              });
          },
        },
        {
          view: "button",
          label: "Get Project by id=3",
          click: function () {
            const projectId = 3;
            const params = {
              jsonrpc: "2.0",
              method: "getProjectById",
              id: 226760253,
              params: {
                project_id: projectId,
              },
            };

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
              })
              .post(API_URL, params)
              .then((r) => {
                console.log("r", r.json());
              });
          },
        },
        {
          view: "button",
          label: "Get colum by project id=3",
          click: function () {
            const projectId = 3;
            const params = {
              jsonrpc: "2.0",
              method: "getColumns",
              id: 887036325,
              params: [projectId],
            };

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
              })
              .post(API_URL, params)
              .then((r) => {
                console.log("r", r.json());
              });
          },
        },
        {
          view: "button",
          label: "Crate task by project id=3",
          click: function () {
            const projectId = 3;

            getColumnByProjectId(projectId).then((a) => {
              console.log("a", a.id);

              createTask(projectId, a.id);
            });
          },
        },
        {
          view: "button",
          label: "Crate comment by task id=6",
          click: function () {
            const taskId = 6;
            createComment2(taskId, "hello test aja1");
          },
        },
        {
          view: "button",
          label: "Get all comments by task id=6",
          click: async function () {
            const taskId = 6;
            const comm = await getComments(taskId);
            console.log('comm',comm);

          },
        },
        {
          view: "button",
          label: "Logout",
          click: () => {
            this.app
              .getService("user")
              .logout()
              .then((r) => {
                if (r) this.show("/logout");
              });
          },
        },
      ],
    };
  }
  init(view) {}
}

export class ProfileWindow extends JetView {
  config() {
    const _this = this;
    return {
      view: "window",
      modal: true,
      position: "center",
      move: true,
      close: true,
      head: "Profile",
      body: {
        rows: [
          {
            view: "form",
            width: 400,
            padding: 10,
            type: "clean",
            elements: [
              {
                view: "text",
                label: "Username",
                name: "username",
                value: "Dummy User",
                readonly: true,
              },
            ],
          },
          {
            cols: [
              {},
              {
                view: "button",
                label: "Logout",
                css: "webix_danger",
                click: () => {
                  _this.app
                    .getService("user")
                    .logout()
                    .then((r) => {
                      if (r) this.app.show("/logout");
                    });
                },
              },
              {},
            ],
          },
        ],
      },
    };
  }
  show(target) {
    this.getRoot().show(target);
  }
  init(view) {}
  ready(view) {}
}
