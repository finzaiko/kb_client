import { JetView } from "webix-jet";

export default class MobileView extends JetView {
  config() {
    webix.ui.fullScreen();

    const tabbar = {
      view: "tabbar",
      id: "tabbar",
      type: "bottom",
      multiview: true,
      options: [
        {
          value:
            "<span class='webix_icon mdi mdi-format-list-bulleted'></span>&nbsp;Project",
          id: "m.project",
        },
        {
          value:
            "<span class='webix_icon mdi mdi-view-dashboard'></span>&nbsp;Report",
          id: "m.report",
        },
      ],
      height: 50,
      on:{
        "onAfterTabClick":function(id){
          this.$scope.show(
            "/mobile/"+id
          );
        }
      }
    };

    const ui = {
      type: "clean",
      rows: [{ $subview: true }, tabbar],
    };

    return ui;
  }
  init(view) {}
}
