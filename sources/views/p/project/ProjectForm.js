import { JetView } from "webix-jet";
import { defaultHeader } from "../../../helpers/api";
import { state, url } from "../../../models/Project";

const prefix = state.prefix;
function WindowForm() {
  let isEditMode = state.isEdit;
  let labelW = 125,
    winId = prefix + "_win",
    winLabel = "Work flow Approval";
  return {
    view: "window",
    modal: true,
    id: winId,
    position: "center",
    move: true,
    head: {
      height: 38,
      template: "New Project",
    },
    body: {
      rows: [
        {
          padding: 10,
          view: "form",
          id: prefix + "_form",
          width: 485,
          type: "clean",
          elements: [
            {
              view: "text",
              placeholder: "Project Name",
              name: "project_name",
              id: prefix + "_project_name",
            },
          ],
          rules: {
            project_name: webix.rules.isNotEmpty,
          },
          on: {
            onAfterValidation: function (result, value) {
              if (!result) {
                var text = [];
                for (var key in value) {
                  if (key == "project_name")
                    text.push("Project Name can't be empty");
                }
                webix.message({ type: "error", text: text.join("<br>") });
              }
            },
          },
          elementsConfig: {
            labelPosition: "left",
            labelWidth: labelW,
            bottomPadding: 1,
          },
        },
        {
          view: "toolbar",
          elements: [
            {},
            {
              view: "button",
              label: !isEditMode ? "Save" : "Update",
              autowidth: true,
              click: function () {
                if ($$(prefix + "_form").validate()) {
                  save();
                }
              },
            },
            {
              view: "button",
              value: "Close",
              autowidth: true,
              click: function () {
                cancel();
              },
            },
          ],
        },
      ],
    },
    on: {
      onShow: function () {
        $$(prefix + "_project_name").focus();
      },
    },
  };
}

function save() {
  let formData = $$(prefix + "_form").getValues(),
    msgName = formData.project_name;

    webix.extend($$(prefix + "_form"), webix.ProgressBar);
    $$(prefix + "_form").showProgress();


  if (!state.isEdit) {
    webix
      .ajax()
      .post(url, formData, function (res) {
        webix.message({ text: `<b>${msgName}</b> saved.` });
        reload();
        $$(prefix + "_form").hideProgress();
      })
      .fail(function (err) {
        showError(err);
      });
  } else {
    webix
      .ajax()
      .headers(defaultHeader())
      .put(`${url}/${data.id}`, formData, function (res) {
        webix.message({ text: `<b>${msgName}</b> updated.` });
        reload();
      })
      .fail(function (err) {
        showError(err);
      });
  }
  cancel();
}

function cancel() {
  $$(prefix + "_form").clear();
  $$(prefix + "_win").destructor();
  defaultBtn();
}

function defaultBtn() {}

export class ProjectForm extends JetView {
  config() {
    return WindowForm();
  }
  show(target) {
    this.getRoot().show(target);
  }
  init(view) {}
  ready(view) {
    if (!state.isEdit) {
      $$(prefix + "_form").clear();
    } else {
      loadDataToForm();
    }
  }
}
