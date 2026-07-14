const DEMO_ITEMS = [
    { name: 'Цемент портландский М500 Д0', code: '14.4.03.05-0032', unit: 'т', qty: 10, prices: [8500, 8720, 8300], source: 'fgis' },
    { name: 'Арматура рифлёная А500С Ø12 мм', code: '23.3.05.02-0111', unit: 'т', qty: 5, prices: [72000, 71500, 73200], source: 'stroy' },
    { name: 'Кирпич керамический рядовой полнотелый М150', code: '14.2.01.02-0007', unit: 'тыс.шт', qty: 8, prices: [16800, 17200], source: 'bidzaar' },
    { name: 'Песок строительный природный', code: '14.1.01.01-0003', unit: 'м³', qty: 40, prices: [980, 1050, 920], source: 'fgis' },
    { name: 'Щебень гранитный фр. 20–40 мм', code: '14.1.02.05-0021', unit: 'м³', qty: 35, prices: [2100, 2250, 1980], source: 'stroy' },
    { name: 'Профнастил кровельный С21 оцинкованный', code: '', unit: 'м²', qty: 120, prices: [], source: 'manual', analog: 'Профлист НС35 оцинк. 0.5 мм' },
];

const SRC_LABELS = {
    fgis: { t: 'ФГИС ЦС', c: 'fgis', i: 'fa-building-columns' },
    stroy: { t: 'Стройинформ', c: 'stroy', i: 'fa-chart-line' },
    bidzaar: { t: 'Bidzaar', c: 'bidzaar', i: 'fa-store' },
    manual: { t: 'Ручной ввод', c: 'manual', i: 'fa-pen' },
};

const DEMO_HISTORY = [
    { name: 'Спецификация ЖК Северный.xlsx', date: '12 июня, 14:20', sum: 4820500, pos: 47, region: 'Москва', found: 44 },
    { name: 'Смета фундамент.pdf', date: '10 июня, 09:05', sum: 1245000, pos: 12, region: 'Казань', found: 12 },
    { name: 'Фото спецификации.jpg', date: '7 июня, 18:44', sum: 356800, pos: 8, region: 'Екатеринбург', found: 6 },
];
