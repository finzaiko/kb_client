import { JetView } from "webix-jet";
import { state, url } from "../../../models/Task";

const prefix = state.prefix + "_attachscreen_";

let video, canvas;
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
            $$(winId).close();
          },
        },
      ],
    },
    body: {
      rows: [
        // {
        //   template: `
        //     <p id="img_screenshot_empty">Paste your image here…</p>
        //     <img id="img_screenshot"/>
        //     `,
        // },
        {
          template: `
          <video id="video" width="320" height="240" autoplay></video>
            <div id="dataurl-container">
                <canvas id="canvas" width="320" height="240"></canvas>
                <div id="dataurl-header">Image Data URL</div>
                <textarea id="dataurl" readonly></textarea>
            </div>
            `,
        },
        {
          view: "button",
          label: "Camera start",
          click: async function () {
            let camera_button = document.querySelector("#start-camera");
            video = document.querySelector("#video");
            let click_button = document.querySelector("#click-photo");
            canvas = document.querySelector("#canvas");

            let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;

            // camera_button.addEventListener('click', async function() {
            //     let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            //   video.srcObject = stream;
            // });

            // click_button.addEventListener('click', function() {
            //     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            //     let image_data_url = canvas.toDataURL('image/jpeg');

            //     // data url of the image
            //     console.log(image_data_url);
            // });
          }
        },
        {
          view: "button",
          label: "stop cam",
          click: function () {
            // const video = document.querySelector('video');

            // A video's MediaStream object is available through its srcObject attribute
            const mediaStream = video.srcObject;

            // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
            const tracks = mediaStream.getTracks();

            // Tracks are returned as an array, so if you know you only have one, you can stop it with:
            tracks[0].stop();

            // Or stop all like so:
            // tracks.forEach(track => track.stop())
          },
        },
        {
          view: "button",
          label: "capture camera",
          click: function () {
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image_data_url = canvas.toDataURL('image/jpeg');

            // data url of the image
            console.log(image_data_url);
          }
        }
      ],
    },
    on: {
      onShow() {
        document.onpaste = function(pasteEvent) {
          // consider the first item (can be easily extended for multiple items)
          var item = pasteEvent.clipboardData.items[0];

          if (item.type.indexOf("image") === 0)
          {
              var blob = item.getAsFile();

              var reader = new FileReader();
              reader.onload = function(event) {
                  document.getElementById("img_screenshot").src = event.target.result;
                  $$("form_photo").setValue(event.target.result);
                  // $$(winId).close();
              };

              reader.readAsDataURL(blob);
          }
      }
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
  ready(view) {

  }
}
