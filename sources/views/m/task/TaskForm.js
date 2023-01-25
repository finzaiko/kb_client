import { JetView } from "webix-jet";
import {
  createTask,
  getColumnByProjectId,
  getTaskById,
  state,
  updateTask,
  uploadByTaskId,
  url,
} from "../../../models/Task";
import { state as stateProject } from "../../../models/Project";
import { userProfile } from "../../../models/UserProfile";

const prefix = state.prefix;

function backToGrid(_this) {
  const backRoute =
    state.routePath == "p.task.add"
      ? `p.project?project_id=${stateProject.selId}`
      : `p.task?project_id=${stateProject.selId}&id=${state.selId}`;
  _this.show(backRoute);
}

async function doUpdateTask(_this, id) {
  const formValues = $$(prefix + "_form").getValues();
  const task = await updateTask(id, formValues.title, formValues.description);

  if (task) {
    webix.message({ text: "Task updated", type: "success" });
    backToGrid(_this);
  }
}

async function doCreateTask(_this) {
  const formValues = $$(prefix + "_form").getValues();
  const projectId = stateProject.selId;
  const taskColId = await getColumnByProjectId(projectId);
  const taskId = await createTask(
    projectId,
    taskColId.id,
    userProfile.userId,
    formValues.title,
    formValues.description
  );

  if (formValues.photo) {
    let imageBase64 = formValues.photo;
    const fileName = Object.values(
      $$(prefix + "_open_uploader").files.data.pull
    )[0].name;

    imageBase64 = imageBase64.replace("data:image/png;base64,", "");
    imageBase64 = imageBase64.replace(" ", "+");
    const photo = await uploadByTaskId(
      stateProject.selId,
      taskId,
      fileName,
      imageBase64
    );

    if (photo) {
      webix.message({ text: "Task created, uploaded", type: "success" });
      backToGrid(_this);
    } else {
      webix.message({ text: "Task fail save, upload", type: "error" });
    }
  } else {
    if (taskId) {
      webix.message({ text: "Task created", type: "success" });
      backToGrid(_this);
    } else {
      webix.message({ text: "Task fail to save", type: "success" });
    }
  }
}

export default class TaskForm extends JetView {
  config() {
    const toolbar = {
      view: "toolbar",
      elements: [
        { width: 10 },
        {
          view: "icon",
          icon: "mdi mdi-arrow-left",
          click: () => {
            backToGrid(this);
          },
        },
        {
          view: "label",
          label: " Task",
          id: prefix + "_navbar",
        },
        {},
      ],
    };
    const form = {
      padding: 10,
      view: "form",
      id: prefix + "_form",
      type: "clean",
      elements: [
        {
          view: "text",
          label: "Title",
          name: "title",
          id: prefix + "_title",
        },
        {
          view: "textarea",
          label: "Description",
          name: "description",
          id: prefix + "_description",
          height: 100,
        },
        {
          id: prefix + "form_photo_panel",
          cols: [
            {
              rows: [
                {
                  css: "photo_panel",
                  rows: [
                    {
                      view: "photo",
                      name: "photo",
                      css: "form_photo",
                      id: "form_photo",
                      borderless: false,
                      width: 120,
                      height: 65,
                    },
                    {
                      css: "photo_panel_spacer",
                      cols: [
                        {},
                        {
                          view: "uploader",
                          value: "Open file",
                          accept: "image/jpeg, image/png, image/jpg",
                          autosend: false,
                          multiple: false,
                          id: prefix + "_open_uploader",
                          autowidth: true,
                          upload: url + "/test",
                          on: {
                            onBeforeFileAdd: function (file) {
                              if (file.size && file.size > 4000000) {
                                webix.message({
                                  text: "Image too big,  4MB limit size",
                                  type: "error",
                                });
                                return false;
                              }
                            },
                            onAfterFileAdd: function (upload) {
                              var file = upload.file;
                              var reader = new FileReader();

                              reader.onload = function (event) {
                                $$("form_photo").setValue(event.target.result);
                              };
                              reader.readAsDataURL(file);

                              $$(prefix + "_open_uploader").hide();
                              // $$(prefix + "_do_uploader").show();
                              $$(prefix + "_cancel_file").show();
                              return false;
                            },
                          },
                        },
                        {
                          view: "button",
                          value: "Upload",
                          id: prefix + "_do_uploader",
                          css: "webix_warning",
                          hidden: true,
                          autowidth: true,
                          click: function () {
                            let imageBase64 = $$("form_photo").getValue();
                            const fileName = Object.values(
                              $$(prefix + "_open_uploader").files.data.pull
                            )[0].name;

                            imageBase64 = imageBase64.replace(
                              "data:image/png;base64,",
                              ""
                            );
                            imageBase64 = imageBase64.replace(" ", "+");

                            uploadByTaskId(
                              stateProject.selId,
                              state.selId,
                              fileName,
                              imageBase64
                            ).then((_) => {
                              webix.message({
                                text: "Upload success",
                                type: "success",
                              });
                            });
                          },
                        },
                        {
                          view: "button",
                          type: "icon",
                          icon: "mdi mdi-close",
                          id: prefix + "_cancel_file",
                          autowidth: true,
                          hidden: true,
                          click: function () {
                            $$("form_photo").setValue();
                            $$(prefix + "_open_uploader").show();
                            this.hide();
                          },
                        },
                        {},
                      ],
                    },
                  ],
                },
              ],
            },
            {},
          ],
        },
        {},
        {
          view: "button",
          label: "Submit",
          css: "webix_primary",
          click: function () {
            if (
              state.routePath == "p.task.edit" &&
              typeof state.selId != "undefined"
            ) {
              doUpdateTask(this.$scope, state.selId);
            } else {
              doCreateTask(this.$scope);
            }
          },
        },
      ],
      rules: {
        description: webix.rules.isNotEmpty,
      },
      on: {
        onAfterValidation: function (result, value) {
          if (!result) {
            var text = [];
            for (var key in value) {
              if (key == "description") text.push("Description can't be empty");
            }
            webix.message({ type: "error", text: text.join("<br>") });
          }
        },
      },
      elementsConfig: {
        labelPosition: "top",
        bottomPadding: 1,
      },
    };
    return { rows: [toolbar, form] };
  }
  init(view) {}
  urlChange(_, url) {
    state.selId = url[0].params.id;

    stateProject.selId = url[0].params.project_id;
  }

  ready(_, url) {
    state.selId = url[0].params.id;
    stateProject.selId = url[0].params.project_id;
    state.routePath = url[0].page;

    let pageLabel = "";
    if (state.routePath == "p.task.add") {
      pageLabel = "Add";
      $$(prefix + "form_photo_panel").show();
    } else if (
      state.routePath == "p.task.edit" &&
      typeof state.selId != "undefined"
    ) {
      pageLabel = "Edit";
      $$(prefix + "form_photo_panel").hide();

      getTaskById(state.selId).then((r) =>
        this.$$(prefix + "_form").setValues(r)
      );
    } else if (state.routePath == "p.task.editmore") {
      pageLabel = "Edit more";
      $$(prefix + "form_photo_panel").show();
    }
    this.$$(prefix + "_navbar").setValue(pageLabel);
  }
}