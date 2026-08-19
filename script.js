// --- SCRIPT JAM DIGITAL ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('clock-time').innerText = timeString + " WIB";
}
setInterval(updateClock, 1000);
updateClock();

// --- SCRIPT TOGGLE DROPDOWN MENU ---
function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('dropdown-menu');
    const btn = document.getElementById('menu-btn');
    if (!menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.add('hidden');
    }
});

// --- ACCORDION TOGGLE ---
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(90deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// --- COPY JSON RESPONSE ---
function copyResponse(elementId, btnId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    btn.innerHTML = `<i class="fa-solid fa-check text-xs text-emerald-400"></i> <span class="text-emerald-400">Copied!</span>`;
    setTimeout(() => {
        btn.innerHTML = `<i class="fa-regular fa-copy text-xs"></i> <span>Copy</span>`;
    }, 2000);
}

// --- COPY API URL ---
function copyApiUrl(elementId, btnId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById(btnId);
    const originalIcon = `<i class="fa-regular fa-copy text-[12px]"></i>`;
    btn.innerHTML = `<i class="fa-solid fa-check text-[12px] text-emerald-400"></i>`;
    setTimeout(() => {
        btn.innerHTML = originalIcon;
    }, 2000);
}

// --- DYNAMIC API URL DISPLAY ---
const getBaseUrl = () => 'https://api.naufal.fun';

function setupUrlDisplay(inputId, displayId, endpointPath) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (!input || !display) return;
    const update = () => {
        display.innerText = `${getBaseUrl()}${endpointPath}${encodeURIComponent(input.value)}`;
    };
    input.addEventListener('input', update);
    update();
}

setupUrlDisplay('param-url', 'api-url-display', '/api/bypass?url=');
setupUrlDisplay('param-text-claude', 'api-url-display-claude', '/api/claude?text=');
setupUrlDisplay('param-text-gemini', 'api-url-display-gemini', '/api/gemini?text=');
setupUrlDisplay('param-url-ig', 'api-url-display-ig', '/api/ig?url=');
setupUrlDisplay('param-url-ytmp3', 'api-url-display-ytmp3', '/api/ytmp3?url=');
setupUrlDisplay('param-url-ytmp4', 'api-url-display-ytmp4', '/api/ytmp4?url=');
setupUrlDisplay('param-url-tiktok', 'api-url-display-tiktok', '/api/tiktok?url=');
setupUrlDisplay('param-url-fb', 'api-url-display-fb', '/api/fb?url=');
setupUrlDisplay('param-url-twitter', 'api-url-display-twitter', '/api/twitter?url=');
setupUrlDisplay('param-url-mediafire', 'api-url-display-mediafire', '/api/mediafire?url=');
setupUrlDisplay('param-url-spotify', 'api-url-display-spotify', '/api/spotify?url=');
setupUrlDisplay('param-url-threads', 'api-url-display-threads', '/api/threads?url=');

// --- ROUTING ---
function navigate(path, event) { 
    if (event) event.preventDefault(); 
    window.history.pushState({}, '', path); 
    handleRoute(); 
}
window.addEventListener('popstate', handleRoute);

function handleRoute() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.view-page').forEach(el => el.classList.add('hidden'));

    const routes = {
        '/': 'view-home',
        '/docs': 'view-docs',
        '/webdev': 'view-webdev',
        '/contact': 'view-contact',
        '/docs/bypass/ouo': 'view-endpoint-ouo',
        '/docs/ai/claude': 'view-endpoint-claude',
        '/docs/ai/gemini': 'view-endpoint-gemini',
        '/docs/downloader/ig': 'view-endpoint-ig',
        '/docs/downloader/ytmp3': 'view-endpoint-ytmp3',
        '/docs/downloader/ytmp4': 'view-endpoint-ytmp4',
        '/docs/downloader/tiktok': 'view-endpoint-tiktok',
        '/docs/downloader/fb': 'view-endpoint-fb',
        '/docs/downloader/twitter': 'view-endpoint-twitter',
        '/docs/downloader/mediafire': 'view-endpoint-mediafire',
        '/docs/downloader/spotify': 'view-endpoint-spotify',
        '/docs/downloader/threads': 'view-endpoint-threads'
    };

    const targetId = routes[path] || 'view-home';
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.remove('hidden');
}

