/**
 * API設定ファイル
 * GAS Web AppのURLを設定してください
 */

// GAS Web App URLを設定
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyr_lHjQUUKLP6y8-OwxHTdx5NbVOKl6vpNGUwYBYpDZgNe30isnztEPJN1xzPuKEXn/exec";

// テスト用デバッグモード
const DEBUG_MODE = true;

function debugLog(message, obj = null) {
  if (DEBUG_MODE) {
    console.log(message, obj || '');
  }
}

// モジュールとしてエクスポート
export { GAS_API_URL, DEBUG_MODE, debugLog };
