import { JetView } from "webix-jet";
import { getMyTask, state } from "../../../models/Task";
import { getProjectById, state as stateProject } from "../../../models/Project";

const prefix = state.prefix + "_";

function backToGrid(_this) {
  // const backRoute =
  //   state.routePath == "m.task.add"
  //     ? `m.project?project_id=${stateProject.selId}`
  //     : `m.task?project_id=${stateProject.selId}&id=${state.selId}`;
  const backRoute = `m.project`;
  _this.show(backRoute);
}

export default class TaskPageMobile extends JetView {
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
          id: prefix + "navbar",
        },
        {},
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
            return `<div class='task_item'><span class='task_item_title'>${obj.title}</span><br><span class='task_item_desc'>${obj.description}</span></div>`;
          },
          fillspace: true,
        },
      ],
      on: {
        onItemClick: function (id) {
          state.selId = id.row;
          this.$scope.show(
            "/mobile/m.task.detail?project_id=" + stateProject.selId + "&id=" + id.row
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
  init(view) {}
  urlChange(_, url) {
    // state.selId = url[0].params.id;
    stateProject.selId = url[0].params.project_id;
  }

  async ready(view, url) {
    // state.selId = url[0].params.id;
    stateProject.selId = url[0].params.project_id;
    const project = await getProjectById(stateProject.selId);
    const navbarId = $$(prefix + "navbar");
    navbarId.setValue(`Task - ${project.name}`);

    const tasks = await getMyTask(stateProject.selId);

    this.$$(prefix + "table").clearAll();
    this.$$(prefix + "table").parse(tasks);

    // const projects = await getMyProject();
    // const projectTblId = $$(prefix + "table");
    // projectTblId.clearAll();
    // projectTblId.parse(projects);
  }
}
