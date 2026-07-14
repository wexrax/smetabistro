function fmt(n) {
    return Math.round(n).toLocaleString('ru-RU');
}

function median(arr) {
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function unitPrice(item, priceMode) {
    if (item.manualPrice != null) return item.manualPrice;
    if (!item.prices.length) return 0;
    return priceMode === 'min' ? Math.min(...item.prices) : median(item.prices);
}

function fileIcon(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls'].includes(ext)) return 'fa-file-excel';
    if (ext === 'pdf') return 'fa-file-pdf';
    return 'fa-file-image';
}

let toastTimer;
function showToast(msg) {
    document.getElementById('toastMsg').textContent = msg;
    const t = document.getElementById('toast');
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
