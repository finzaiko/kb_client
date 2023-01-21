import { JetView } from "webix-jet";
import { getImgAsString, PhotoDropPaste } from "../../../helpers/photodrop";
import { state, url } from "../../../models/Task";

const prefix = state.prefix + "_attachscreen_";

let video,
  canvas,
  cameraFront = false;

function checkCamera() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      console.log("device", devices);
    })
    .catch(function (err) {
      console.log("err", err);
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
  let imgDataUrl = canvas.toDataURL("image/jpeg");
  $$("form_photo").setValue(imgDataUrl);
  // video.style.display = "none";
}

function stopCamera() {
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  if (tracks.length > 0) {
    tracks[0].stop();
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
        // {
        //   id: prefix + "file_tmpl",
        //   template: `
        //     <p id="img_screenshot_empty">Paste your image here…</p>
        //     <img id="img_screenshot"/>
        //     `,
        // },
        {
          id: prefix + "file_tmpl",
          template: `
            <canvas style="border:1px solid grey;" id="my_canvas" width="200" height="200"></canvas>
            `,
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
              css: { "padding-left": "10px", "padding-right": "10px" },
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
              icon: "mdi mdi-camera-flip",
              autowidth: true,
              tooltip: "Camera " + cameraFront ? "Back" : "Front",
              hidden: true,
              id: prefix + "camera_frontback",
              click: function () {
                flipCamera();
              },
              css: { "padding-left": "10px", "padding-right": "10px" },
            },
            {
              view: "button",
              type: "icon",
              icon: "mdi mdi-camera-iris",
              autowidth: true,
              tooltip: "Capture Camera",
              hidden: true,
              id: prefix + "camera_capture",
              click: function () {
                captureCamera();
                $$(winId).close();
              },
              css: { "padding-left": "10px", "padding-right": "10px" },
            },
            {},
          ],
        },
      ],
    },
    on: {
      onShow() {
        // document.onpaste = function (pasteEvent) {
        //   let item = pasteEvent.clipboardData.items[0];

        //   if (item.type.indexOf("image") === 0) {
        //     const blob = item.getAsFile();

        //     const reader = new FileReader();
        //     reader.onload = function (event) {
        //       document.getElementById("img_screenshot").src =
        //         event.target.result;
        //       $$("form_photo").setValue(event.target.result);
        //     };

        //     reader.readAsDataURL(blob);
        //   }
        // };

        const canvasElementId = "my_canvas";
        let CLIPBOARD = new PhotoDropPaste.CLIPBOARD_CLASS(
          canvasElementId,
          true,
          function () {
            console.log("paste_auto finished");
            const imgUrl = getImgAsString(canvasElementId)
            console.log('imgUrl',imgUrl);

          }
        );
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
