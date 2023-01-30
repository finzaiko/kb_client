export function FloatingButton(viewId, callback) {
  return webix.ui({
    view: "window",
    head: false,
    css: "float_button_body",
    id: viewId,
    body: {
      view: "button",
      value: "+",
      css: "float_button webix_primary",
      icon: "mdi mdi-plus",
      height: 58,
      width: 54,
      click: function () {
        callback();
      },
    },
    position: function (state) {
      state.top = state.maxHeight - state.height - 65;
      state.left = state.maxWidth - state.width - 30;
    },
  });
}

export function MyUploadList(app, view, config) {
  webix.type(webix.ui.list, {
    name: "myUploader",
    template: function (f, type) {
      var html = "<div class='overall'><div class='name'>" + f.name + "</div>";
      html +=
        "<div class='remove_file'><span style='color:#AAA' class='cancel_icon'></span></div>";
      html += "<div class='status'>";
      html +=
        "<div class='progress " +
        f.status +
        "' style='width:" +
        (f.status == "transfer" || f.status == "server"
          ? f.percent + "%"
          : "0px") +
        "'></div>";
      html +=
        "<div class='message " + f.status + "'>" + type.status(f) + "</div>";
      html += "</div>";
      html += "<div class='size'>" + f.sizetext + "</div></div>";
      return html;
    },
    status: function (f) {
      var messages = {
        server: "Done",
        error: "Error",
        client: "Ready",
        transfer: f.percent + "%",
      };
      return messages[f.status];
    },
    on_click: {
      remove_file: function (ev, id) {
        $$(this.config.uploader).files.remove(id);
      },
    },
    height: 35,
  });
}
