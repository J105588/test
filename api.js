import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js';

class GasAPI {
  static async _callApi(functionName, params = []) {
    debugLog(`API Call: ${functionName}`, params);

    // CORSを使用してfetchでデータを取得
    try {
      const response = await fetch(GAS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          func: functionName,
          params: params
        })
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const data = await response.json();
      debugLog(`API Response: ${functionName}`, data);

      if (!data.success) {
        console.error(`API Error (${functionName}): ${data.error}`);
        throw new Error(data.error || '処理エラーが発生しました。');
      }

      return data;
    } catch (error) {
      console.error(`API通信に失敗しました: ${error.message}`);
      throw error; // エラーを再スローして、呼び出し元でハンドルできるようにする
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

  static async verifyModePassword(mode, password) {
    const response = await this._callApi('verifyModePassword', [mode, password]);
    return response;
  }

  static async getSeatData(group, day, timeslot, isAdmin) {
    const response = await this._callApi('getSeatData', [group, day, timeslot, isAdmin]);
    return response;
  }

  static async assignWalkInSeat(group, day, timeslot) {
    const response = await this._callApi('assignWalkInSeat', [group, day, timeslot]);
    return response;
  }

  static async reserveSeats(group, day, timeslot, selectedSeats) {
    const response = await this._callApi('reserveSeats', [group, day, timeslot, selectedSeats]);
    return response;
  }

  static async checkInSeat(group, day, timeslot, seatId) {
    const response = await this._callApi('checkInSeat', [group, day, timeslot, seatId]);
    return response;
  }
}

export default GasAPI;
