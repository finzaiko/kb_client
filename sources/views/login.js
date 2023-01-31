import { JetView } from "webix-jet";
import { APP_NAME } from "../config/config";
import { getScreenSize } from "../helpers/ui";

export default class LoginView extends JetView {
  config() {
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

    return getScreenSize() == "wide" ? uiWide(this) : uiSmall(this);
  }

  init(view) {
    view.$view.querySelector("input").focus();
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
