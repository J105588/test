// seats-main.js
import GasAPI from './api.js';
import { loadSidebar, toggleSidebar } from './sidebar.js';
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
let isRefreshing = false;
let settingsOpen = false;

// APIエンドポイントを設定
const apiEndpoint = GAS_API_URL;
const api = new GasAPI(apiEndpoint);

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
        startAutoRefresh();
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
    } else {
        console.warn('Loader element not found');
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

    const subSection = document.createElement('div');
    subSection.className = 'seat-section';

    layout.sub.rows.forEach(rowLabel => {
        const rowEl = document.createElement('div');
        rowEl.className = 'seat-row';

        for (let i = 1; i <= layout.sub.frontCols; i++) {
            const seatId = rowLabel + i;
            const seatData = seatMap[seatId] || { id: seatId, status: 'unavailable', name: null };
            rowEl.appendChild(createSeatElement(seatData));
        }

        const passage = document.createElement('div');
        passage.className = 'passage';
        rowEl.appendChild(passage);

        for (let i = 1; i <= layout.sub.backCols; i++) {
            const seatId = rowLabel + (layout.sub.frontCols + i);
            const seatData = seatMap[seatId] || { id: seatId, status: 'unavailable', name: null };
            rowEl.appendChild(createSeatElement(seatData));
        }

        subSection.appendChild(rowEl);
    });
    container.appendChild(subSection);
}

function createSeatElement(seat) {
    const el = document.createElement('div');
    el.className = `seat ${seat.status}`;
    el.dataset.id = seat.id;
    el.innerHTML = `<span class="seat-id">${seat.id}</span>`;

    if (IS_ADMIN && seat.name) {
        el.innerHTML += `<span class="seat-name">${seat.name}</span>`;
    }

    if (seat.status === 'available') {
        el.onclick = () => {
            toggleSeatSelection(seat.id);
        };
    }

    if ((seat.status === 'to-be-checked-in' || seat.status === 'reserved') && IS_ADMIN) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'check-in-checkbox';
        checkbox.dataset.seatId = seat.id;
        el.appendChild(checkbox);
    }

    return el;
}

function toggleSeatSelection(seatId) {
    const el = document.querySelector(`.seat[data-id='${seatId}']`);
    if (!el) return;

    const index = selectedSeats.indexOf(seatId);
    if (index > -1) {
        selectedSeats.splice(index, 1);
        el.classList.remove('selected');
    } else {
        selectedSeats.push(seatId);
        el.classList.add('selected');
    }
}

async function checkIn(seatIds) {
    if (!seatIds || seatIds.length === 0) {
        alert('座席を1つ以上選択してください。');
        return;
    }

    let seatInfo = seatIds.map(seatId => {
        const seatElement = document.querySelector(`.seat[data-id='${seatId}']`);
        const nameElement = seatElement ? seatElement.querySelector('.seat-name') : null;
        const reservedName = nameElement ? nameElement.textContent : '';
        return `${seatId}: ${reservedName}`;
    });

    const confirmMessage = `チェックインしますか？\n${seatInfo.join('\n')}`;

    if (!confirm(confirmMessage)) return;

    showLoader(true);

    try {
        const res = await api.checkInSeat(GROUP, DAY, TIMESLOT, seatIds);

        showLoader(false);

        let alertMessage = res.success
            ? `選択した座席のチェックインが完了しました。`
            : res.message;
        alert(alertMessage);

        if (res.success) {
            const seatData = await api.getSeatData(GROUP, DAY, TIMESLOT, IS_ADMIN);
            drawSeatMap(seatData.seatMap);
        }
    } catch (err) {
        showLoader(false);
        alert(`エラー: ${err.message}`);
    }
}

window.checkInSelected = () => {
    const checkboxes = document.querySelectorAll('.check-in-checkbox:checked');
    const seatIds = Array.from(checkboxes).map(checkbox => checkbox.dataset.seatId);
    checkIn(seatIds);
};

window.toggleSettings = () => {
    settingsOpen = !settingsOpen;
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');

    if (settingsOpen) {
        settingsPanel.classList.add('show');
        overlay.classList.add('show');
    } else {
        closeSettings();
    }
};

window.closeSettings = () => {
    settingsOpen = false;
    const settingsPanel = document.getElementById('settings-panel');
    const overlay = document.getElementById('overlay');

    settingsPanel.classList.remove('show');
    overlay.classList.remove('show');
};

function startAutoRefresh() {
    stopAutoRefresh();

    if (!isAutoRefreshEnabled) return;

    autoRefreshInterval = setInterval(async () => {
        if (!document.hidden && !isRefreshing) {
            try {
                isRefreshing = true;
                const seatData = await api.getSeatData(GROUP, DAY, TIMESLOT, IS_ADMIN);
                drawSeatMap(seatData.seatMap);
                updateLastUpdateTime();
            } catch (error) {
                console.error("Auto-refresh failed:", error);
            } finally {
                isRefreshing = false;
            }
        }
    }, 30000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

window.toggleAutoRefresh = () => {
    const toggle = document.getElementById('auto-refresh-toggle');
    isAutoRefreshEnabled = toggle.checked;

    if (isAutoRefreshEnabled) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
};

window.manualRefresh = async () => {
    await updateSeatData(true);
    closeSettings();
};

async function updateSeatData(showLoaderFlag = false) {
    if (isRefreshing) return;
    isRefreshing = true;

    if (showLoaderFlag) showLoader(true);
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.disabled = true;
    refreshBtn.textContent = '更新中...';

    try {
        const seatData = await api.getSeatData(GROUP, DAY, TIMESLOT, IS_ADMIN);

        if (showLoaderFlag) showLoader(false);
        refreshBtn.disabled = false;
        refreshBtn.textContent = '手動更新';
        isRefreshing = false;

        if (seatData.success === false) {
            console.error('座席データ取得エラー:', seatData.error);
            return;
        }

        drawSeatMap(seatData.seatMap);
        updateLastUpdateTime();
    } catch (err) {
        if (showLoaderFlag) showLoader(false);
        refreshBtn.disabled = false;
        refreshBtn.textContent = '手動更新';
        isRefreshing = false;
        console.error('座席データ更新失敗:', err.message);
    }
}
