import GasAPI from './api.js';
import { loadSidebar, toggleSidebar } from './sidebar.js';

/**
 * 座席選択画面のメイン処理
 */
const urlParams = new URLSearchParams(window.location.search);
const GROUP = urlParams.get('group');
const DAY = urlParams.get('day');
const TIMESLOT = urlParams.get('timeslot');
const IS_ADMIN = urlParams.get('admin') === 'true';

let selectedSeats = [];
let isAutoRefreshEnabled = true;
let autoRefreshInterval = null;
let lastUpdateTime = null;
let isRefreshing = false;
let settingsOpen = false;

// 初期化
window.onload = async () => {
    loadSidebar();

    const groupName = isNaN(parseInt(GROUP)) ? GROUP : GROUP + '組';
    document.getElementById('performance-info').textContent = `${groupName} ${DAY}日目 ${TIMESLOT}`;

    // 管理者モードの表示制御
    if (IS_ADMIN) {
        document.getElementById('admin-indicator').style.display = 'block';
        document.getElementById('admin-login-btn').style.display = 'none';
        document.getElementById('submit-button').style.display = 'none';
        document.getElementById('check-in-selected-btn').style.display = 'block';
    } else {
        document.getElementById('admin-indicator').style.display = 'none';
        document.getElementById('admin-login-btn').style.display = 'block';
        document.getElementById('submit-button').style.display = 'block';
        document.getElementById('check-in-selected-btn').style.display = 'none';
    }

    showLoader(true); // ロードインジケーターを表示

    try {
        const seatData = await GasAPI.getSeatData(GROUP, DAY, TIMESLOT, IS_ADMIN);

        console.log("Received seatData:", seatData);
        
        if (seatData.success === false) {
            alert('データ読み込み失敗: ' + seatData.error);
            return;
        }

        drawSeatMap(seatData.seatMap); // 座席マップを描画
        updateLastUpdateTime(); // 最終更新時間を更新
        startAutoRefresh(); // 自動更新を開始
    } catch (error) {
        alert('サーバー通信失敗: ' + error.message);
    } finally {
        showLoader(false); // ロードインジケーターを非表示に
    }
};

// 最終アップデート時間を取得
function updateLastUpdateTime() {
    lastUpdateTime = new Date();
    const lastUpdateEl = document.getElementById('last-update');
    lastUpdateEl.textContent = `最終更新: ${lastUpdateTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
}

// ローダー表示制御
function showLoader(visible) {
    const loader = document.getElementById('loading-modal');
    if (loader) {
        loader.style.display = visible ? 'block' : 'none'; // ローダーを表示または非表示
    } else {
        console.warn('Loader element not found');
    }
}

// 座席マップを描画する関数
function drawSeatMap(seatMap) {
    const container = document.getElementById('seat-map-container');
    container.innerHTML = ''; // 既存の内容をクリア

    seatMap.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';

        row.forEach(seat => {
            const seatDiv = document.createElement('div');
            seatDiv.className = 'seat';
            seatDiv.dataset.seatId = seat.id;
            seatDiv.textContent = seat.number;

            // 状態に応じた色の設定
            if (seat.status === 'available') {
                seatDiv.classList.add('available');
                seatDiv.addEventListener('click', () => toggleSeatSelection(seat.id));
            } else if (seat.status === 'reserved') {
                seatDiv.classList.add('reserved');
            } else if (seat.status === 'checked-in') {
                seatDiv.classList.add('checked-in');
            }

            rowDiv.appendChild(seatDiv);
        });

        container.appendChild(rowDiv);
    });
}

// 座席の選定を切り替える関数
function toggleSeatSelection(seatId) {
    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else {
        selectedSeats.push(seatId);
    }
    updateSelectedSeatsDisplay();
}

// 選択した座席の表示を更新する関数
function updateSelectedSeatsDisplay() {
    const display = document.getElementById('selected-seats');
    display.textContent = `選択中の座席: ${selectedSeats.join(', ')}`;
}

// 残りのコード...
