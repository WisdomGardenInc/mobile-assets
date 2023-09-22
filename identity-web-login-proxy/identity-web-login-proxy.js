function getUrlParams() {
  return location.search
    .substring(1, location.search.length)
    .split("&")
    .filter(function(pair) {
      return pair.length;
    })
    .map(function(pair) {
      return pair.split("=");
    })
    .reduce(function(result, pair) {
      result[pair[0]] = pair[1];
      return result;
    }, {});
}

function paramsToUrl(obj, encode = false) {
  return Object.keys(obj)
    .map(function(key) {
      return key + "=" + (encode ? encodeURIComponent(obj[key]) : obj[key]);
    })
    .join("&");
}

function getReidrectUrl(org) {
  var pathName = window.location.pathname;
  var indexOfPath = pathName.lastIndexOf("/");

  pathName = pathName.slice(0, indexOfPath + 1);

  var redirectUrl =
    window.location.origin +
    pathName +
    "identity-web-login-proxy-callback.html?" +
    paramsToUrl({ org: encodeURIComponent(JSON.stringify(org)) }, true);

  return redirectUrl;
}

function upperFirstvarter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getIdentityConfig(org, targetPlatform) {
  if (!org) {
    return null;
  }
  var platformConfigName = "identityConfigH5" + upperFirstvarter(targetPlatform);
  var config = org[platformConfigName]
    ? org[platformConfigName]
    : org["identityConfigH5"] || org["identityConfig"];

  return config;
}

function getInfoFromApp() {
  //  input org, platform
  var params = getUrlParams();

  console.log(params);
  var org = null;

  try {
    org = JSON.parse(decodeURIComponent(params["org"]));
  } catch {
    org = null;
  }

  var platform = org.platform || params["platform"] || "web";

  org.platform = platform;

  return { org, platform, code: params["code"] };
}

var identityLoginProxyUtils = {
  getUrlParams,
  paramsToUrl,
  getReidrectUrl,
  getIdentityConfig,
  getInfoFromApp,
};

window.identityLoginProxyUtils = identityLoginProxyUtils;
