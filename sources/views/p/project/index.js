import { JetView } from "webix-jet";
import { state } from "../../../models/Project";
import { getMyTask } from "../../../models/Task";

const prefix = state + "_page_";

export default class ProjectPage extends JetView {
  config() {
    return {
      rows: [
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              label: "Create",
              autowidth: true,
              click: function () {
                this.$scope.show("p.task.add?project_id=" + state.selId);
              },
            },
          ],
        },
        {
          view: "datatable",
          id: prefix + "table",
          select: "row",
          columns: [
            { id: "title", header: "Title", width: 200 },
            { id: "description", header: "Description", fillspace: true },
            { id: "creator_id", header: "Create by", width: 100 },
            { id: "date_modification", header: "Update at", width: 100 },
          ],
          on: {
            onItemClick: function (id) {
              this.$scope.show(
                "/top/p.task?project_id=" + state.selId + "&id=" + id
              );
            },
          },
        },
      ],
    };
  }
  init(view) {}
  async urlChange(_, url) {
    state.selId = parseInt(url[0].params.id);
    const tasks = await getMyTask(state.selId);
    this.$$(prefix + "table").clearAll();
    this.$$(prefix + "table").parse(tasks);
  }
  async ready(_, url) {
    state.selId = parseInt(url[0].params.id);
    const tasks = await getMyTask(state.selId);
    this.$$(prefix + "table").clearAll();
    this.$$(prefix + "table").parse(tasks);
  }
}
