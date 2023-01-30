export function getDateFormatted(unixTimeStamp) {
  let date = new Date(unixTimeStamp * 1000);
  return (
    ("0" + date.getDate()).slice(-2) +
    "/" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2)
  );
}

export function getDatetoISOStr(unixTimeStamp) {
  return new Date(unik * 1e3).toISOString();
}

export const isMobileDevice = () => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  }
  return false;
};

export const getScreenSize = () => {
  /*
  document.body.offsetWidth
  window.screen.width
  window.innerWidth
  sample break point:
  576px, 768px, 992px, and 1200px
  */

 let appSize = "wide";

 if (isMobileDevice()) {
   appSize = "small";
  } else {
    // var mql = window.matchMedia("(min-width: 480px)");
    appSize = window.innerWidth < 700 ? "small" : "wide";
  }

  return appSize;
};

export function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}
