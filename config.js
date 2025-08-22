// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxHB8A7_OQaR9xXlUim1z0VOJ9Ly-04a2KIz4I-5Esw02Y5TZvvQQPuCiAm1FJyEdQd/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
