import { JetView } from "webix-jet";
import { imgThumbTemplate, removeFile, state } from "../../../models/Task";
import { loadFiles } from "./detail";

const prefix = state.prefix + "_img_preview_";

function removeFileById(selId) {
  webix.confirm({
    ok: "Yes",
    cancel: "No",
    text: "Are you sure to delete ?",
    callback: function (result) {
      if (result) {
        const winId = $$(prefix + "win");
        webix.extend(winId, webix.ProgressBar);
        winId.showProgress();
        winId.disable();
        removeFile(selId).then((_) => {
          webix.message({
            text: "File deleted",
            type: "success",
          });
          loadFiles().then((_) => {});
          winId.hideProgress();
          winId.enable();
          setTimeout(() => {
            winId.close();
          }, 500);
        });
      }
    },
  });
}

function WindowForm() {
  const winId = prefix + "win";
  return {
    view: "window",
    id: winId,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        { view: "label", label: "Image View", width: 100 },
        {
          view: "icon",
          icon: "mdi mdi-delete-outline",
          css: "z_mdi_color_danger",
          tooltip: "Delete current view",
          click: function () {
            removeFileById($$("imageList").getSelectedId());
          },
        },
        {},
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
