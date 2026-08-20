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
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
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
    if (!display) return;
    
    if (!input) {
        display.innerText = `${getBaseUrl()}${endpointPath}`;
        return;
    }

    const update = () => {
        display.innerText = `${getBaseUrl()}${endpointPath}${encodeURIComponent(input.value)}`;
    };
    input.addEventListener('input', update);
    update();
}

// Setup Display URL Existing
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

// Setup Display URL Fitur Baru (Search)
setupUrlDisplay('param-query-pinterest', 'api-url-display-pinterest', '/api/pinterest?query=');
setupUrlDisplay('param-query-lk21-search', 'api-url-display-lk21-search', '/api/lk21/search?query=');
setupUrlDisplay('param-url-lk21-detail', 'api-url-display-lk21-detail', '/api/lk21/detail?url=');
setupUrlDisplay(null, 'api-url-display-lk21-trending', '/api/lk21/trending');
setupUrlDisplay('param-url-lk21-stream', 'api-url-display-lk21-stream', '/api/lk21/stream?url=');

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
        '/docs/downloader/threads': 'view-endpoint-threads',
        // Route Baru (Search)
        '/docs/search/pinterest': 'view-endpoint-pinterest',
        '/docs/search/lk21-search': 'view-endpoint-lk21-search',
        '/docs/search/lk21-detail': 'view-endpoint-lk21-detail',
        '/docs/search/lk21-trending': 'view-endpoint-lk21-trending',
        '/docs/search/lk21-stream': 'view-endpoint-lk21-stream'
    };

    const targetId = routes[path] || 'view-home';
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', handleRoute);

// --- HELPER UNTUK EXECUTE API ---
async function fetchApi(endpoint, paramValue, outputId, timeBadgeId, procMsg) {
    const output = document.getElementById(outputId);
    const timeBadge = document.getElementById(timeBadgeId);

    timeBadge.classList.add('hidden'); 
    output.className = "text-[12px] font-mono text-yellow-400 leading-relaxed";
    output.innerText = JSON.stringify({ status: "processing", message: procMsg }, null, 4);

    const startTime = performance.now(); 
    try {
        const url = paramValue ? `${endpoint}?${paramValue}` : endpoint;
        const res = await fetch(url);
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

// --- EXECUTE FUNCTIONS ---
function executeOuoApi() { fetchApi('/api/bypass', `url=${encodeURIComponent(document.getElementById('param-url').value)}`, 'json-output-ouo', 'time-badge-ouo', 'Memproses bypass link...'); }
function executeClaudeApi() { fetchApi('/api/claude', `text=${encodeURIComponent(document.getElementById('param-text-claude').value)}`, 'json-output-claude', 'time-badge-claude', 'Memproses Claude AI...'); }
function executeGeminiApi() { fetchApi('/api/gemini', `text=${encodeURIComponent(document.getElementById('param-text-gemini').value)}`, 'json-output-gemini', 'time-badge-gemini', 'Memproses Gemini AI...'); }
function executeIgApi() { fetchApi('/api/ig', `url=${encodeURIComponent(document.getElementById('param-url-ig').value)}`, 'json-output-ig', 'time-badge-ig', 'Memproses downloader Instagram...'); }
function executeYtmp3Api() { fetchApi('/api/ytmp3', `url=${encodeURIComponent(document.getElementById('param-url-ytmp3').value)}`, 'json-output-ytmp3', 'time-badge-ytmp3', 'Memproses downloader YTMP3...'); }
function executeYtmp4Api() { fetchApi('/api/ytmp4', `url=${encodeURIComponent(document.getElementById('param-url-ytmp4').value)}`, 'json-output-ytmp4', 'time-badge-ytmp4', 'Memproses downloader YTMP4...'); }
function executeTiktokApi() { fetchApi('/api/tiktok', `url=${encodeURIComponent(document.getElementById('param-url-tiktok').value)}`, 'json-output-tiktok', 'time-badge-tiktok', 'Memproses downloader TikTok...'); }
function executeFbApi() { fetchApi('/api/fb', `url=${encodeURIComponent(document.getElementById('param-url-fb').value)}`, 'json-output-fb', 'time-badge-fb', 'Memproses downloader Facebook...'); }
function executeTwitterApi() { fetchApi('/api/twitter', `url=${encodeURIComponent(document.getElementById('param-url-twitter').value)}`, 'json-output-twitter', 'time-badge-twitter', 'Memproses downloader Twitter...'); }
function executeMediafireApi() { fetchApi('/api/mediafire', `url=${encodeURIComponent(document.getElementById('param-url-mediafire').value)}`, 'json-output-mediafire', 'time-badge-mediafire', 'Memproses downloader MediaFire...'); }
function executeSpotifyApi() { fetchApi('/api/spotify', `url=${encodeURIComponent(document.getElementById('param-url-spotify').value)}`, 'json-output-spotify', 'time-badge-spotify', 'Memproses downloader Spotify...'); }
function executeThreadsApi() { fetchApi('/api/threads', `url=${encodeURIComponent(document.getElementById('param-url-threads').value)}`, 'json-output-threads', 'time-badge-threads', 'Memproses downloader Threads...'); }

// Execute Functions Fitur Baru (Search)
function executePinterestApi() { 
    fetchApi('/api/pinterest', `query=${encodeURIComponent(document.getElementById('param-query-pinterest').value)}`, 'json-output-pinterest', 'time-badge-pinterest', 'Memproses pencarian Pinterest...'); 
}
function executeLk21SearchApi() { 
    fetchApi('/api/lk21/search', `query=${encodeURIComponent(document.getElementById('param-query-lk21-search').value)}`, 'json-output-lk21-search', 'time-badge-lk21-search', 'Memproses pencarian film LK21...'); 
}
function executeLk21DetailApi() { 
    fetchApi('/api/lk21/detail', `url=${encodeURIComponent(document.getElementById('param-url-lk21-detail').value)}`, 'json-output-lk21-detail', 'time-badge-lk21-detail', 'Memproses detail film LK21...'); 
}
function executeLk21TrendingApi() { 
    fetchApi('/api/lk21/trending', '', 'json-output-lk21-trending', 'time-badge-lk21-trending', 'Memproses film trending LK21...'); 
}
function executeLk21StreamApi() { 
    fetchApi('/api/lk21/stream', `url=${encodeURIComponent(document.getElementById('param-url-lk21-stream').value)}`, 'json-output-lk21-stream', 'time-badge-lk21-stream', 'Memproses link stream LK21...'); 
}