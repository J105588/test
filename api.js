// api.js
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
