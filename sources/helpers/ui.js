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

export const getScreenSize = () => {
  /*
  document.body.offsetWidth
  window.screen.width
  window.innerWidth
  sample break point:
  576px, 768px, 992px, and 1200px
  */
  // return window.matchMedia("(max-width: 700px)").matches ? "small" : "wide";
  return window.innerWidth < 700 ? "small" : "wide";
};

export function isInt(value) {
  let x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}
