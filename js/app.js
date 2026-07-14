let currentItems = [];
let priceMode = 'median';
let history = [...DEMO_HISTORY];
let selectedRegion = 'Москва';

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

const regionDropdown = document.getElementById('regionDropdown');
const regionTrigger = document.getElementById('regionTrigger');
const regionMenu = document.getElementById('regionMenu');
const regionSearch = document.getElementById('regionSearch');
const regionList = document.getElementById('regionList');
const regionLabel = document.getElementById('regionLabel');

regionTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    regionDropdown.classList.toggle('open');
    if (regionDropdown.classList.contains('open')) {
        regionSearch.value = '';
        filterRegions('');
        regionSearch.focus();
    }
});

document.addEventListener('click', (e) => {
    if (!regionDropdown.contains(e.target)) {
        regionDropdown.classList.remove('open');
    }
});

regionSearch.addEventListener('input', (e) => filterRegions(e.target.value));

function filterRegions(query) {
    const q = query.toLowerCase();
    regionList.querySelectorAll('.region-item').forEach(item => {
        const name = item.dataset.region.toLowerCase();
        item.classList.toggle('hidden', !name.includes(q));
    });
}

regionList.querySelectorAll('.region-item').forEach(item => {
    item.addEventListener('click', () => {
        selectedRegion = item.dataset.region;
        regionLabel.textContent = selectedRegion;
        regionList.querySelectorAll('.region-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        regionDropdown.classList.remove('open');
    });
});

function goTab(tab) {
    document.querySelectorAll('nav.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + tab).classList.add('active');
    if (tab === 'history') renderHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('nav.tabs button').forEach(b => {
    b.addEventListener('click', () => {
        if (b.dataset.tab === 'result' && !currentItems.length) {
            showToast('Сначала выполните расчёт');
            return;
        }
        goTab(b.dataset.tab);
    });
});

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const browseBtn = dropzone.querySelector('.browse-btn');
let pendingFile = null;

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropzone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT' && !e.target.closest('button')) fileInput.click();
});

dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
    pendingFile = file;
    const kb = (file.size / 1024).toFixed(0);
    document.getElementById('filePreview').innerHTML = `
        <div class="file-preview">
            <div class="ficon"><i class="fa-solid ${fileIcon(file.name)}"></i></div>
            <div>
                <div class="fname">${file.name}</div>
                <div class="fmeta">${kb} КБ · готов к обработке</div>
            </div>
            <button class="rm" id="clearFileBtn"><i class="fa-solid fa-xmark"></i></button>
            <button class="btn btn-primary" style="margin-left:8px" id="startCalcBtn"><i class="fa-solid fa-play"></i> Рассчитать</button>
        </div>`;

    document.getElementById('clearFileBtn').addEventListener('click', clearFile);
    document.getElementById('startCalcBtn').addEventListener('click', () => startProcessing(file.name));
}

function clearFile() {
    pendingFile = null;
    document.getElementById('filePreview').innerHTML = '';
    fileInput.value = '';
}

document.getElementById('demoBtn').addEventListener('click', () => startProcessing('демо-спецификация.xlsx'));

function startProcessing(fileName) {
    document.querySelectorAll('nav.tabs button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-processing').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('procFile').textContent = fileName;

    const steps = document.querySelectorAll('#procSteps .pstep');
    steps.forEach(s => {
        s.classList.remove('done', 'active');
        const icons = ['fa-file-lines', 'fa-list-check', 'fa-magnifying-glass-dollar', 'fa-calculator'];
        s.querySelector('.ic i').className = `fa-solid ${icons[parseInt(s.dataset.i)]}`;
    });

    const ring = document.getElementById('ringFill');
    const pctEl = document.getElementById('procPct');
    const C = 263.9;
    let progress = 0;
    let stepIdx = 0;

    steps[0].classList.add('active');
    steps[0].querySelector('.ic i').className = 'fa-solid fa-spinner spin';

    const iv = setInterval(() => {
        progress += Math.random() * 7 + 3;
        if (progress > 100) progress = 100;
        pctEl.textContent = Math.round(progress) + '%';
        ring.style.strokeDashoffset = C - (C * progress / 100);

        const targetStep = Math.min(3, Math.floor(progress / 25));
        while (stepIdx < targetStep) {
            steps[stepIdx].classList.remove('active');
            steps[stepIdx].classList.add('done');
            steps[stepIdx].querySelector('.ic i').className = 'fa-solid fa-check';
            stepIdx++;
            steps[stepIdx].classList.add('active');
            steps[stepIdx].querySelector('.ic i').className = 'fa-solid fa-spinner spin';
        }

        if (progress >= 100) {
            clearInterval(iv);
            steps[3].classList.remove('active');
            steps[3].classList.add('done');
            steps[3].querySelector('.ic i').className = 'fa-solid fa-check';
            setTimeout(() => finishProcessing(fileName), 600);
        }
    }, 320);
}

