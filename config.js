// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbykcf7mFGGGIzhctpj1yrT2f__pmNHvu1YXQCwya6aLKmKrmf8Ny7_LwOVauDv0oF0n/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
