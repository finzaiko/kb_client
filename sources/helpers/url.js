export function updateURLParam(url, param, paramVal) {
  let theAnchor = null;
  let newAdditionalURL = "";
  let tempArray = url.split("?");
  let baseURL = tempArray[0];
  let additionalURL = tempArray[1];
  let temp = "";

  if (additionalURL) {
    let tmpAnchor = additionalURL.split("#");
    let TheParams = tmpAnchor[0];
    theAnchor = tmpAnchor[1];
    if (theAnchor) additionalURL = TheParams;

    tempArray = additionalURL.split("&");

    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split("=")[0] != param) {
        newAdditionalURL += temp + tempArray[i];
        temp = "&";
      }
    }
  } else {
    let tmpAnchor = baseURL.split("#");
    let TheParams = tmpAnchor[0];
    theAnchor = tmpAnchor[1];

    if (TheParams) baseURL = TheParams;
  }

  if (theAnchor) paramVal += "#" + theAnchor;

  const rowsTxt = temp + "" + param + "=" + paramVal;
  return baseURL + "?" + newAdditionalURL + rowsTxt;
}

export function removeURLParam(key, sourceURL) {
  let rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (let i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

export const getScreenSize = () => (document.body.offsetWidth > 700 ? "wide" : "small");