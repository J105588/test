import GasAPI from './api.js';
import { loadSidebar } from './sidebar.js';
import { GAS_API_URL, DEBUG_MODE, debugLog } from './config.js';

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

// APIエンドポイントを設定
const api = new GasAPI();

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

    showLoader(true);

    try {
        const seatData = await api.getSeatData(GROUP, DAY, TIMESLOT, IS_ADMIN);
        
        debugLog("Received seatData:", seatData);
        
        if (seatData.success === false) {
            alert('データ読み込み失敗: ' + seatData.error);
            return;
        }

        drawSeatMap(seatData.seatMap);
        updateLastUpdateTime();
    } catch (error) {
        alert('サーバー通信失敗: ' + error.message);
    } finally {
        showLoader(false);
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
        loader.style.display = visible ? 'block' : 'none';
    }
}

// 座席マップを描画する関数
function drawSeatMap(seatMap) {
    const container = document.getElementById('seat-map-container');
    container.innerHTML = '';

    const layout = {
        main: { rows: ['A', 'B', 'C', 'D'], cols: 12, passageAfter: 6 },
        sub: { rows: ['E'], frontCols: 3, backCols: 3, passagePosition: 3 }
    };

    const mainSection = document.createElement('div');
    mainSection.className = 'seat-section';

    layout.main.rows.forEach(rowLabel => {
        const rowEl = document.createElement('div');
        rowEl.className = 'seat-row';
        for (let i = 1; i <= layout.main.cols; i++) {
            const seatId = rowLabel + i;
            const seatData = seatMap[seatId] || { id: seatId, status: 'unavailable', name: null };
            rowEl.appendChild(createSeatElement(seatData));

            if (i === layout.main.passageAfter) {
                const passage = document.createElement('div');
                passage.className = 'passage';
                rowEl.appendChild(passage);
            }
        }
        mainSection.appendChild(rowEl);
    });

    container.appendChild(mainSection);
    // Subsection drawing logic can be added similarly...
}

// 座席要素を作成する関数
function createSeatElement(seatData) {
    const seatElement = document.createElement('div');
    seatElement.className = `seat ${seatData.status}`;
    seatElement.textContent = seatData.id;

    // クリックイベントを追加
    seatElement.onclick = function () {
        selectSeat(seatData);
    };

    return seatElement;
}

// 座席を選択する関数
function selectSeat(seatData) {
    if (seatData.status === 'available') {
        selectedSeats.push(seatData.id);
        seatData.status = 'selected';
    }
}

// グローバル関数として設定
window.showLoader = showLoader;
