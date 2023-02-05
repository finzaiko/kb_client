import { JetView } from "webix-jet";
import {
  getFileByTaskId,
  getTaskById,
  removeTask,
  imgTemplate,
  removeFile,
  state,
  uploadByTaskId,
} from "../../../models/Task";
import { getProjectById, state as stateProject } from "../../../models/Project";
import { BACKEND_URL } from "../../../config/config";
import { getDateFormatted, getScreenSize } from "../../../helpers/ui";
import {
  createComment,
  getAllComment,
  removeComment,
  state as stateComment,
  updateComment,
} from "../../../models/Comment";
import { TaskAttachScreenshot } from "./TaskAttachScreenshot";
import { TaskPhotoPreview } from "./TaskPhotoPreview";
import { userProfile } from "../../../models/UserProfile";

const prefix = state.prefix + "_detail_";
const prefixAttach = state.prefix + "_attachscreen_";

function backToGrid(_this) {
  const backRoute = `p.task?project_id=${stateProject.selId}`;
  _this.show(backRoute);
}

function removeTaskById(_this, selId) {
  webix.confirm({
    ok: "Yes",
    cancel: "No",
    text: "Are you sure to delete ?",
    callback: function (result) {
      if (result) {
        const taskPanelId = $$(prefix + "task_view_panel");
        webix.extend(taskPanelId, webix.ProgressBar);
        taskPanelId.showProgress();
        taskPanelId.disable();

        removeTask(selId)
          .then((_) => {
            webix.message({
              text: "File deleted",
              type: "success",
            });
            taskPanelId.hideProgress();
            taskPanelId.enable();
            backToGrid(_this);
          })
      }
    },
  });
}

function removeFileById(selId) {
  webix.confirm({
    ok: "Yes",
    cancel: "No",
    text: "Are you sure to delete ?",
    callback: function (result) {
      if (result) {
        const taskPanelId = $$(prefix + "task_view_panel");
        webix.extend(taskPanelId, webix.ProgressBar);
        taskPanelId.showProgress();
        taskPanelId.disable();
        removeFile(selId).then((_) => {
          webix.message({
            text: "File deleted",
            type: "success",
          });
          loadFiles().then((_) => {});
          taskPanelId.hideProgress();
          taskPanelId.enable();

          const winPhotoId = $$(state.prefix + "_img_preview_" + "win");
          if (winPhotoId) {
            setTimeout(() => winPhotoId.close(), 500);
          }
        });
      }
    },
  });
}

export async function loadFiles() {
  const images = await getFileByTaskId(state.selId);
  const fileId = $$(prefix + "file_view");
  if (images.length > 0) {
    $$(prefix + "file_view_empty").hide();
    $$(prefix + "file_view_panel").show();
    $$(prefix + "file_view").show();
    fileId.clearAll();
    fileId.parse(images);
    state.images = images;
    var viewsArray = [];
    for (var i = 0; i < images.length; i++) {
      viewsArray.push({
        id: images[i].id,
        css: "image",
        template: imgTemplate,
        data: webix.copy(images[i]),
      });
    }

    state.imageView = viewsArray;
  } else {
    $$(prefix + "file_view_empty").show();
    $$(prefix + "file_view_panel").hide();
    $$(prefix + "file_view").hide();
  }
  return null;
}

function clearComments() {
  const commentViewId = $$(prefix + "comment_view_panel");
  const commentEd = commentViewId.getNode().querySelector("textarea");
  commentEd.value = "";
  $$(prefix + "comment_submit_panel").hide();
  commentEd.style.height = "40px";
  // commentViewId.refresh();
  commentViewId.resize();
  stateComment.dataSelected = {};
}

function removeCommentById(selId) {
  webix.confirm({
    ok: "Yes",
    cancel: "No",
    text: "Are you sure to delete ?",
    callback: function (result) {
      if (result) {
        removeComment(selId).then((_) => {
          webix.message({
            text: "Comment deleted",
            type: "success",
          });
          loadComments();
          clearComments();
        });
      }
    },
  });
}

