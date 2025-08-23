// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzAmQFE_nQYndzQSE-L3r7m37ymbg3gTFIgLp5ushUxnp7stRAcBB1YwuqLDgLKgCHb/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
