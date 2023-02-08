import { JetView } from "webix-jet";
import { APP_NAME } from "../config/config";
import { getScreenSize, isInt, isMobileDevice } from "../helpers/ui";
import { getMyProject, state } from "../models/Project";
import { installApp, state as stateSW } from "../models/ServiceWorker";
import { ProfileWindow } from "./profile";

export default class AppView extends JetView {
  config() {
    const offlineStatus = {
      view: "template",
      height: 14,
      id: "app_offline",
      css: "app_offline_status",
      hidden: true,
    };

    function uiWide() {
      const header = {
        view: "toolbar",
        css: "z_navbar border_navbar",
        height: 42,
        cols: [
          {
            width: 38,
          },
          {
            view: "template",
            type: "clean",
            css: "z_app_name_tmpl",
            template: `<span class='z_app_name_title'>${APP_NAME}</span>`,
          },
          {
            view: "icon",
            id: "app:setting",
            icon: "mdi mdi-dots-vertical",
            popup: {
              view: "popup",
              width: 150,
              body: {
                view: "list",
                data: [
                  {
                    id: "app_install",
                    value: "Install this App",
                    icon: "mdi mdi-home",
                  },
                  {
                    id: "profile",
                    value: "Profile",
                    icon: "mdi mdi-account",
                  },
                ],
                template: "<span class='#icon#'></span> #value#",
                autoheight: true,
                select: true,
                on: {
                  onItemClick: function (id) {
                    if (id == "app_install") {
                      installApp();
                      if (!stateSW.isReadyToInstall) {
                        const popList = this;
                        const arr = popList
                          .serialize()
                          .filter((item) => item.id !== "app_install");
                        popList.clearAll();
                        popList.parse(arr);
                      }
                    } else if (id == "profile") {
                      $$("app:setting").$scope.ui(ProfileWindow).show();
                    }
                    this.getParentView().hide();
                  },
                },
              },
              on: {
                onBeforeShow: function () {
                  const isReady = stateSW.isReadyToInstall;
                  console.log("isReady", isReady);

                  if (!isReady) {
                    const popList = this.getChildViews()[0];
                    const arr = popList
                      .serialize()
                      .filter((item) => item.id !== "app_install");
                    popList.clearAll();
                    popList.parse(arr);
                  }
                },
              },
            },
          },
        ],
      };

      const menu = {
        view: "list",
        id: "app:myproject",
        css: "app_menu",
        layout: "y",
        select: true,
        template: "#name# ",
        on: {
          onItemClick: function (id, e, node) {
            const item = this.getItem(id);
            // this.$scope.show("/app/p.project?project_id=" + id);
            this.$scope.show("/app/p.task?project_id=" + id);
            // task?project_id=3
          },
          onAfterSelect: function (id) {},
        },
      };

      let mediumLayout = {
        type: "clean",
        paddingX: 5,
        css: "app_layout",
        rows: [
          offlineStatus,
          {
            cols: [
              {
                width: 250,
                rows: [
                  {
                    css: "webix_shadow_medium",
                    rows: [header, menu],
                  },
                ],
              },
              { view: "resizer", css: "z_content_ver_resizer" },
              {
                css: "z_content_ver_border",
                rows: [{ $subview: true }],
              },
            ],
          },
        ],
      };

      let tbPadding = 20;
      let lfPadding = 150;
      let largeLayout = {
        type: "clean",
        paddingX: 5,
        css: "app_layout",
        rows: [
          { height: tbPadding },
          {
            cols: [
              {
                width: lfPadding,
              },
              {
                rows: [
                  offlineStatus,
                  {
                    cols: [
                      {
                        width: 250,
                        rows: [
                          {
                            css: "webix_shadow_medium",
                            rows: [header, menu],
                          },
                        ],
                      },
                      { view: "resizer", css: "z_content_ver_resizer" },
                      {
                        css: "z_content_ver_border",
                        rows: [{ $subview: true }],
                      },
                    ],
                  },
                ],
              },
              {
                width: lfPadding,
              },
            ],
          },
          { height: tbPadding },
        ],
      };

      if (!isMobileDevice() && window.innerWidth >= 1440) {
        return largeLayout;
      } else {
        return mediumLayout;
      }
    }

    function uiSmall() {
      webix.ui.fullScreen();

      const tabbar = {
        view: "tabbar",
        id: "tabbar",
        css: "z_tabbar",
        type: "bottom",
        multiview: true,
        options: [
          {
            value:
              "<span class='webix_icon mdi mdi-format-list-bulleted'></span>&nbsp;Project",
            id: "p.project",
          },
          {
            value: "<span class='webix_icon mdi mdi-poll'></span>&nbsp;Report",
            id: "p.report",
          },
        ],
        height: 50,
        on: {
          onAfterTabClick: function (id) {
            this.$scope.show(`/app/${id}`);
          },
        },
      };

      return {
        type: "clean",
        rows: [{ $subview: true }, tabbar],
      };
    }

    return getScreenSize() == "wide" ? uiWide() : uiSmall();
  }
  init() {}
  urlChange(_, url) {
  }
  ready(view, url) {

    getMyProject().then((r) => {
      $$("app:myproject").parse(r, "json", true);
      let selProject = url.find((p) => {
        return p.params.project_id; // || (p.page=="p.project" && p.params.id)
      });
      if (selProject) {
        state.selId = selProject.params.project_id;
        if (isInt(state.selId)) {
          $$("app:myproject").select(state.selId);
        } else {
          webix.message({ text: "Please select project" });
          this.app.show("/app/p.project");
        }
      }

    });
    webix.event(window, "resize", function (e) {
      // $$("main_layout2").adjust()
    });
  }
}
