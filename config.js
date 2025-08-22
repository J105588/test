// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyXsbO-vZSs_kpoYBE5O7oUVCe4IBmSo0Ulq5BQj8Rd9HtewWtLjSdPKS4yMHw349I/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
