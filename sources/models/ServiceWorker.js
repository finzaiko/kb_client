import { BACKEND_URL } from "../config/config";

export let state = {
  deferredPrompt: null,
  isReadyToInstall: false,
  isOnline: true,
};

export function initSW() {
  window.addEventListener("beforeinstallprompt", (event) => {
    console.log("Event: beforeinstallprompt >>>>>>>>>>>>> ");
    event.preventDefault();
    state.deferredPrompt = event;
    state.isReadyToInstall = true;
  });

  window.addEventListener("appinstalled", (event) => {
    console.log("App Installed");
  });

  handleConnection();

  window.addEventListener("online", handleConnection);
  window.addEventListener("offline", handleConnection);
}

export function installApp() {
  console.log("deferredPrompt1", state.deferredPrompt);

  let userAction = false;
  console.log("doInstall");
  state.deferredPrompt.prompt();
  state.deferredPrompt.userChoice.then((res) => {
    if (res.outcome === "accepted") {
      console.log("doInstall: accepted");
      userAction = true;
      state.isReadyToInstall = false;
    } else {
      console.log("doInstall: declined");
      state.isReadyToInstall = true;
      userAction = false;
    }
    state.deferredPrompt = null;
  });
  return userAction;
}

export function handleConnection() {
  if (navigator.onLine) {
    state.isOnline = true;
    isReachable(getServerUrl()).then(function (online) {
      if (online) {
        setTimeout(() => $$("app_offline").hide(), 1000);
      } else {
        state.isOnline = false;
        setTimeout(() => {
          $$("app_offline").show();
          $$("app_offline").setHTML(
            "<div style='background:#ff819a;color:#fff;'>No connectivity</div>"
          );
        }, 1000);
      }
    });
  } else {
    state.isOnline = false;
    setTimeout(() => {
      $$("app_offline").show();
      $$("app_offline").setHTML(
        "<div style='background:#f56581;color:#fff;'>You're offline</div>"
      );
    }, 1000);
  }
}

export function isOnline() {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      const isNetOk = isReachable(getServerUrl()).then((ol) => ol);
      if (isNetOk) {
        resolve(isNetOk);
      } else {
        resolve(true);
      }
    } else {
      resolve(false);
    }
  });
}
async function isReachable(url) {
  try {
    const resp = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return resp && (resp.ok || resp.type === "opaque");
  } catch (err) {
    return false;
  }
}

function getServerUrl() {
  return BACKEND_URL || window.location.origin;
}
