import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "./models/session";
import { initSession } from "./models/UserProfile";
import { setAppHeader } from "./helpers/api";

webix.protoUI(
  {
    name: "photo",
    $allowsClear: true,
    defaults: {
      width: 360,
      height: 260,
      template: function (data, view) {
        view.$view.style.backgroundImage = `url(${data.src})`;
        view.$view.style.backgroundRepeat = "no-repeat";
        view.$view.style.backgroundPosition = "center";
        view.$view.style.backgroundSize = "contain";
        return "";
      },
    },
    $init(config) {
      if (config.value) {
        this.$ready.push(function () {
          this.setValue(config.value);
        });
      }
    },
    getValue() {
      const data = this.getValues();
      if (data) return data.src;
      return null;
    },
    setValue(value) {
      this.setValues({ src: value });
    },
  },
  webix.ui.template
);

export default class MyApp extends JetApp {
  constructor(config) {
    const defaults = {
      id: APPNAME,
      version: VERSION,
      router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
      debug: !PRODUCTION,
      start: "/app/start",
    };

    super({ ...defaults, ...config });

    this.use(plugins.User, {
      model: session,
      // ping: 10000,
    });
  }
}

if (!BUILD_AS_MODULE) {
  webix.ready(() => {
    const app = new MyApp();

    app.render();
  });
}
