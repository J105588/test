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

    // URLSearchParamsを使用してリクエストボディをエンコード
    const encodedParams = new URLSearchParams();
    for (const key in postData) {
      encodedParams.append(key, JSON.stringify(postData[key])); // 値をJSON文字列として追加
    }

    try {
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Content-Typeを変更
        body: encodedParams.toString(), // エンコードされたパラメータを送信
        redirect: 'follow',
        mode: 'cors' // CORSモードを追加
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

  // シンプルなテスト用API関数
  static async testApi() {
    const response = await this._callApi('testApi');
    return response.data;
  }
}

// グローバル変数として設定
window.GasAPI = GasAPI;
export default GasAPI; // エクスポート
