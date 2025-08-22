// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbztLhMT_vorDIjLiPJIvsJtcVDMJdNVXIaf5G7nfWxyt2hRs-Znp5qp9h5eLjNF5CZD/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
