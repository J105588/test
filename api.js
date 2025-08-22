// api.js
import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js';

class GasAPI {
  static async _callApi(functionName, params = []) {
    debugLog(`API Call (POST): ${functionName}`, params);

    const postData = { func: functionName, params: params };

    // URLSearchParamsを使用してリクエストボディをエンコード
    const encodedParams = new URLSearchParams();
    for (const key in postData) {
      encodedParams.append(key, JSON.stringify(postData[key]));
    }

    try {
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedParams.toString(),
        mode: 'cors' // CORSモード
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`通信に失敗しました (HTTPステータス: ${response.status}, レスポンス: ${errorText})`);
      }

      const data = await response.json();
      debugLog(`API Response: ${functionName}`, data);

      if (data.success === false) {
        throw new Error(data.error || '処理エラーが発生しました。');
      }

      return data;

    } catch (error) {
      console.error(`API Error (${functionName}):`, error.message);
      throw error; // エラーを再スロー
    }
  }

  static async getAllTimeslotsForGroup(group) {
    const response = await this._callApi('getAllTimeslotsForGroup', [group]);
    return response.data; // データを返す
  }

  static async testApi() {
    const response = await this._callApi('testApi');
    return response.data;
  }
}

window.GasAPI = GasAPI;
export default GasAPI;
