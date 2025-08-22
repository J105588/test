const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyr_lHjQUUKLP6y8-OwxHTdx5NbVOKl6vpNGUwYBYpDZgNe30isnztEPJN1xzPuKEXn/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

export default { GAS_API_URL, DEBUG_MODE, debugLog }; // 変更
