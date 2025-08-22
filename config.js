const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxgBX68FOMrQUn9Ix8JDxDimrzaTwe8chlOifcw6aiOQUgRtLY93bTd9xzmFgEWdUic/exec";
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

export default { GAS_API_URL, DEBUG_MODE, debugLog }; // 変更
