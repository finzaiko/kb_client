import { JetView } from "webix-jet";
import { API_URL, COOKIE_NAME } from "../config/config";
import { defaultHeader } from "../helpers/api";
import { userProfile } from "../models/UserProfile";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "button",
          label: "User info",
          click: function () {
            webix
              .ajax()
              .headers(defaultHeader())
              .get(`${API_URL}/user/profile`)
              .then((a) => {
                var b = a.json();

              });
          },
        },
        {
          view: "button",
          label: "Check status",
          click: function () {
            webix
              .ajax()
              .headers(defaultHeader())
              .post(`${API_URL}/user/status`)
              .then((a) => {
                var b = a.json();

              });
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
                // label: "Username",
                name: "username",
                value: `${userProfile.username} (${userProfile.username})`,
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
