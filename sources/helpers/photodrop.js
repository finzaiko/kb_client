// http://jsfiddle.net/rwhal06/8Lv59zqt/
//=====================================================================
//See comment near next big divider line.
export let PhotoDropPaste = {};
/**
 * image pasting into canvas
 *
 * @param {string} canvas_id - canvas id
 * @param {boolean} autoresize - if canvas will be resized
 * @param {function} callback
 */
PhotoDropPaste.CLIPBOARD_CLASS = function (canvas_id, autoresize, callback) {
  let _self = this;
  let canvas = document.getElementById(canvas_id);
  console.log("CLIPBOARD_CLASS canvas", canvas);
  let ctx = document.getElementById(canvas_id).getContext("2d");
  console.log("CLIPBOARD_CLASS ctx", ctx);

  //handlers
  document.addEventListener(
    "paste",
    function (e) {
      console.log("paste");
      _self.paste_auto(e);
    },
    false
  );

  /* events fired on the drop targets */
  document.addEventListener(
    "dragover",
    function (e) {
      // prevent default to allow drop
      e.preventDefault();
    },
    false
  );
  document.addEventListener("drop", function (e) {
    // prevent default action (open as link for some elements)
    // add event handler to canvas if desired instead of document
    //debugger;
    e.preventDefault();
    let items = e.dataTransfer.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        //document.getElementById("instructions").style.visibility = "hidden";
        //image
        let blob = items[i].getAsFile();
        let URLObj = window.URL || window.webkitURL;
        let source = URLObj.createObjectURL(blob);
        _self.paste_createImage(source);
      }
    }
  });

  //on paste
  this.paste_auto = function (e) {
    if (e.clipboardData) {
      let items = e.clipboardData.items;
      if (!items) return;

      //access data directly
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          //image
          let blob = items[i].getAsFile();
          let URLObj = window.URL || window.webkitURL;
          let source = URLObj.createObjectURL(blob);
          this.paste_createImage(source);
        }
      }
      e.preventDefault();
    }
  };
  //draw pasted image to canvas
  this.paste_createImage = function (source) {
    console.log("this.paste_createImage", source);
    //debugger;
    let pastedImage = new Image();
    pastedImage.onload = function () {
      if (autoresize == true) {
        //resize
        canvas.width = pastedImage.width;
        canvas.height = pastedImage.height;
      } else {
        //clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(pastedImage, 0, 0);
      const imageAsString = getImgAsString(canvas_id);
      callback(imageAsString);
    };
    pastedImage.src = source;
  };
};

export function isCanvasBlank(canvas) {
  // detect blank canvas: https://stackoverflow.com/a/17386803/
  console.log("isCanvasBlank", canvas);
  let blank = document.createElement("canvas");
  blank.width = canvas.width;
  blank.height = canvas.height;
  return canvas.toDataURL() === blank.toDataURL();
}

export function getImgAsString(canvasElementId) {
  console.log("getImgAsString", canvasElementId);
  //debugger;
  let canvasEl = document.getElementById(canvasElementId);
  if (isCanvasBlank(canvasEl)) {
    return null;
  } else {
    let imageData = canvasEl.toDataURL("image/png");
    //console.log('imageData', imageData);
    imageData = imageData.replace("data:image/png;base64,", "");
    return imageData;
  }
}

//=====================================================================
//Everything above that line could be put into a webpack module. Then the following could be called on a page after the document has loaded:

// const canvasElementId = "my_canvas";
// let CLIPBOARD = new exportsSelf.CLIPBOARD_CLASS(
//   canvasElementId,
//   true,
//   function () {
//     console.log("paste_auto finished");
//     document.getElementById("go").style.display = "block";
//   }
// );

// document.getElementById("go").addEventListener("click", function () {
//   const imgString = getImgAsString(canvasElementId);
//   alert(imgString);
//   document.getElementById("output").innerHTML = imgString;
// });
