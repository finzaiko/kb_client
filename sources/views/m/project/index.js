import { JetView } from "webix-jet";
import { getDateFormatted } from "../../../helpers/ui";
import { getMyProject, state } from "../../../models/Project";
import { getMyTask } from "../../../models/Task";

const prefix = state + "_page_";

export default class ProjectPageMobile extends JetView {
  config() {
    const toolbar = {
      view: "toolbar",
      elements: [
        { width: 10 },
        {
          view: "label",
          label: "App",
          id: "mobile_navbar",
        },
        {},
      ],
    };

    const projectGrid = {
      view: "datatable",
      id: prefix + "table",
      select: "row",
      header: false,
      scrollX: false,
      rowHeight: 50,
      columns: [
        {
          id: "name",
          fillspace: true,
        },
      ],
      on: {
        onItemClick: function (id,row) {
          this.$scope.show("/mobile/m.task?project_id=" + id.row);
          state.selId = id.row;
        },
      },
    };

    return {
      rows: [toolbar, projectGrid],
    };
  }
  init(view) {}
  async urlChange(_, url) {}
  async ready(view, url) {
    const projects = await getMyProject();
    const projectTblId = $$(prefix + "table");
    projectTblId.clearAll();
    projectTblId.parse(projects);
  }
}
