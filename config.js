// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyR1BjAigNCMhqveOWxwyWDi_R7KR7y5s6j_xY9M5iua8NeBpZP95JckAPKufXNwf0d/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
