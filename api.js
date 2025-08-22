// api.js
import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js'; // config.jsからインポート

class GasAPI {
  static async _callApi(functionName, params = []) {
    debugLog(`API Call (POST): ${functionName}`, params);

    if (typeof GAS_API_URL === 'undefined' || !GAS_API_URL) {
      const errorMessage = "GASのAPI URLが定義されていないか、空です。config.jsを確認してください。";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const postData = { func: functionName, params: params };
    debugLog('Request Body:', postData);

    try {
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // CORS回避のためtext/plainに設定
        body: JSON.stringify(postData), // POSTデータをJSON形式で送信
        redirect: 'follow'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`サーバーとの通信に失敗しました (HTTPステータス: ${response.status}, レスポンス: ${errorText})`);
      }

      const data = await response.json(); // レスポンスをJSONとして解析
      debugLog(`API Response: ${functionName}`, data);

      if (data.success === false) {
        throw new Error(data.error || 'GAS側で処理エラーが発生しました。');
      }

      return data;

    } catch (error) {
      const errorMessage = error.message || '不明なエラー';
      console.error(`API Error (${functionName}):`, errorMessage, error);
      throw new Error(`API呼び出しに失敗しました: ${errorMessage}`);
    }
  }

  static async getAllTimeslotsForGroup(group) {
    const response = await this._callApi('getAllTimeslotsForGroup', [group]); // API関数の呼び出し
    return response.data; // データを返す
  }
}

// グローバル変数として設定
window.GasAPI = GasAPI;
export default GasAPI; // エクスポート
