import { JetView } from "webix-jet";
import { APP_NAME } from "../../../config/config";
import { getScreenSize } from "../../../helpers/ui";

export default class ReportPage extends JetView {
  config() {
    function uiSmall() {
      const toolbar = {
        view: "toolbar",
        css: "z_navbar",
        elements: [
          { width: 10 },
          {
            view: "label",
            label: APP_NAME,
            id: "mobile_navbar",
          },
          {},
          {},
          { width: 10 },
        ],
      };
      return {
        rows: [
          toolbar,
          {
            template: "<p style='text-align:center;margin-top:50%;'>Report: Not implement yet</p>",
          },
        ],
      };
    }

    function uiWide() {
      return {
        template: "Report: Not implement yet",
      };
    }
    return getScreenSize() == "wide" ? uiWide() : uiSmall();
  }
}
