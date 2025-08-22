/**
 * API設定ファイル
 * GAS Web AppのURLを設定してください
 */

// GAS Web App URLを設定
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxw_NEk1FUvUrWQDH0XFs6ynS5puSpQ6pv2-05Q_cMUJaRsNgPhpmn8IAS_bx2Ilrg8/exec"; // API

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

// グローバル変数として設定
window.GAS_API_URL = GAS_API_URL;
window.DEBUG_MODE = DEBUG_MODE;
window.debugLog = debugLog;
