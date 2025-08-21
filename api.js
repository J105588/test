/**
 * GAS APIとの通信を行うモジュール (POSTリクエスト対応版)
 * config.jsに定義されたGAS_API_URLとdebugLogを使用します。
 * POSTリクエストを利用してCORSの問題を回避します。
 */

import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js';

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
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(postData),
        redirect: 'follow'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`サーバーとの通信に失敗しました (HTTPステータス: ${response.status}, レスポンス: ${errorText})`);
      }

      const data = await response.json();
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

  // 各API関数の呼び出し
  static async getSeatData(group, day, timeslot, isAdmin) {
    if (!group || !day || !timeslot) {
      throw new Error("getSeatData: group, day, timeslotは必須パラメータです。");
    }
    return this._callApi('getSeatData', [group, day, timeslot, isAdmin]);
  }

  static async reserveSeats(group, day, timeslot, selectedSeats) {
    if (!group || !day || !timeslot || !Array.isArray(selectedSeats)) {
      throw new Error("reserveSeats: group, day, timeslot, selectedSeatsは必須パラメータです。");
    }
    return this._callApi('reserveSeats', [group, day, timeslot, selectedSeats]);
  }

  static async checkInSeat(group, day, timeslot, seatId) {
    if (!group || !day || !timeslot || !seatId) {
      throw new Error("checkInSeat: group, day, timeslot, seatIdは必須パラメータです。");
    }
    return this._callApi('checkInSeat', [group, day, timeslot, seatId]);
  }

  static async assignWalkInSeat(group, day, timeslot) {
    if (!group || !day || !timeslot) {
      throw new Error("assignWalkInSeat: group, day, timeslotは必須パラメータです。");
    }
    return this._callApi('assignWalkInSeat', [group, day, timeslot]);
  }

  static async verifyAdminPassword(password) {
    if (!password) {
      throw new Error("verifyAdminPassword: passwordは必須パラメータです。");
    }
    return this._callApi('verifyAdminPassword', [password]);
  }

  static async verifyModePassword(mode, password) {
    if (!mode || !password) {
      throw new Error("verifyModePassword: mode, passwordは必須パラメータです。");
    }
    return this._callApi('verifyModePassword', [mode, password]);
  }

  static async getAllTimeslotsForGroup(group) {
    if (!group) {
      throw new Error("getAllTimeslotsForGroup: groupは必須パラメータです。");
    }
    return this._callApi('getAllTimeslotsForGroup', [group]);
  }
}

export default GasAPI;// api.js
class GasAPI {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  async _callApi(func, params = []) {
    const payload = {
      func: func,
      params: params,
    };

    console.debug('[DEBUG] API Call (POST):', func);
    console.debug(params.length > 0 ? params : 'No parameters');
    console.debug('[DEBUG] Request Body:', payload);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        mode: 'cors',  // CORSを有効にする
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error(`API Error (${func}): ${data.error}`);
        throw new Error(data.error);
      }

      console.debug('[DEBUG] API Response:', data);
      return data;
    } catch (error) {
      console.error(`API Error (${func}): Failed to fetch`, error);
      throw error;
    }
  }

  async getSeatData(group, day, timeslot, isAdmin = false) {
    return await this._callApi('getSeatData', [group, day, timeslot, isAdmin]);
  }

  async reserveSeats(group, day, timeslot, selectedSeats) {
    return await this._callApi('reserveSeats', [group, day, timeslot, selectedSeats]);
  }

  async checkInSeat(group, day, timeslot, seatId) {
    return await this._callApi('checkInSeat', [group, day, timeslot, seatId]);
  }

  async assignWalkInSeat(group, day, timeslot) {
    return await this._callApi('assignWalkInSeat', [group, day, timeslot]);
  }

  async verifyModePassword(mode, password) {
    return await this._callApi('verifyModePassword', [mode, password]);
  }

  async getAllTimeslotsForGroup(group) {
    return await this._callApi('getAllTimeslotsForGroup', [group]);
  }
}
