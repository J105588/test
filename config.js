/**
 * API設定ファイル
 * GAS Web AppのURLを設定してください
 */

// GAS Web App URLを設定
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxm4AGAOIPDOEbCgm5cZfrZsB8WvDRVFL_qVXPvRdf_sFr3Jg6CpRiuoQ1lNMCWLA1V/exec"; // API

// デバッグモードを常にtrueに設定
const DEBUG_MODE = true;

// ログ出力関数
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }
}

// Exportする内容
export { GAS_API_URL, DEBUG_MODE, debugLog };