function finishProcessing(fileName) {
    currentItems = DEMO_ITEMS.map(x => ({ ...x }));
    renderTable();
    goTab('result');
    const region = selectedRegion;
    document.getElementById('resultSub').textContent = `Расчёт по региону «${region}» · ${currentItems.length} позиций · ${fileName}`;
    showToast('Смета готова');
}

function setMode(m) {
    priceMode = m;
    document.querySelectorAll('.price-mode button').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    renderTable();
}

document.getElementById('modeMedian').addEventListener('click', () => setMode('median'));
document.getElementById('modeMin').addEventListener('click', () => setMode('min'));
document.getElementById('tblSearch').addEventListener('input', renderTable);

function renderTable() {
    const q = (document.getElementById('tblSearch').value || '').toLowerCase();
    const body = document.getElementById('tblBody');
    body.innerHTML = '';
    let grand = 0, found = 0, manual = 0;

    currentItems.forEach((item, idx) => {
        const price = unitPrice(item, priceMode);
        const total = price * item.qty;
        grand += total;
        const isManual = item.source === 'manual' && item.manualPrice == null;
        if (isManual) manual++; else found++;

        if (q && !item.name.toLowerCase().includes(q)) return;

        const src = SRC_LABELS[item.manualPrice != null && item.source === 'manual' ? 'manual' : item.source];
        const tr = document.createElement('tr');
        if (isManual) tr.classList.add('need-price');
        tr.innerHTML = `
            <td class="num-cell">${idx + 1}</td>
            <td class="name-cell">
                ${item.name}
                ${item.code ? `<div class="code">КСР ${item.code}</div>` : ''}
                ${isManual ? `<div class="analog-note"><i class="fa-solid fa-wand-magic-sparkles"></i> Аналог: ${item.analog} <a data-idx="${idx}" class="use-analog">применить</a></div>` : ''}
            </td>
            <td>${item.unit}</td>
            <td class="qty-cell">${item.qty}</td>
            <td class="price-cell" style="text-align:right">
                <input type="number" value="${price || ''}" placeholder="—" data-idx="${idx}" class="price-input">
            </td>
            <td><span class="src-tag ${src.c}"><i class="fa-solid ${src.i}"></i> ${src.t}</span></td>
            <td class="total-cell">${total ? fmt(total) + ' ₽' : '—'}</td>`;
        body.appendChild(tr);
    });

    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('change', (e) => setPrice(parseInt(e.target.dataset.idx), e.target.value));
    });

    document.querySelectorAll('.use-analog').forEach(a => {
        a.addEventListener('click', (e) => useAnalog(parseInt(e.target.dataset.idx)));
    });

    document.getElementById('tblGrand').textContent = fmt(grand) + ' ₽';
    document.getElementById('stTotal').textContent = fmt(grand) + ' ₽';
    document.getElementById('stPos').textContent = currentItems.length;
    document.getElementById('stFound').textContent = found;
    document.getElementById('stManual').textContent = manual;
}

function setPrice(idx, val) {
    const v = parseFloat(val);
    currentItems[idx].manualPrice = isNaN(v) ? null : v;
    renderTable();
}

function useAnalog(idx) {
    currentItems[idx].manualPrice = 640;
    currentItems[idx].name = currentItems[idx].analog;
    showToast('Аналог применён');
    renderTable();
}

function exportExcel() {
    let csv = 'N;Наименование;Ед.изм.;Кол-во;Цена за ед.;Источник;Итого\n';
    currentItems.forEach((it, i) => {
        const p = unitPrice(it, priceMode);
        csv += `${i + 1};${it.name};${it.unit};${it.qty};${p};${SRC_LABELS[it.source].t};${p * it.qty}\n`;
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'smeta.csv';
    a.click();
    showToast('Смета выгружена в файл');
}

document.getElementById('exportExcelBtn').addEventListener('click', exportExcel);
document.getElementById('exportPdfBtn').addEventListener('click', () => showToast('Отчёт PDF сформирован'));
document.getElementById('newCalcBtn').addEventListener('click', () => goTab('upload'));

function renderHistory() {
    const grid = document.getElementById('histGrid');
    if (!history.length) {
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><i class="fa-solid fa-inbox"></i><div>Расчётов пока нет</div></div>`;
        return;
    }
    grid.innerHTML = history.map((h, i) => `
        <div class="hist-card" data-idx="${i}">
            <div class="htop">
                <div class="hic"><i class="fa-solid ${fileIcon(h.name)}"></i></div>
                <div>
                    <div class="hname">${h.name}</div>
                    <div class="hdate">${h.date} · ${h.region}</div>
                </div>
            </div>
            <div class="hsum">${fmt(h.sum)} ₽</div>
            <div class="hmeta">${h.pos} позиций · найдено ${h.found}</div>
        </div>`).join('');

    document.querySelectorAll('.hist-card').forEach(card => {
        card.addEventListener('click', (e) => openHistory(parseInt(card.dataset.idx)));
    });
}

function openHistory(idx) {
    if (!currentItems.length) currentItems = DEMO_ITEMS.map(x => ({ ...x }));
    renderTable();
    goTab('result');
    document.getElementById('resultSub').textContent = 'Из истории · ' + history[idx].name;
}

renderTable();
