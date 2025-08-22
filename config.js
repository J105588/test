// config.js
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzNxpQP1kYpKW8bX4q4uPdE9LBs0E_sEFcCca4HvonkUITuedW8dyTuGNVqBWxRbit-/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// 個別にエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
