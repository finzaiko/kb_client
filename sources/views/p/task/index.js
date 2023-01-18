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
  state as stateComment,
  updateComment,
} from "../../../models/Comment";
import { getDateFormatted } from "../../../helpers/ui";
import { BACKEND_URL } from "../../../config/config";
import { userProfile } from "../../../models/UserProfile";
import { TaskPhotoPreview } from "./TaskPhotoPreview";

const prefix = state + "_page_";

export default class TaskPage extends JetView {
  config() {
    return {
      type: "clean",
      borderless: true,
      rows: [
        // {
        //   view: "dataview",
        //   id: prefix + "task_view",
        //   height: 80,
        //   xCount: 1,
        //   select: true,
        //   type: {
        //     height: 60,
        //     width: "auto",
        //   },
        //   template:
        //     "<div class='webix_strong'>#title#</div> Description: #description#, creator: #creator_id#",
        // },
        {
          view: "template",
          id: prefix + "task_view",
          height: 60,
          template: function (obj) {
            if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
              return `<div style='background:${obj.color.background}'><span class='webix_strong'>${obj.title}<br></span> Description: ${obj.description}, creator: ${obj.creator_id}</div>`;
            }
            return "";
          },
        },
        {
          height: 100,
          cols: [
            { width: 10, css: "photo_panel_spacer" },
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
                    {},
                  ],
                },
              ],
            },
            { width: 10, css: "photo_panel_spacer" },
            {
              view: "dataview",
              id: prefix + "file_view",
              height: 100,
              xCount: 4,
              select: true,
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
          padding: 10,
          css: { background: "#fff" },
          rows: [
            {
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
                    const obj = commentViewId.getSelectedItem();
                    if (
                      Object.keys(obj).length !== 0 &&
                      obj.constructor === Object
                    ) {
                      console.log("update");
                      updateComment(
                        obj.id,
                        $$(prefix + "comment_text").getValue()
                      ).then((_) => {
                        webix.message({
                          text: "Comment updated",
                          type: "success",
                        });
                      });
                    } else {
                      createComment(
                        state.selId,
                        userProfile.userId,
                        $$(prefix + "comment_text").getValue()
                      ).then((_) => {
                        webix.message({
                          text: "Comment saved",
                          type: "success",
                        });
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
          ],
        },
        {
          // https://snippet.webix.com/t35bvms3
          // view: "list",
          view: "datatable",
          // autoheight: true,
          scroll: true,
          header: false,
          fixedRowHeight: false,
          fillspace: true,
          ready() {
            this.adjustRowHeight();
          },
          // height:350,
          // type: {
          //   height: "auto", // height for data items, not for the component
          // },
          // fixedRowHeight:false,  rowLineHeight:25, rowHeight:25,
          id: prefix + "comment_list",
          // <span class='webix_icon mdi mdi-close remove-icon' title='Remove'></span>
          // template: function (obj) {
          //   return `<div><span class='webix_strong'>${
          //     obj.name
          //   }</span> <span style='color:grey'>create at: ${getDateFormatted(
          //     obj.date_creation
          //   )} update at: ${getDateFormatted(obj.date_modification)}</span>
          //   <span class='webix_icon mdi mdi-pencil update-icon' title='Update' style='height:30px;'></span>
          //   </div>
          //   <div>${
          //     obj.comment
          //   }<span class='webix_icon mdi mdi-close update-icon' title='Remove' style='height:30px;'></span></div>

          //   `;
          // },
          css: "comment_list",
          // columns: [
          //   {
          //     id: "name",
          //     fillspace: true,
          //     template: function (obj) {
          //       return `
          //       <div class="chat">
          //         <div data-time="16:35" class="msg sent">Hi!<br>What's up?</div>
          //         <div data-time="Anna 16:36" class="msg rcvd">Hi dear! <br>Doing some CSS research, you?</div>
          //         <div data-time="16:38" class="msg sent">Also learning some cool CSS stuff 🦄</div>
          //         <div data-time="16:38" class="msg sent">!!</div>
          //         <div data-time="16:38" class="msg sent">Up for a coffee today? ☕</div>
          //         <div data-time="Anna 16:40" class="msg rcvd">It would be a pleasure!</div>
          //         <div data-time="Anna 16:40" class="msg rcvd">😍</div>
          //       </div>`;
          //     },
          //   },
          // ],
          columns: [
            {
              id: "name",
              fillspace: true,
              template: function (obj) {
                return `<div class='comment_list_panel'>${
                  obj.name
                } <span style='color:grey'>create at: ${getDateFormatted(
                  obj.date_creation
                )} update at: ${getDateFormatted(
                  obj.date_modification
                )}</span><br>
                <div class='comment_list_msg'>${obj.comment}</div>
                </div>`;
              },
            },
          ],
          // https://codepen.io/AllThingsSmitty/pen/jommGQ
          // https://stackoverflow.com/questions/71154905/css-for-chat-room-speech-bubble-position
          // https://samuelkraft.com/blog/ios-chat-bubbles-css
          // https://codepen.io/rajesh-kumar-dash/full/vvWJdN
          // https://codepen.io/n7best/pen/OXXLNQ
          // https://codepen.io/FilipRastovic/pen/pXgqKK
          // https://codepen.io/kvzivn/pen/EdNVbQ
          // https://codepen.io/andrewerrico/pen/XzdmrP
          // https://codepen.io/dianastanciu/pen/PowQmba
          // https://codepen.io/CodeLlama/pen/mdOPweQ
          // https://codepen.io/TawFiQ/pen/mWmwao
          onClick: {
            "update-icon": function (e, id, node) {
              const item = this.getItem(id);
              $$(prefix + "comment_text").setValue(item.comment);
            },
          },
          // <span style='float:right;height:150px;background:yellow;'>
          // <span class='webix_icon mdi mdi-pencil update-icon' title='Update' style='margin-right:10px;background:white;padding:0 10px;'></span>
          //   <span class='webix_icon mdi mdi-close remove-icon' title='Remove' style='height:100px;background:yellow;'></span>
          // </span>

          select: true,
          type: {
            height: 62,
          },
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

    const comments = await getAllComment(state.selId);
    const commentListId = this.$$(prefix + "comment_list");
    commentListId.parse(comments);

    const fileId = this.$$(prefix + "file_view");
    const images = await getFileByTaskId(state.selId);
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
  }
}