// --- HELPER UNTUK EXECUTE API ---
async function fetchApi(endpoint, paramValue, outputId, timeBadgeId, procMsg) {
    const output = document.getElementById(outputId);
    const timeBadge = document.getElementById(timeBadgeId);

    timeBadge.classList.add('hidden'); 
    output.className = "text-[12px] font-mono text-yellow-400 leading-relaxed";
    output.innerText = JSON.stringify({ status: "processing", message: procMsg }, null, 4);

    const startTime = performance.now(); 
    try {
        const res = await fetch(`${endpoint}?${paramValue}`);
        const data = await res.json();
        const endTime = performance.now(); 

        timeBadge.innerText = `${(endTime - startTime).toFixed(0)}ms`;
        timeBadge.classList.remove('hidden');

        if (data.status === false || res.status !== 200) {
            output.className = "text-[12px] font-mono text-red-400 leading-relaxed";
        } else {
            output.className = "text-[12px] font-mono text-emerald-400 leading-relaxed";
        }
        output.innerText = JSON.stringify(data, null, 4);
    } catch (e) { 
        output.className = "text-[12px] font-mono text-red-400 leading-relaxed";
        output.innerText = JSON.stringify({ status: false, message: "Server error" }, null, 4);
    }
}

function executeOuoApi() { fetchApi('/api/bypass', `url=${encodeURIComponent(document.getElementById('param-url').value)}`, 'json-output-ouo', 'time-badge-ouo', 'Fetching data...'); }
function executeClaudeApi() { fetchApi('/api/claude', `text=${encodeURIComponent(document.getElementById('param-text-claude').value)}`, 'json-output-claude', 'time-badge-claude', 'AI is thinking...'); }
function executeGeminiApi() { fetchApi('/api/gemini', `text=${encodeURIComponent(document.getElementById('param-text-gemini').value)}`, 'json-output-gemini', 'time-badge-gemini', 'Gemini is thinking...'); }
function executeIgApi() { fetchApi('/api/ig', `url=${encodeURIComponent(document.getElementById('param-url-ig').value)}`, 'json-output-ig', 'time-badge-ig', 'Fetching Instagram media...'); }
function executeYtmp3Api() { fetchApi('/api/ytmp3', `url=${encodeURIComponent(document.getElementById('param-url-ytmp3').value)}`, 'json-output-ytmp3', 'time-badge-ytmp3', 'Extracting MP3 audio...'); }
function executeYtmp4Api() { fetchApi('/api/ytmp4', `url=${encodeURIComponent(document.getElementById('param-url-ytmp4').value)}`, 'json-output-ytmp4', 'time-badge-ytmp4', 'Fetching YouTube video...'); }
function executeTiktokApi() { fetchApi('/api/tiktok', `url=${encodeURIComponent(document.getElementById('param-url-tiktok').value)}`, 'json-output-tiktok', 'time-badge-tiktok', 'Fetching TikTok media...'); }
function executeFbApi() { fetchApi('/api/fb', `url=${encodeURIComponent(document.getElementById('param-url-fb').value)}`, 'json-output-fb', 'time-badge-fb', 'Fetching Facebook media...'); }
function executeTwitterApi() { fetchApi('/api/twitter', `url=${encodeURIComponent(document.getElementById('param-url-twitter').value)}`, 'json-output-twitter', 'time-badge-twitter', 'Fetching Twitter media...'); }
function executeMediafireApi() { fetchApi('/api/mediafire', `url=${encodeURIComponent(document.getElementById('param-url-mediafire').value)}`, 'json-output-mediafire', 'time-badge-mediafire', 'Parsing MediaFire file...'); }
function executeSpotifyApi() { fetchApi('/api/spotify', `url=${encodeURIComponent(document.getElementById('param-url-spotify').value)}`, 'json-output-spotify', 'time-badge-spotify', 'Fetching Spotify audio...'); }
function executeThreadsApi() { fetchApi('/api/threads', `url=${encodeURIComponent(document.getElementById('param-url-threads').value)}`, 'json-output-threads', 'time-badge-threads', 'Fetching Threads media...'); }

handleRoute();