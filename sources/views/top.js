import { JetView, plugins } from "webix-jet";
import { API_URL } from "../config/config";
import { defaultHeader } from "../helpers/api";
import { ProjectForm } from "./p/project/ProjectForm";
import { getMyProject, state, url as urlProject } from "../models/Project";
import { ProfileWindow } from "./profile";

export default class TopView extends JetView {
  config() {
    const header = {
      view: "toolbar",
      height: 42,
      cols: [
        {
          view: "icon",
          icon: "mdi mdi-account-circle-outline",
          click: function () {
          },
        },
        {
          view: "template",
          type: "clean",
          css: "z_app_name_tmpl",
          template: `<span class='z_app_name_title'>${this.app.config.name}</span>`,
        },
        {
          view: "icon",
          icon: "mdi mdi-dots-vertical",
          click: function () {
            this.$scope.ui(ProfileWindow).show();
          },
        },
      ],
    };

    const menu = {
      view: "list",
      id: "app:myproject",
      css: "app_menu",
      layout: "y",
      select: true,
      template: "#name# ",
      // url: `${urlProject}`,
      on: {
        onItemClick: function (id, e, node) {

          // this.$scope.show("p.task?id=" + id);
          // this.$scope.show("p.task?id=" + id);
          // this.unselect(id);
          // if (id) {
            const item = this.getItem(id);
          //
          this.$scope.show("/top/p.project?project_id=" + id);
          //   storeRole(item.role_access);
          //   asyncLocalStorage.setItem(JSON.stringify(item.role_access));
          //   // asyncLocalStorage.setItem(JSON.stringify({c: false, d: fsalse, r: true, u: true}));

          // }
        },
        onAfterSelect: function (id) {

          // localStorage.setItem("msel", id);
        },
      },
    };

    const ui = {
      type: "clean",
      paddingX: 5,
      css: "app_layout",
      cols: [
        {
          width: 250,
          rows: [
            {
              css: "webix_shadow_medium",
              rows: [header, menu],
            },
          ],
        },
        { view: "resizer", css: "z_content_ver_resizer" },
        {
          css: "z_content_ver_border",
          rows: [{ $subview: true }],
        },
      ],
    };

    return ui;
  }
  init() {
    webix.ui.fullScreen();
    // this.use(plugins.Menu, "app:myproject");
  }
  urlChange(_, url) {
  }
  ready(_, url) {

    // state.selId = url;
    // state.selId = url[0].params.id;
    getMyProject().then(r=>{

      this.$$("app:myproject").clearAll();
      this.$$("app:myproject").parse(r);
      //

      let a = url.find(p=>{



        return p.params.project_id// || (p.page=="p.project" && p.params.id)
      })

      if(a) {

        // state.selId = url[0].params.id || url[0].params.project_id;
        state.selId = a.params.project_id;


        this.$$("app:myproject").select(state.selId)

      }

      //

      // setTimeout(() => $$("app:myproject").select(state.selId), 500);
    })
    webix.event(window, "resize", function (e) {


      // $$("main_layout2").adjust()
    });

    // https://css-tricks.com/working-with-javascript-media-queries/

    // webix
    //   .ajax()
    //   .headers(defaultHeader())
    //   .post(`${API_URL}/user/profile`)
    //   .then((a) => {
    //     var b = a.json();
    //
    //   });
  }
}
