import { JetView } from "webix-jet";
import { APP_NAME } from "../config/config";
import { getScreenSize } from "../helpers/ui";
import { getUserDecoded } from "../models/UserProfile";
import { isOnline, state as stateSW } from "../models/ServiceWorker";

export default class LoginView extends JetView {
  config() {
    function beforeLogin(_this) {
      let winUI = {
        view: "window",
        fullscreen: true,
        borderless: true,
        css: "z_win_login_loading",
        head: false,
        type: "clean",
        body: {
          template: `
        <div class='z_loading_panel'>
          <div class='z_loading_app_name'>${APP_NAME}</div>
          <div>Loading..</div>
        </div>
        `,
        },
        on: {
          onShow() {
            const user = getUserDecoded();
            setTimeout(() => {
              _this.$$("login:form").setValues(user);
              _this.do_login();
            }, 700);
            setTimeout(() => {
              this.close();
            }, 1000);
          },
        },
      };
      webix.ui(winUI).show();
    }

    function uiWide(_this) {
      return {
        cols: [
          {},
          {
            localId: "login:top",
            css: "z_login_panel",
            rows: [
              {},
              {
                type: "header",
                template: APP_NAME,
                height: 60,
                css: "z_login_app_name",
              },
              {
                css: "z_login_form",
                view: "form",
                localId: "login:form",
                width: 400,
                borderless: false,
                margin: 10,
                rows: [
                  {
                    view: "text",
                    name: "login",
                    label: "User Name",
                    labelPosition: "top",
                  },
                  {
                    view: "text",
                    type: "password",
                    name: "pass",
                    label: "Password",
                    labelPosition: "top",
                  },
                  {
                    view: "button",
                    value: "Login",
                    css: "webix_primary",
                    click: () => _this.do_login(),
                    hotkey: "enter",
                  },
                ],
                rules: {
                  login: webix.rules.isNotEmpty,
                  pass: webix.rules.isNotEmpty,
                },
              },
              {},
            ],
          },
          {},
        ],
      };
    }

    function uiSmall(_this) {
      webix.ui.fullScreen();

      return {
        localId: "login:top",
        css: "z_app_login_panel",
        rows: [
          {},
          {
            type: "header",
            template: APP_NAME,
            height: 60,
            css: "z_login_app_name",
          },
          {
            view: "form",
            localId: "login:form",
            borderless: false,
            margin: 10,
            css: "z_login_form",
            rows: [
              {
                view: "text",
                name: "login",
                label: "User Name",
                labelPosition: "top",
              },
              {
                view: "text",
                type: "password",
                name: "pass",
                label: "Password",
                labelPosition: "top",
              },
              {
                view: "button",
                value: "Login",
                css: "webix_primary",
                click: () => _this.do_login(),
                hotkey: "enter",
              },
            ],
            rules: {
              login: webix.rules.isNotEmpty,
              pass: webix.rules.isNotEmpty,
            },
          },
          {},
        ],
      };
    }
    const user = getUserDecoded();
    if (Object.keys(user).length !== 0) {
      beforeLogin(this);
    }
    return getScreenSize() == "wide" ? uiWide(this) : uiSmall(this);
  }

  init(view) {
    view.$view.querySelector("input").focus();
  }

  async ready() {
    setTimeout(() => {
      console.log("    stateSW.isOnline", stateSW.isOnline);
    }, 1000);

    const isONline = await isOnline();
    console.log("isONline=====================", isONline);
  }

  do_login() {
    const user = this.app.getService("user");
    const form = this.$$("login:form");
    const ui = this.$$("login:top");

    webix.extend(form, webix.ProgressBar);
    form.disable();
    form.showProgress();

    if (form.validate()) {
      const data = form.getValues();
      user
        .login(data.login, data.pass)
        .catch(function () {
          webix.html.removeCss(ui.$view, "invalid_login");
          form.elements.pass.focus();
          webix.delay(function () {
            webix.html.addCss(ui.$view, "invalid_login");
            form.enable();
            form.hideProgress();
          });
        })
        .finally((_) => {
          form.enable();
          form.hideProgress();
        });
    }
  }
}
