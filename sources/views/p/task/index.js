import { JetView } from "webix-jet";
import {
  getFileByTaskId,
  getTaskById,
  imgTemplate,
  state,
  uploadByTaskId,
  url,
} from "../../../models/Task";
import { state as stateProject } from "../../../models/Project";
import {
  createComment,
  getAllComment,
  removeComment,
  state as stateComment,
  updateComment,
} from "../../../models/Comment";
import { getDateFormatted } from "../../../helpers/ui";
import { BACKEND_URL } from "../../../config/config";
import { userProfile } from "../../../models/UserProfile";
import { TaskPhotoPreview } from "./TaskPhotoPreview";
import { TaskAttachScreenshot } from "./TaskAttachScreenshot";

const prefix = state + "_page_";

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
  commentListId.scrollTo(0, 1000);
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
function clearComments() {
  $$(prefix + "comment_text").setValue();
  stateComment.dataSelected = {};
}

export default class TaskPage extends JetView {
  config() {
    return {
      type: "clean",
      borderless: true,
      rows: [
        {
          view: "template",
          id: prefix + "task_view",
          // height: 60,
          autoheight: true,
          template: function (obj) {
            if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
              return `<div class='task_view_template' style='background:${obj.color.background}'><div class='task_view__title'>${obj.title}</div> Description: ${obj.description}, creator: ${obj.creator_id}</div>`;
            }
            return "";
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
              icon: "mdi mdi-pencil",
              tooltip: "Edit",
              css: { "padding-right": "10px" },
            },
            {
              view: "uploader",
              value: "Open file",
              width: 64,
              type: "icon",
              icon: "mdi mdi-attachment",
              tooltip: "Attachment",
              accept: "image/jpeg, image/png, image/jpg",
              autosend: false,
              css: "webix_secondary open_file_uploader",
              multiple: false,
              id: prefix + "_open_uploader",
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
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-fit-to-screen-outline",
              tooltip: "Copy paste from Screenshot",
              css: { "padding-right": "10px" },
              click: function () {
                this.$scope.ui(TaskAttachScreenshot).show();
              },
            },
            {
              view: "button",
              autowidth: true,
              type: "icon",
              icon: "mdi mdi-camera-enhance-outline",
              tooltip: "Capture from Camera",
              css: { "padding-right": "10px" },
            },
            {},
          ],
        },

        {
          id: prefix + "file_view_panel",
          height: 100,
          cols: [
            {
              width: 130,
              cols: [
                { width: 10, css: "white_background" },
                {
                  view: "photo",
                  name: "photo",
                  css: "form_photo",
                  id: "form_photo",
                  borderless: false,
                  width: 120,
                  height: 65,
                },
                { width: 10, css: "white_background" },
              ],
            },
            { id: prefix + "file_view_empty", css: "white_background" },
            {
              view: "dataview",
              id: prefix + "file_view",
              height: 100,
              xCount: 4,
              select: true,
              hidden: true,
              type: {
                height: 100,
                width: "auto",
              },
              template: `<div style='background-image:url(${BACKEND_URL}/data/files/thumbnails/#path#);height:100px;background-repeat:no-repeat;background-position:center;background-size:contain;'></div>`,
              on: {
                onItemClick: function (id) {
                  this.$scope.ui(TaskPhotoPreview).show();
                },
              },
            },
          ],
        },
        {
          view: "template",
          template: "Comments",
          type: "section",
          css: { background: "#fff" },
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
              $$(prefix + "comment_text").setValue(item.comment);
              $$(prefix + "comment_text").focus();
            },
            "remove-icon": function (e, id, node) {
              const selId = parseInt(node.dataset.comment_id);
              removeCommentById(selId);
            },
          },
        },
        {
          padding: 10,
          css: { background: "#fff" },
          rows: [
            {
              // https://codepen.io/apodacaduron/pen/vYBrLox?css-preprocessor=less
              view: "textarea",
              id: prefix + "comment_text",
              height: 100,
            },
            {
              cols: [
                {
                  view: "button",
                  label: "Submit",
                  autowidth: true,
                  css: "webix_primary",
                  click: function () {
                    const commentViewId = $$(prefix + "comment_list");
                    const obj = stateComment.dataSelected;
                    if (
                      Object.keys(obj).length !== 0 &&
                      obj.constructor === Object
                    ) {
                      updateComment(
                        obj.id,
                        $$(prefix + "comment_text").getValue()
                      ).then((_) => {
                        webix.message({
                          text: "Comment updated",
                          type: "success",
                        });
                        loadComments();
                        clearComments();
                      });
                    } else {
                      createComment(
                        state.selId,
                        userProfile.userId,
                        $$(prefix + "comment_text").getValue()
                      ).then((r) => {
                        webix.message({
                          text: "Comment saved",
                          type: "success",
                        });
                        loadComments();
                        clearComments();
                      });
                    }
                  },
                },
                {
                  view: "button",
                  label: "Cancel",
                  autowidth: true,
                },
                {},
              ],
            },
            { height: 20 },
          ],
        },
      ],
    };
  }
  urlChange(_, url) {
    state.selId = parseInt(url[0].params.id);
    stateProject.selId = parseInt(url[0].params.project_id);
  }
  async ready(_, url) {
    state.selId = parseInt(url[0].params.id);
    stateProject.selId = parseInt(url[0].params.project_id);
    const task = await getTaskById(state.selId);
    const taskViewId = this.$$(prefix + "task_view");
    taskViewId.parse(task);
    taskViewId.refresh();

    await loadComments();

    const images = await getFileByTaskId(state.selId);
    const fileId = this.$$(prefix + "file_view");
    if (images.length > 0) {
      this.$$(prefix + "file_view_empty").hide();
      this.$$(prefix + "file_view").show();
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
      this.$$(prefix + "file_view_empty").show();
      this.$$(prefix + "file_view").hide();
    }
  }

  destructor() {
    stateComment.dataComments = [];
    stateComment.dataSelected = {};
  }
}
