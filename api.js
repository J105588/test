// api.js
import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js';

class GasAPI {
  static _callApi(functionName, params = []) {
    return new Promise((resolve, reject) => {
      debugLog(`API Call (JSONP): ${functionName}`, params);

      const callbackName = 'jsonpCallback_' + functionName + '_' + Date.now();
      window[callbackName] = (data) => {
        debugLog(`API Response (JSONP): ${functionName}`, data);
        delete window[callbackName]; // コールバック関数を削除
        if (data.success === false) {
          reject(new Error(data.error || '処理エラーが発生しました。'));
        } else {
          resolve(data);
        }
      };

      const script = document.createElement('script');
      let url = `${GAS_API_URL}?callback=${callbackName}&func=${functionName}&params=${encodeURIComponent(JSON.stringify(params))}`;
      script.src = url;
      script.onerror = (error) => {
        reject(new Error(`JSONPリクエストに失敗しました: ${error.message}`));
      };
      document.head.appendChild(script);
    });
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

window.GasAPI = GasAPI;
export default GasAPI;
