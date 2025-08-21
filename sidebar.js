// sidebar.js

import GasAPI from './api.js';

const sidebarHTML = `
  <div id="mySidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" onclick="toggleSidebar()">&times;</a>
    <a href="index.html">組選択</a>
    <div class="mode-section">
      <div class="mode-title">動作モード</div>
      <div class="current-mode">現在: <span id="current-mode-display">通常モード</span></div>
      <button class="change-mode-btn" onclick="showModeChangeModal()">モード変更</button>
    </div>
  </div>
  <div id="mode-change-modal" class="modal" style="display: none;">
    <div class="modal-content">
      <h3>モード変更</h3>
      <div class="mode-options">
        <label class="mode-option">
          <input type="radio" name="mode" value="normal" checked> 
          <span>通常モード</span>
        </label>
        <label class="mode-option">
          <input type="radio" name="mode" value="admin"> 
          <span>管理者モード</span>
        </label>
        <label class="mode-option">
          <input type="radio" name="mode" value="walkin"> 
          <span>当日券モード</span>
        </label>
      </div>
      <div class="password-section">
        <input type="password" id="mode-password" placeholder="パスワード">
      </div>
      <div class="modal-buttons">
        <button class="btn-primary" onclick="applyModeChange()">変更</button>
        <button class="btn-secondary" onclick="closeModeModal()">キャンセル</button>
      </div>
    </div>
  </div>
`;

export function loadSidebar() {
  const container = document.getElementById('sidebar-container');
  if (container) {
    container.innerHTML = sidebarHTML;
    updateModeDisplay(); // 必要な関数を呼び出す
  }
}

export function showModeChangeModal() {
  document.getElementById("mode-change-modal").style.display = 'block';
}

export function closeModeModal() {
  document.getElementById("mode-change-modal").style.display = 'none';
}

// モード変更を適用する関数
export async function applyModeChange() {
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const password = document.getElementById("mode-password").value;
  let selectedMode;

  modeRadios.forEach(radio => {
    if (radio.checked) {
      selectedMode = radio.value;
    }
  });

  try {
    const result = await GasAPI.verifyModePassword(selectedMode, password);
    
    if (result.success) {
      localStorage.setItem('currentMode', selectedMode); // 現在のモードを保存
      updateModeDisplay(); // 表示を更新
      alert(`${selectedMode} モードに切り替えました`);
      closeModeModal(); // モーダルを閉じる
    } else {
      alert('パスワードが間違っています。');      
    }
  } catch (error) {
    alert(`エラーが発生しました: ${error.message}`);
  }
}

// モード表示を更新する関数
export function updateModeDisplay() {
  const modeDisplay = document.getElementById("current-mode-display");
  if (modeDisplay) {
    const currentMode = localStorage.getItem('currentMode') || '通常モード';
    modeDisplay.textContent = currentMode;
  }
}

export function toggleSidebar() {
  const sidebar = document.getElementById("mySidebar");
  const main = document.getElementById("main-content");

  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
    main.style.marginLeft = "0";
  } else {
    sidebar.style.width = "250px";
    main.style.marginLeft = "250px";
  }
}
