import GasAPI from './api.js';
import { loadSidebar, toggleSidebar } from './sidebar.js';

// --- 初期化処理 (ページの読み込み時に自動で実行されます) ---
const urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get('group');

// 組名をページのタイトル部分に表示
document.getElementById('group-name').textContent = isNaN(parseInt(group)) ? group : group + '組';

// サイドバーを読み込んでページに配置
loadSidebar();

// 時間帯データを読み込んで表示
loadTimeslots(group);

// --- グローバル関数の登録 ---
// HTMLの onclick="..." から呼び出せるように、関数をwindowオブジェクトに登録します。
window.toggleSidebar = toggleSidebar;
window.selectTimeslot = selectTimeslot;

// --- 関数定義 ---
function selectTimeslot(day, timeslot) {
  const isAdmin = urlParams.get('admin') === 'true';
  let targetPage = 'seats.html';
  let additionalParams = '';
  if (isAdmin) {
    additionalParams = '&admin=true';
  }

  const url = `${targetPage}?group=${encodeURIComponent(group)}&day=${day}&timeslot=${timeslot}${additionalParams}`;
  window.location.href = url;
}

async function loadTimeslots(group) {
  const container = document.getElementById('timeslot-container');
  const timeslots = await GasAPI.getAllTimeslotsForGroup(group); // ここを修正

  if (!timeslots || timeslots.length === 0) {
    container.innerHTML = '<p class="description">この組に設定された公演時間帯がありません。</p>';
    return;
  }

  const timeslotsByDay = timeslots.reduce((acc, ts) => {
    (acc[ts.day] = acc[ts.day] || []).push(ts);
    return acc;
  }, {});

  let html = '';
  for (const day in timeslotsByDay) {
    html += `
      <div class="timeslot-section">
        <h2>${getDayName(day)}</h2>
        <div class="grid-container">
    `;
    
    for (const ts of timeslotsByDay[day]) {
      html += `<a class="grid-item" href="javascript:void(0)" onclick="selectTimeslot('${ts.day}', '${ts.timeslot}')">${ts.displayName}</a>`;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function getDayName(day) {
  return day == 1 ? '1日目' : '2日目';
}
