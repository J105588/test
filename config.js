// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzRCOJD9wsPX_NOSdDlb3dtBwRmGpE2RPy5rWkRgVpFslQPeawl7c1TEJppPy5MwXHL/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
