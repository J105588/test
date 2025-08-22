// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbznw_gxQgSOOzMF3DDi9tQrNPsOdJ-zKJfnM0R9PRtFfaACLhcnobRoDtansR9EKuM/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
