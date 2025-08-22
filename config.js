// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzHec16Y1a2KRVs5wt-dafR2GJ5TcEwF1zk1eMiBI4jZxcbBVVSV_3l1Xzdla29TS18/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
