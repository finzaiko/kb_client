import { JetView } from "webix-jet";
import { state, url } from "../../../models/Task";

const prefix = state.prefix + "_attachscreen_";
const prefixPage = state + "_page_";

let video,
  canvas,
  cameraFront = false;

const BlobToBase64 = function (urlObj, blob) {
  let blobUrl = urlObj.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = blobUrl;
  }).then((img) => {
    URL.revokeObjectURL(blobUrl);
    // Limit to 256x256px while preserving aspect ratio
    let [w, h] = [img.width, img.height];
    let aspectRatio = w / h;
    // Say the file is 1920x1080
    // divide max(w,h) by 256 to get factor
    let factor = Math.max(w, h) / 256;
    w = w / factor;
    h = h / factor;

    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
  });
};

function checkCamera() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {

    })
    .catch(function (err) {

    });
}

function flipCamera() {
  cameraFront = !cameraFront;
  stopCamera();
  startCamera();
}

async function startCamera() {
  // checkCamera();
  video = document.querySelector("#video");
  canvas = document.querySelector("#camera_canvas");
  let stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: cameraFront ? "user" : "environment" },
    audio: false,
  });
  video.srcObject = stream;
}

function captureCamera() {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let imgDataUrl = canvas.toDataURL("image/png");
  $$("form_photo").setValue(imgDataUrl);
  $$(prefixPage + "file_view_panel").show();
  $$(prefixPage + "file_attach_panel").show();
  // video.style.display = "none";
}

function stopCamera() {
  if (typeof video != "undefined") {
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();
    if (tracks.length > 0) {
      tracks[0].stop();
    }
  }
}

function WindowForm() {
  const winId = prefix + "win";
  return {
    view: "window",
    position: "center",
    modal: true,
    move: true,
    id: winId,
    width: 500,
    height: 400,
    head: {
      view: "toolbar",
      cols: [
        { width: 4 },
        { view: "label", label: "Attach Screenshot" },
        {
          view: "icon",
          icon: "mdi mdi-close",
          tooltip: "Close Me",
          align: "right",
          click: function () {
            stopCamera();
            $$(winId).close();
          },
        },
      ],
    },
    body: {
      rows: [
        {
          id: prefix + "file_tmpl",
          rows: [
            {
              css: "img_screenshot_empty_tmpl",
              cols: [
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
                        let imgTmpl = document.getElementById("img_screenshot");
                        imgTmpl.style.backgroundImage = `url(${event.target.result})`;
                        imgTmpl.style.backgroundRepeat = "no-repeat";
                        imgTmpl.style.backgroundPosition = "center";
                        imgTmpl.style.backgroundSize = "contain";
                        imgTmpl.style.width = "100%";
                        imgTmpl.style.height = "100%";

                        $$("form_photo").setValue(event.target.result);
                        $$(winId).close();
                        $$(prefixPage + "file_view_panel").show();
                        $$(prefixPage + "file_attach_panel").show();
                      };
                      state.fileNameUpload = Object.values(
                        $$(prefix + "_open_uploader").files.data.pull
                      )[0].name;
                      reader.readAsDataURL(file);
                      return false;
                    },
                  },
                },
                {
                  type: "clean",
                  template: `<p id="img_screenshot_empty"> or paste your image below here…</p>`,
                },
              ],
            },
            {
              template: `
              <img id="img_screenshot"/>
              `,
            },
          ],
        },
        {
          id: prefix + "camera_tmpl",
          hidden: true,
          template: `
          <div class='camera_attach_container'>
          <video id="video" width="100%" height="100%" autoplay></video>
          <canvas id="camera_canvas" width="320" height="240"></canvas>
          <div>
          `,
        },
        {
          cols: [
            {},
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-file",
              autowidth: true,
              tooltip: "Use file",
              hidden: true,
              id: prefix + "use_file",
              click: function () {
                $$(prefix + "camera_tmpl").hide();
                $$(prefix + "file_tmpl").show();
                $$(prefix + "camera_start").show();
                $$(prefix + "camera_capture").hide();
                $$(prefix + "camera_frontback").hide();
                $$(prefix + "use_file").hide();
                stopCamera();
                this.hide();
              },
            },
            {
              view: "button",
              id: prefix + "camera_start",
              type: "icon",
              icon: "mdi mdi-camera",
              tooltip: "Use Camera",
              autowidth: true,
              click: function () {
                if ($$(prefix + "file_tmpl")) $$(prefix + "file_tmpl").hide();
                $$(prefix + "camera_tmpl").show();
                $$(prefix + "camera_capture").show();
                $$(prefix + "camera_frontback").show();
                $$(prefix + "use_file").show();
                startCamera();
                this.hide();
              },
              css: { "padding-left": "10px", "padding-right": "10px" },
            },
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-camera-iris",
              css: "capture_camera",
              autowidth: true,
              tooltip: "Capture Camera",
              hidden: true,
              id: prefix + "camera_capture",
              click: function () {
                captureCamera();
                $$(winId).close();
              },
            },
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-camera-flip",
              autowidth: true,
              tooltip: `Camera ${cameraFront ? "Back" : "Front"}`,
              hidden: true,
              id: prefix + "camera_frontback",
              click: function () {
                flipCamera();
              },
            },
            {},
          ],
        },
      ],
    },
    on: {
      onShow() {
        document.onpaste = function (pasteEvent) {
          let item = pasteEvent.clipboardData.items[0];

          if (item.type.indexOf("image") === 0) {
            const blob = item.getAsFile();

            const reader = new FileReader();
            reader.onload = function (event) {
              document.getElementById("img_screenshot").src =
                event.target.result;
              $$("form_photo").setValue(event.target.result);
              $$(prefixPage + "file_view_panel").show();
              $$(prefixPage + "file_attach_panel").show();
              $$(winId).close();
            };

            reader.readAsDataURL(blob);
          }
        };
      },
      onDestruct() {
        stopCamera();
      },
    },
  };
}

export class TaskAttachScreenshot extends JetView {
  config() {
    return WindowForm();
  }
  show(target) {
    this.getRoot().show(target);
  }
  init(view) {}
  ready(view) {}
}
