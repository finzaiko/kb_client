import { JetView } from "webix-jet";
import { getColumnByProjectId, getMyTask, state } from "../../../models/Task";
import { getProjectById, state as stateProject } from "../../../models/Project";
import { getDateFormatted, getScreenSize, showError } from "../../../helpers/ui";
import { FloatingButton } from "../../../helpers/component";
import { mergeByKey } from "../../../helpers/api";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const prefix = state.prefix + "_";
let _scope;

function backToGrid(_this) {
  const backRoute = `p.project`;
  _this.show(backRoute);
}

function time2TimeAgo(ts) {
  // This function computes the delta between the
  // provided timestamp and the current time, then test
  // the delta for predefined ranges.

  var d = new Date(); // Gets the current time
  var nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
  var seconds = nowTs - ts;

  // more that two days
  if (seconds > 2 * 24 * 3600) {
    return "a few days ago";
  }
  // a day
  if (seconds > 24 * 3600) {
    return "yesterday";
  }

  if (seconds > 3600) {
    return "a few hours ago";
  }
  if (seconds > 1800) {
    return "Half an hour ago";
  }
  if (seconds > 60) {
    return Math.floor(seconds / 60) + " minutes ago";
  }
}

async function reloadTask() {
  const tasks = await getMyTask(stateProject.selId);
  $$(prefix + "table").parse(tasks, "json", true);
}
export default class TaskPage extends JetView {
  config() {
    _scope = this;
    function uiSmall(_this) {
      const toolbar = {
        view: "toolbar",
        css: "z_navbar",
        elements: [
          { width: 10 },
          {
            view: "icon",
            icon: "mdi mdi-arrow-left",
            click: () => {
              backToGrid(_this);
            },
          },
          {
            view: "label",
            label: " Task",
            id: prefix + "navbar",
          },
          {},
          {
            view: "icon",
            icon: "mdi mdi-dots-vertical",
            // click: function () {
            //   return; // test
            //   webix
            //     .ui({
            //       view: "slideUpWindow",
            //       height: 250,
            //       width: window.innerWidth,
            //       position: function (state) {
            //         state.top = state.maxHeight - state.height;
            //       },
            //       modal: true,
            //       head: {
            //         view: "toolbar",
            //         cols: [
            //           { width: 4 },
            //           { view: "label", label: "Filter.." },
            //           {
            //             view: "icon",
            //             icon: "mdi mdi-close",
            //             tooltip: "Close Me",
            //             click: function () {
            //               this.getParentView().getParentView().close();
            //             },
            //           },
            //         ],
            //       },
            //       body: {
            //         template: "Some text",
            //       },
            //       on: {
            //         onShow: function () {
            //           const _this = this;
            //           const modal = document.querySelector("div.webix_modal");
            //           modal.addEventListener("click", function (e) {
            //             _this.close();
            //           });
            //         },
            //       },
            //     })
            //     .show();
            // },
            popup: {
              view: "popup",
              width: 120,
              body: {
                view: "list",
                data: [
                  {
                    id: "_sname",
                    name: "name",
                    icon: "mdi mdi-magnify",
                    tooltip: "Search by name",
                  },
                  {
                    id: "_scontent",
                    name: "content",
                    icon: "mdi mdi-text-search",
                    tooltip: "Search by content",
                  },
                ],
                template: "<span class='#icon#'></span> #name#",
                autoheight: true,
                select: true,
                on: {
                  onItemClick: function (id) {
                    console.log('id',id);

                  },
                },
              },
            },
          },
          { width: 10 },
        ],
      };

      const taskGrid = {
        view: "datatable",
        id: prefix + "table",
        select: "row",
        header: false,
        scrollX: false,
        rowHeight: 60,
        fixedRowHeight: false,
        rowLineHeight: 20,
        maxRowHeight: 60,
        columns: [
          {
            id: "name",
            template: function (obj, common) {
              return `<div class='task_item'>
                <span class='task_item_title'>${obj.title}</span>
                <span class='task_item_creator'>(${obj.assignee_name})</span>
                <br>
                  <span class='task_item_desc'>${obj.description}</span>
                  <span class='task_item_trailing'>${timeAgo.format(
                    obj.date_modification * 1000,
                    "mini"
                  )}</span>
              </div>`;
            },
            fillspace: true,
          },
        ],
        on: {
          onItemClick: function (id) {
            state.selId = id.row;
            _this.show(
              "/app/p.task.detail?project_id=" +
                stateProject.selId +
                "&id=" +
                id.row
            );
          },
          on: {
            onAfterLoad: function () {
              webix.delay(function () {
                this.adjustRowHeight("name", true);
                this.render();
              }, this);
            },
            onColumnResize: function () {
              this.adjustRowHeight("name", true);
              this.render();
            },
          },
        },
      };
      return {
        rows: [toolbar, taskGrid],
      };
    }

    function uiWide() {
      return {
        rows: [
          {
            id: prefix + "empty",
            template: "Please select project",
          },
          {
            id: prefix + "panel",
            hidden: true,
            rows: [
              {
                view: "toolbar",
                css: "z_navbar",
                elements: [
                  {
                    view: "button",
                    label: "Create",
                    // css: "webix_primary_light",
                    autowidth: true,
                    click: function () {
                      this.$scope.show(
                        "p.task.add?project_id=" + stateProject.selId
                      );
                    },
                  },
                  {
                    view: "text",
                    placeholder: "Search..",
                    css: "z_text_outline",
                    width: 400,
                  },
                  {
                    view: "combo",
                    label: "Filter",
                    css: "z_combo_filter",
                    labelWidth: 50,
                    value: 1,
                    width: 200,
                    options: [
                      { id: 1, value: "status:open" },
                      { id: 2, value: "status:close" },
                    ],
                  },
                  {
                    view: "button",
                    label: "Refresh",
                    css: "webix_primary_outline",
                    autowidth: true,
                    click: function () {
                      reloadTask();
                    },
                  },
                ],
              },
              {
                view: "datatable",
                id: prefix + "table",
                select: "row",
                columns: [
                  {
                    id: "title",
                    header: ["Title", { content: "textFilter" }],
                    width: 200,
                  },
                  {
                    id: "description",
                    header: ["Description", { content: "textFilter" }],
                    fillspace: true,
                  },
                  {
                    id: "column_name",
                    header: ["Progress", { content: "textFilter" }],
                  },
                  {
                    id: "assignee_name",
                    header: ["Created by", { content: "textFilter" }],
                    width: 100,
                  },
                  {
                    id: "updated_at",
                    header: "Update at",
                    width: 150,
                    template: function (obj, common) {
                      return getDateFormatted(obj.date_modification);
                    },
                  },
                ],
                on: {
                  onLoadError: function(text, xml, xhr) {
                    showError(xhr);
                  },
                  onBeforeLoad: function() {
                    this.showOverlay("Loading...");
                  },
                  onAfterLoad: function() {
                    this.hideOverlay();
                  },
                  onItemClick: function (id) {
                    // return;
                    this.$scope.show(
                      "/app/p.task.detail?project_id=" +
                        stateProject.selId +
                        "&id=" +
                        id
                    );
                  },
                },
              },
            ],
          },
        ],
      };
    }

    return getScreenSize() == "wide" ? uiWide() : uiSmall(this);
  }
  init(view) {}
  async urlChange(_, url) {
    stateProject.selId = url[0].params.project_id;
    // state.selId = url[0].params.project_id;

    if (getScreenSize() == "wide") {
      if (!stateProject.selId) {
        this.$$(prefix + "empty").show();
        this.$$(prefix + "panel").hide();
      } else {
        this.$$(prefix + "empty").hide();
        this.$$(prefix + "panel").show();

        const taskTblId = $$(prefix + "table");
        webix.extend(taskTblId, webix.ProgressBar);
        taskTblId.disable();
        taskTblId.showProgress();

        const tasks = await getMyTask(stateProject.selId);
        this.$$(prefix + "table").parse(tasks, "json", true);
        taskTblId.enable();
        taskTblId.hideProgress();
      }
    } else {
      const project = await getProjectById(stateProject.selId);
      const navbarId = $$(prefix + "navbar");
      navbarId.setValue(`Task - ${project.name}`);

      const tasks = await getMyTask(stateProject.selId);

      this.$$(prefix + "table").clearAll();
      this.$$(prefix + "table").parse(tasks);
    }
  }

  async ready(view, url) {
    stateProject.selId = url[0].params.project_id;
    if (getScreenSize() == "wide") {
      if (!stateProject.selId) {
        this.$$(prefix + "empty").show();
        this.$$(prefix + "panel").hide();
      } else {
        this.$$(prefix + "empty").hide();
        this.$$(prefix + "panel").show();
        const tasks = await getMyTask(stateProject.selId);
        this.$$(prefix + "table").parse(tasks, "json", true);
      }
    } else {
      const taskTblId = $$(prefix + "table");
      webix.extend(taskTblId, webix.ProgressBar);
      taskTblId.disable();
      taskTblId.showProgress();

      const project = await getProjectById(stateProject.selId);
      const navbarId = $$(prefix + "navbar");
      navbarId.setValue(`Task - ${project.name}`);

      const tasks = await getMyTask(stateProject.selId);
      this.$$(prefix + "table").parse(tasks, "json", true);
      taskTblId.enable();
      taskTblId.hideProgress();
      FloatingButton("create_task_float", function () {
        _scope.show("p.task.add?project_id=" + stateProject.selId);
      }).show();
    }
  }
  destructor() {
    if ($$("create_task_float")) $$("create_task_float").close();
  }
}
