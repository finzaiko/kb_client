import { JetView } from "webix-jet";
import { APP_NAME } from "../../../config/config";
import { getScreenSize } from "../../../helpers/ui";
import { removeURLParam } from "../../../helpers/url";
import { getMyProject, state } from "../../../models/Project";
import { installApp, state as stateSW } from "../../../models/ServiceWorker";

import { ProfileWindow } from "../../profile";

const prefix = state + "_page_";

export default class ProjectPage extends JetView {
  config() {
    const offlineStatus = {
      view: "template",
      height: 20,
      id: "app_offline",
      css: "app_offline_status",
      hidden: true,
    };

    function uiSmall() {
      const toolbar = {
        view: "toolbar",
        css: "z_navbar",
        elements: [
          { width: 10 },
          {
            view: "label",
            label: APP_NAME,
            id: "mobile_navbar",
          },
          {},
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
            },
          },
          { width: 10 },
        ],
      };

      const projectGrid = {
        view: "datatable",
        id: prefix + "table",
        select: "row",
        header: false,
        scrollX: false,
        rowHeight: 50,
        columns: [
          {
            id: "name",
            fillspace: true,
          },
        ],
        on: {
          onBeforeLoad: function () {
            this.showOverlay("Loading...");
          },
          onAfterLoad: function () {
            this.hideOverlay();
          },
          onItemClick: function (id, row) {
            this.$scope.show("/app/p.task?project_id=" + id.row);
            state.selId = id.row;
          },
        },
      };
      return {
        rows: [offlineStatus, toolbar, projectGrid],
      };
    }

    function uiWide() {
      const toolbar = {
        view: "toolbar",
        css: "z_navbar",
        height: 42,
        elements: [{}],
      };
      return {
        rows: [
          toolbar,
          {
            id: prefix + "empty",
            template:
              "<div style='margin-top:140px;text-align:center;'>Please select project</div>",
          },
        ],
      };
    }
    return getScreenSize() == "wide" ? uiWide() : uiSmall();
  }

  init(view) {}
  async urlChange(_, url) {
    state.selId = url[0].params.project_id;

    if (getScreenSize() == "wide") {
      if (!state.selId) {
        $$(prefix + "empty").show();
        if ($$(prefix + "panel")) this.$$(prefix + "panel").hide();
      }
    } else {
      const projectTblId = $$(prefix + "table");
      webix.extend(projectTblId, webix.ProgressBar);
      projectTblId.disable();
      projectTblId.showProgress();
      const projects = await getMyProject();
      projectTblId.parse(projects, "json", true);
      const oldUrl = removeURLParam("project_id", window.location.href);
      window.history.replaceState("", "", oldUrl);
      projectTblId.hideProgress();
      projectTblId.enable();

    }
  }
  async ready(_, url) {
    state.selId = url[0].params.project_id;

    if (getScreenSize() == "wide") {
      if (!state.selId) {
        $$(prefix + "empty").show();
        if ($$(prefix + "panel")) this.$$(prefix + "panel").hide();
      }
    } else {
      const projectTblId = $$(prefix + "table");
      webix.extend(projectTblId, webix.ProgressBar);
      projectTblId.disable();
      projectTblId.showProgress();
      const projects = await getMyProject();
      projectTblId.parse(projects, "json", true);
      const oldUrl = removeURLParam("project_id", window.location.href);
      window.history.replaceState("", "", oldUrl);
      projectTblId.hideProgress();
      projectTblId.enable();
    }
  }
}
