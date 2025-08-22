// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyEWu3Cb-YXi0gwrG16zYbcBIvlYY-w1qFTlWnY-g4owNwYsbZxrrOtkO8MT5A3vlsI/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
