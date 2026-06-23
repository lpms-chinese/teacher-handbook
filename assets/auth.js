(function () {
  const AUTH_KEY = 'teacherHandbookAccess';
  const PASSWORD_HASH = '8136df21b9a97c7b83a6ea49b18433c26d2340e958dda117b6fc07bce146103c';

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    sessionStorage.setItem(AUTH_KEY, 'granted');
    const lock = document.querySelector('.auth-lock');
    if (lock) lock.remove();
  }

  function showLock() {
    if (sessionStorage.getItem(AUTH_KEY) === 'granted') return;
    const lock = document.createElement('div');
    lock.className = 'auth-lock';
    lock.innerHTML = `
      <form class="auth-box" autocomplete="off">
        <h2>閱覽《同儕共學錄》</h2>
        <p>請輸入密碼後瀏覽本校中文科觀課及評課紀要。</p>
        <p>本手冊只供校內中文科專業發展使用，請勿外傳。所有資料已經過脫敏處理。</p>
        <label for="handbook-password">密碼</label>
        <input id="handbook-password" type="password" required autofocus>
        <button type="submit">進入</button>
        <p class="auth-error" aria-live="polite"></p>
      </form>
    `;
    document.body.appendChild(lock);
    const form = lock.querySelector('form');
    const input = lock.querySelector('input');
    const error = lock.querySelector('.auth-error');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const hash = await sha256(input.value);
      if (hash === PASSWORD_HASH) {
        unlock();
      } else {
        error.textContent = '密碼不正確，請再試一次。';
        input.value = '';
        input.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showLock);
  } else {
    showLock();
  }
})();
