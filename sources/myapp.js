import "./styles/app.css";
import "animate.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "./models/session";
import { getScreenSize, subTime } from "./helpers/ui";
import { APP_NAME, LAST_VISIT, OFFLINE_DURATION } from "./config/config";
import { initSW, isOnline, state as stateSW } from "./models/ServiceWorker";

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

webix.protoUI(
  {
    name: "slideUpWindow",
    $init: function () {
      this.$ready.push(function () {
        this.attachEvent("onShow", function () {
          const boxes = document.querySelectorAll("body > div.webix_modal");
          boxes.forEach((box) => {
            box.style.backgroundColor = "#FFF";
          });
          this.$view.className =
            this.$view.className + " animate__animated animate__slideInUp"; // animate__fadeInDown
        });
        this.attachEvent("onHide", function () {
          this.$view.style.display = "block";
          this.$view.className += " animate__slideOutDown";
          setTimeout(() => {
            this.close();
          }, 200);
        });
      });
    },
  },
  webix.ui.window
);

export default class MyApp extends JetApp {
  constructor(config) {

    const defaults = {
      id: APPNAME,
      version: VERSION,
      router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
      debug: !PRODUCTION,
      name: APP_NAME,
      start: "/app/p.project",
    };

    super({ ...defaults, ...config });

    // Handle offline session
    const lastVisit = webix.storage.cookie.get(LAST_VISIT);
    const nowSub = subTime(new Date(), OFFLINE_DURATION);
    isOnline().then((ol) => {
      if ((isNaN(lastVisit) || nowSub <= lastVisit) && ol) {
        console.log("Online network-----------");
        this.use(plugins.User, {
          model: session,
          // ping: 10000,
        });
      } else {
        console.log("Offline network-----------");
        this.show("/app/p.project");
      }
    });
    // END: Handle offline session
  }
}

if (!BUILD_AS_MODULE) {
  webix.ready(() => {
    const app = new MyApp();
    // ping();
    app.render();

    app.ready.then(() => {
      const now = new Date().getTime();
      webix.storage.cookie.put(LAST_VISIT, now);
    });

    initSW();
  });
}
