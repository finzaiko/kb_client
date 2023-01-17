import { JetView } from "webix-jet";
import {
  createTask,
  getColumnByProjectId,
  state,
  uploadByTaskId,
  url,
} from "../../../models/Task";
import { state as stateProject } from "../../../models/Project";
import { defaultHeader } from "../../../helpers/api";
import { userProfile } from "../../../models/UserProfile";

const prefix = state.prefix;

async function doCreateTask() {
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
    } else {
      webix.message({ text: "Task fail save, upload", type: "error" });
    }
  } else {
    if (taskId) {
      webix.message({ text: "Task created", type: "success" });
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
            const backRoute =
              state.routePath == "p.task.add"
                ? `p.project?id=${stateProject.selId}`
                : `p.task.view?id=${state.selId}`;

            this.show(backRoute);
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
                              $$(prefix + "_do_uploader").show();
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

                            console.log("imageBase64", imageBase64);

                            uploadByTaskId(
                              stateProject.selId,
                              state.selId,
                              fileName,
                              imageBase64
                            );
                          },
                        },
                        {
                          view: "button",
                          type: "icon",
                          icon: "mdi mdi-close",
                          autowidth: true,
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
            doCreateTask();
            //   const _this = this;
            //   const inputs = $$(prefix + "_form").getValues();
            //   inputs.project_id = state.selId;
            //   webix
            //     .ajax()
            //     .post(url, inputs, function (res) {
            //       console.log("res", res);
            //       webix.message({ text: `Task saved`, type: "success" });
            //       _this.$scope.show("p.task?id=" + state.selId);
            //     })
            //     .fail(function (err) {
            //       webix.message({
            //         text: JSON.parse(err.responseText).data,
            //         type: "error",
            //       });
            //     });
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
    stateProject.selId = parseInt(url[0].params.project_id);
  }

  ready(_, url) {
    state.selId = url[0].params.id;
    state.routePath = url[0].page;

    let pageLabel = "";
    if (state.routePath == "p.task.add") {
      pageLabel = "Add";
    } else if (state.routePath == "p.task.edit") {
      pageLabel = "Edit";
    } else if (state.routePath == "p.task.editmore") {
      pageLabel = "Edit more";
    }
    this.$$(prefix + "_navbar").setValue(pageLabel);
  }
}
