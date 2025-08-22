// timeslot-main.js
import { DEBUG_MODE, debugLog } from './config.js'; // config.jsからインポート
import GasAPI from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const group = urlParams.get('group');

  if (!group) {
    alert('グループが指定されていません。');
    return;
  }

  document.getElementById('group-name').textContent = group; // グループ名を表示

  await loadTimeslots(group);

  // テストAPIの呼び出し
  try {
    const testResult = await GasAPI.testApi();
    debugLog('Test API Result:', testResult);
  } catch (error) {
    console.error('Test API Error:', error);
  }
});

async function loadTimeslots(group) {
  const timeslotContainer = document.getElementById('timeslot-container');
  timeslotContainer.innerHTML = '<div class="loading">時間帯データを読み込み中...</div>';

  try {
    const timeslots = await GasAPI.getAllTimeslotsForGroup(group);

    if (!timeslots || timeslots.length === 0) {
      timeslotContainer.innerHTML = '<p>時間帯データが見つかりませんでした。</p>';
      return;
    }

    timeslotContainer.innerHTML = ''; // Clear loading message

    timeslots.forEach(timeslot => {
      const timeslotElement = document.createElement('a');
      timeslotElement.href = `seats.html?group=${encodeURIComponent(group)}&day=${encodeURIComponent(timeslot.day)}&timeslot=${encodeURIComponent(timeslot.timeslot)}`;
      timeslotElement.classList.add('timeslot-item');
      timeslotElement.textContent = `${timeslot.day} - ${timeslot.timeslot}`;
      timeslotContainer.appendChild(timeslotElement);
    });

  } catch (error) {
    console.error('時間帯データの読み込みエラー:', error);
    timeslotContainer.innerHTML = '<p>時間帯データの読み込みに失敗しました。</p>';
  }
}