async function loadComments() {
  const comments = await getAllComment(state.selId);
  const commentListId = $$(prefix + "comment_list");
  stateComment.dataComments = comments;
  let outputHtml = "";
  comments.forEach((obj) => {
    outputHtml += `<div class='comment_list_panel'>${
      obj.name
    } <span style='color:grey'>create at: ${getDateFormatted(
      obj.date_creation
    )} update at: ${getDateFormatted(obj.date_modification)}</span><br>
    <div class='comment_list_msg'><span class='comment_msg'>${
      obj.comment
    }</span>
    <span class='action-icon'>
      <span class='webix_icon mdi mdi-pencil update-icon' title='Update' data-comment_id=${
        obj.id
      }></span>
      <span class='webix_icon mdi mdi-close remove-icon' title='Delete' data-comment_id=${
        obj.id
      }></span>
    </span>
    </div>
    </div>`;
  });
  commentListId.setHTML(outputHtml);
  setTimeout(() => commentListId.scrollTo(0, 1000), 300);
}

function backToIcon(_this) {
  // return getScreenSize() == "wide"
  //   ? { width: 1 }
  //   :
  return {
    view: "icon",
    icon: "mdi mdi-arrow-left",
    click: () => {
      backToGrid(_this);
    },
  };
}

export default class TaskDetailMobile extends JetView {
  config() {
    const toolbar = {
      view: "toolbar",
      css: "z_navbar",
      elements: [
        { width: 10 },
        backToIcon(this),
        {
          view: "label",
          label: " Task",
          id: prefix + "navbar",
        },
        {},
      ],
    };

    const taskPanel = {
      id: prefix + "task_view_panel",
      rows: [
        {
          view: "template",
          id: prefix + "task_view",
          //   height: 100,
          css: "task_view_tmpl_list",
          autoheight: true,
          template: function (obj) {
            if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
              return `<div class='task_view_panel'>
                        <div class='task_view_template' style='background:${
                          obj.color.background
                        }'>
                            <div class='task_view__title'>${
                              obj.title
                            }</div> Description: ${obj.description}
                            <div class='task_detail_foot'>creator: ${
                              obj.assignee_name
                            } modified: ${getDateFormatted(
                obj.date_modification
              )}</div>
                            </div>
                        </div>
                    `;
              // <span class='showmore-action-icon'>show more<span class='webix_icon mdi mdi-menu-down showmore-icon' title='Show more'></span></span>
            }
            return "";
          },
          onClick: {
            "showmore-icon": function (e, id, node) {
              const tId = $$(prefix + "task_view");
              tId.config.autoheight = true;
              tId.refresh();
            },
          },
        },
        {
          type: "clean",
          css: "task_action",
          cols: [
            {
              view: "button",
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-delete-outline z_mdi_red_color",
              tooltip: "Delete",
              css: { "padding-right": "10px" },
              click: function () {
                removeTaskById(this.$scope, state.selId);
              },
            },
            {
              view: "button",
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-pencil",
              tooltip: "Edit",
              css: { "padding-right": "10px" },
              click: function () {
                this.$scope.show(
                  `p.task.edit?project_id=${stateProject.selId}&id=${state.selId}`
                );
              },
            },
            {
              view: "button",
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-attachment",
              tooltip: "Attachement",
              css: { "padding-right": "10px", background: "white" },
              click: function () {
                this.$scope.ui(TaskAttachScreenshot).show();
              },
            },
            {},
          ],
        },
        {
          height: 35,
          css: "attach_section",
          cols: [
            { width: 10, css: { background: "white" } },
            {
              type: "clean",
              css: "attach_section_label",
              template: "Attachement",
              width: 90,
            },
            {
              type: "clean",
              view: "template",
              css: "attach_section_line",
              // template: `<div class='attach_section'><span>Attachment</span></div>`,
              template: "<hr>",
              onClick: {
                attach_section: function () {
                  console.log("test");
                },
              },
            },
            {
              view: "icon",
              css: "mdi_fontsize_20 attach_section_icon",
              icon: "mdi mdi-menu-down",
            },
            { width: 10, css: { background: "white" } },
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
                        {
                          view: "button",
                          label: "Upload",
                          css: "webix_secondary",
                          click: function () {
                            let imageBase64 = $$("form_photo").getValue();

                            const fileName =
                              state.fileNameUpload ||
                              `${new Date().valueOf()}.png`;
                            imageBase64 = imageBase64.replace(
                              "data:image/png;base64,",
                              ""
                            );
                            imageBase64 = imageBase64.replace(" ", "+");

                            const taskPanelId = $$(prefix + "task_view_panel");
                            webix.extend(taskPanelId, webix.ProgressBar);
                            taskPanelId.showProgress();
                            taskPanelId.disable();

                            uploadByTaskId(
                              stateProject.selId,
                              state.selId,
                              fileName,
                              imageBase64
                            ).then((_) => {
                              loadFiles().then((_) => {
                                $$(prefix + "file_attach_panel").hide();
                              });
                              taskPanelId.hideProgress();
                              taskPanelId.enable();
                            });
                          },
                        },
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
                            if ($$(prefix + "file_view").count() == 0) {
                              $$(prefix + "file_view_panel").hide();
                            }
                          },
                        },
                      ],
                    },
                  ],
                },
                { width: 10, css: "white_background" },
              ],
            },
            { id: prefix + "file_view_empty", css: "white_background" },
            {
              view: "dataview",
              id: prefix + "file_view",
              css: "file_view_dataview",
              height: 100,
              xCount: 4,
              select: true,
              hidden: true,
              type: {
                height: 100,
                width: "auto",
              },
              template: `<div class='item-click' style='background-image:url(${BACKEND_URL}/data/files/thumbnails/#path#?${Date.now()});height:100px;background-repeat:no-repeat;background-position:center;background-size:contain;object-fit: contain;position: relative;'>
                  <div class='webix_icon mdi mdi-close remove-file-icon' style='float:right;height:20px;z-index:1000;padding:1px;position:obsolete;' title='Delete'></div>
              </div>
              `,
              onClick: {
                "item-click": function (e, id, node) {
                  // let element = document.querySelector(".remove-file-icon");
                  // e.stopPropagation();
                  e.preventDefault();
                  this.$scope.ui(TaskPhotoPreview).show();
                },
                "remove-file-icon": function (e, id, node) {
                  e.preventDefault();
                  removeFileById(id);
                },
              },
            },
          ],
        },
        // end view_file_panel
        {
          height: 35,
          css: "comment_section",
          cols: [
            { width: 10, css: { background: "white" } },
            {
              type: "clean",
              css: "comment_section_label",
              template: "Comments",
              width: 90,
            },
            {
              type: "clean",
              view: "template",
              css: "comment_section_line",
              // template: `<div class='attach_section'><span>Attachment</span></div>`,
              template: "<hr>",
              onClick: {
                attach_section: function () {
                  console.log("aa");
                },
              },
            },
            {
              view: "icon",
              css: "mdi_fontsize_20 comment_section_icon",
              icon: "mdi mdi-menu-down",
            },
            { width: 10, css: { background: "white" } },
          ],
        },
        {
          css: { background: "white" },
          cols: [
            {
              view: "template",
              type: "clean",
              autoheight: true,
              id: prefix + "comment_view_panel",
              css: "comment_view_panel",
              template: function (obj) {
                return `<div class='comment_textarea_panel'><textarea class="autosize comment_textarea" placeholder="Type here.."></textarea></div>`;
              },
            },
            {
              id: prefix + "comment_submit_panel",
              hidden: true,
              rows: [
                {},
                {
                  view: "icon",
                  icon: "mdi mdi-send",
                  css: "z_mdi_color_primary",
                  click: function () {
                    const commentViewId = $$(
                      prefix + "comment_view_panel"
                    ).getNode();
                    const commentValue =
                      commentViewId.querySelector("textarea").value;

                    const obj = stateComment.dataSelected;
                    if (
                      Object.keys(obj).length !== 0 &&
                      obj.constructor === Object
                    ) {
                      const taskPanelId = $$(prefix + "task_view_panel");
                      webix.extend(taskPanelId, webix.ProgressBar);
                      taskPanelId.showProgress();
                      taskPanelId.disable();

                      updateComment(obj.id, commentValue).then((_) => {
                        webix.message({
                          text: "Comment updated",
                          type: "success",
                        });
                        loadComments();
                        clearComments();
                        // $$(prefix + "cancel_edit_comment").hide();
                        taskPanelId.hideProgress();
                        taskPanelId.enable();
                      });
                    } else {
                      const taskPanelId = $$(prefix + "task_view_panel");
                      webix.extend(taskPanelId, webix.ProgressBar);
                      taskPanelId.showProgress();
                      taskPanelId.disable();

                      createComment(
                        state.selId,
                        userProfile.userId,
                        commentValue
                      ).then((r) => {
                        webix.message({
                          text: "Comment saved",
                          type: "success",
                        });
                        loadComments();
                        clearComments();
                        // $$(prefix + "cancel_edit_comment").hide();
                        taskPanelId.hideProgress();
                        taskPanelId.enable();
                      });
                    }
                  },
                },
              ],
            },
            { width: 14 },
          ],
        },
        {
          id: prefix + "comment_list",
          view: "template",
          css: "comment_list",
          scroll: "y",
          onClick: {
            "update-icon": function (e, id, node) {
              const selId = parseInt(node.dataset.comment_id);
              const item = stateComment.dataComments.find((e) => e.id == selId);
              stateComment.dataSelected = item;
              const commentViewId = $$(prefix + "comment_view_panel").getNode();
              const commentEd = commentViewId.querySelector("textarea");
              commentEd.value = item.comment;
              commentEd.focus();
              commentViewId.classList.add("flash_hightlight_comment");
              setTimeout(() => {
                commentViewId.classList.remove("flash_hightlight_comment");
              }, 1000);
            },
            "remove-icon": function (e, id, node) {
              const selId = parseInt(node.dataset.comment_id);
              removeCommentById(selId);
            },
          },
        },
        // end comment list
      ],
    };

    return {
      rows: [toolbar, taskPanel],
    };
  }

  init(view) {}
  urlChange(view, url) {
    stateProject.selId = url[0].params.project_id;
    state.selId = url[0].params.id;
    state.attachOpen = url[0].params.attach || 0;
    if (state.attachOpen && !$$(prefixAttach + "win")) {
      view.$scope.ui(TaskAttachScreenshot).show();
    }
  }

  async ready(view, url) {
    stateProject.selId = url[0].params.project_id;
    state.selId = url[0].params.id;
    state.attachOpen = url[0].params.attach || 0;
    state.routePath = url[0].page;

    if (state.routePath == "p.task.add") {
      state.isEdit = false;
    } else if (
      (state.routePath == "p.task.edit" ||
        state.routePath == "p.task.detail") &&
      typeof state.selId != "undefined"
    ) {
      state.isEdit = true;
    }

    const taskPanelId = $$(prefix + "task_view_panel");
    const taskViewId = $$(prefix + "task_view");
    webix.extend(taskPanelId, webix.ProgressBar);
    taskPanelId.showProgress();
    taskPanelId.disable();
    const task = await getTaskById(state.selId);

    taskViewId.parse(task);
    taskViewId.refresh();

    await loadComments();

    await loadFiles();
    taskPanelId.enable();
    taskPanelId.hideProgress();

    if (state.attachOpen && !$$(prefixAttach + "win")) {
      view.$scope.ui(TaskAttachScreenshot).show();
    }

    // auto resize comment text
    const element = document.querySelector(".autosize");

    element.addEventListener("input", () => {
      element.style.height = "40px";
      if (element.clientHeight < element.scrollHeight) {
        element.style.height = element.scrollHeight + "px";
        const commentPnlId = $$(prefix + "comment_view_panel");
        commentPnlId.config.height = element.scrollHeight;
        commentPnlId.resize();
      }
    });

    const commentViewId = $$(prefix + "comment_view_panel").getNode();
    const commentEd = commentViewId.querySelector("textarea");
    commentEd.addEventListener("keyup", function (e) {
      if (e.target.value.trim().length > 0) {
        $$(prefix + "comment_submit_panel").show();
      } else {
        $$(prefix + "comment_submit_panel").hide();
      }
    });
  }
}
