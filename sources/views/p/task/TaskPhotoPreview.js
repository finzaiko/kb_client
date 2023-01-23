import { JetView } from "webix-jet";
import { imgThumbTemplate, state } from "../../../models/Task";

const prefix = state.prefix + "_img_preview_";
function WindowForm() {
  const winId = prefix + "win";
  return {
    view: "window",
    id: winId,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        { view: "label", label: "Image View" },
        {
          view: "icon",
          icon: "mdi mdi-close",
          tooltip: "Close Me",
          align: "right",
          click: function () {
            $$(winId).close();
          },
        },
      ],
    },
    body: {
      id: "photo_panel_body",
      rows: [
        {
          view: "carousel",
          id: "carousel",
          cols: state.imageView,
          navigation: {
            type: "side",
            items: false,
          },
          on: {
            onShow: function (id) {

            },
          },
        },
        {
          view: "dataview",
          id: "imageList",
          css: "nav_list",
          yCount: 1,
          select: true,
          scroll: false,
          type: {
            width: 100,
            height: 65,
          },
          template: imgThumbTemplate,
          data: state.images,
        },
      ],
    },
    fullscreen: true,
    on: {
      onShow() {
        $$("imageList").select(state.images[0].id);
      },
    },
  };
}

export class TaskPhotoPreview extends JetView {
  config() {
    return WindowForm();
  }
  show(target) {
    this.getRoot().show(target);
  }
  init(view) {}
  ready(view) {
    $$("imageList").attachEvent("onItemClick", function (id) {
      $$(id).show();
    });

    $$("carousel").attachEvent("onShow", function (id) {
      $$("imageList").select(id);
    });
  }
}
