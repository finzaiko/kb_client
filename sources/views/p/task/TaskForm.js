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
import { defaultHeader } from "../../../helpers/api";
import { userProfile } from "../../../models/UserProfile";
import { TaskAttachScreenshot } from "./TaskAttachScreenshot";

const prefix = state.prefix + "_form_";

function backToGrid(_this) {
  const backRoute =
    state.routePath == "p.task.add"
      ? `p.task?project_id=${stateProject.selId}`
      : `p.task?project_id=${stateProject.selId}&id=${state.selId}`;
  _this.show(backRoute);
}

async function doUpdateTask(_this, id) {
  const formId = $$(prefix + "form");
  webix.extend(formId, webix.ProgressBar);
  formId.disable();
  formId.showProgress();
  const formValues = $$(prefix + "form").getValues();
  const task = await updateTask(id, formValues.title, formValues.description);
  formId.enable();
  formId.hideProgress();
  if (task) {
    webix.message({ text: "Task updated", type: "success" });
    backToGrid(_this);
  }
}

async function doCreateTask(_this) {
  const formId = $$(prefix + "form");
  webix.extend(formId, webix.ProgressBar);
  formId.disable();
  formId.showProgress();

  const formValues = formId.getValues();
  const projectId = stateProject.selId;
  const taskColId = await getColumnByProjectId(projectId);
  const taskId = await createTask(
    projectId,
    taskColId[0].id,
    userProfile.userId,
    formValues.title,
    formValues.description
  );

  if (formValues.photo) {
    let imageBase64 = formValues.photo;
    // const fileName = Object.values(
    //   $$(prefix + "open_uploader").files.data.pull
    // )[0].name;

    const fileName = state.fileNameUpload;
    imageBase64 = imageBase64.replace("data:image/png;base64,", "");
    imageBase64 = imageBase64.replace(" ", "+");
    const photo = await uploadByTaskId(
      stateProject.selId,
      taskId,
      fileName,
      imageBase64
    );

    formId.hideProgress();

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
      css: "z_navbar",
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
          id: prefix + "navbar",
        },
        {},
      ],
    };
    const form = {
      padding: 10,
      view: "form",
      id: prefix + "form",
      type: "clean",
      elements: [
        {
          view: "text",
          label: "Title",
          name: "title",
          id: prefix + "title",
        },
        {
          view: "textarea",
          label: "Description",
          name: "description",
          id: prefix + "description",
          height: 100,
        },
        {
          type: "clean",
          css: "task_action",
          id: prefix + "task_action",
          cols: [
            {
              view: "button",
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-attachment",
              tooltip: "Attachement",
              css: { "padding-right": "10px" },
              click: function () {
                this.$scope.ui(TaskAttachScreenshot).show();
              },
            },
            {},
          ],
        },
        {
          id: prefix + "file_view_panel",
          height: 100,
          hidden: true,
          cols: [
            {
              width: 130,
              id: prefix + "file_attach_panel",
              hidden: true,
              cols: [
                { width: 10, css: "white_background" },
                {
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
                          view: "button",
                          type: "icon",
                          icon: "mdi mdi-close",
                          id: prefix + "cancel_file",
                          autowidth: true,
                          hidden: true,
                          click: function () {
                            $$("form_photo").setValue();
                            $$(prefix + "file_attach_panel").hide();
                            // if ($$(prefix + "file_view").count() == 0) {
                            //   $$(prefix + "file_view_panel").hide();
                            // }
                          },
                        },
                        {},
                      ],
                    },
                  ],
                },
                {},
              ],
            },
            {},
          ],
        },
        // {
        //   id: prefix + "file_view_panel",
        //   cols: [
        //     {
        //       rows: [
        //         {
        //           css: "photo_panel",
        //           rows: [
        //             // {
        //             //   view: "photo",
        //             //   name: "photo",
        //             //   css: "form_photo",
        //             //   id: "form_photo",
        //             //   borderless: false,
        //             //   width: 120,
        //             //   height: 65,
        //             // },
        //             {
        //               css: "photo_panel_spacer",
        //               cols: [
        //                 {},
        //                 // {
        //                 //   view: "uploader",
        //                 //   value: "Open file",
        //                 //   accept: "image/jpeg, image/png, image/jpg",
        //                 //   autosend: false,
        //                 //   multiple: false,
        //                 //   css: "webix_secondary",
        //                 //   id: prefix + "open_uploader",
        //                 //   autowidth: true,
        //                 //   upload: url + "/test",
        //                 //   on: {
        //                 //     onBeforeFileAdd: function (file) {
        //                 //       if (file.size && file.size > 4000000) {
        //                 //         webix.message({
        //                 //           text: "Image too big,  4MB limit size",
        //                 //           type: "error",
        //                 //         });
        //                 //         return false;
        //                 //       }
        //                 //     },
        //                 //     onAfterFileAdd: function (upload) {
        //                 //       var file = upload.file;
        //                 //       var reader = new FileReader();

        //                 //       reader.onload = function (event) {
        //                 //         $$("form_photo").setValue(event.target.result);
        //                 //       };
        //                 //       reader.readAsDataURL(file);

        //                 //       $$(prefix + "open_uploader").hide();
        //                 //       // $$(prefix + "do_uploader").show();
        //                 //       $$(prefix + "cancel_file").show();
        //                 //       return false;
        //                 //     },
        //                 //   },
        //                 // },
        //                 {
        //                   view: "button",
        //                   value: "Upload",
        //                   id: prefix + "do_uploader",
        //                   css: "webix_warning",
        //                   hidden: true,
        //                   autowidth: true,
        //                   click: function () {
        //                     let imageBase64 = $$("form_photo").getValue();
        //                     const fileName = Object.values(
        //                       $$(prefix + "open_uploader").files.data.pull
        //                     )[0].name;

        //                     imageBase64 = imageBase64.replace(
        //                       "data:image/png;base64,",
        //                       ""
        //                     );
        //                     imageBase64 = imageBase64.replace(" ", "+");

        //                     uploadByTaskId(
        //                       stateProject.selId,
        //                       state.selId,
        //                       fileName,
        //                       imageBase64
        //                     ).then((_) => {
        //                       webix.message({
        //                         text: "Upload success",
        //                         type: "success",
        //                       });
        //                     });
        //                   },
        //                 },
        //                 {
        //                   view: "button",
        //                   type: "icon",
        //                   icon: "mdi mdi-close",
        //                   id: prefix + "cancel_file",
        //                   autowidth: true,
        //                   hidden: true,
        //                   click: function () {
        //                     $$("form_photo").setValue();
        //                     $$(prefix + "open_uploader").show();
        //                     this.hide();
        //                   },
        //                 },
        //                 {},
        //               ],
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //     {},
        //   ],
        // },
        { height: 10 },
        {
          cols: [
            {},
            {
              view: "button",
              label: "Submit",
              // autowidth: true,
              width: 160,
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
            {},
          ],
        },
        {},
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
      state.isEdit = false;
      $$(prefix + "task_action").show();
    } else if (
      state.routePath == "p.task.edit" &&
      typeof state.selId != "undefined"
    ) {
      pageLabel = "Edit";
      state.isEdit = true;
      $$(prefix + "file_view_panel").hide();
      $$(prefix + "task_action").hide();

      getTaskById(state.selId).then((r) =>
        this.$$(prefix + "form").setValues(r)
      );
    } else if (state.routePath == "p.task.editmore") {
      pageLabel = "Edit more";
      $$(prefix + "file_view_panel").show();
    }
    this.$$(prefix + "navbar").setValue(pageLabel);
  }
}
