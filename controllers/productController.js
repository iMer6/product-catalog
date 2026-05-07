exports.getAllProducts = (req, res) => {
    res.json({ products: [
        { id: 1, name: 'Електрочайник', price: 1200, category: 'Техніка', icon: 'bi-lightning-charge' },
        { id: 2, name: 'Навушники', price: 2500, category: 'Аудіо', icon: 'bi-headphones' },
        { id: 3, name: 'Смарт-годинник', price: 4000, category: 'Гаджети', icon: 'bi-watch' },
        { id: 4, name: 'Кавомашина', price: 8500, category: 'Техніка', icon: 'bi-cup-hot' },
        { id: 5, name: 'Монітор 27"', price: 11000, category: 'Комп’ютери', icon: 'bi-display' },
        { id: 6, name: 'Клавіатура механічна', price: 3200, category: 'Аксесуари', icon: 'bi-keyboard' },
        { id: 7, name: 'Робот-пилосос', price: 15000, category: 'Техніка', icon: 'bi-robot' },
        { id: 8, name: 'Ігрова миша', price: 1800, category: 'Аксесуари', icon: 'bi-mouse3' },
        { id: 9, name: 'Портативна колонка', price: 4500, category: 'Аудіо', icon: 'bi-speaker' },
        { id: 10, name: 'Ноутбук Pro 14', price: 52000, category: 'Комп’ютери', icon: 'bi-laptop' },
        { id: 11, name: 'Планшет', price: 18500, category: 'Гаджети', icon: 'bi-tablet' },
        { id: 12, name: 'Мікрохвильова піч', price: 4200, category: 'Техніка', icon: 'bi-oven' },
        { id: 13, name: 'Зовнішній HDD 2TB', price: 2900, category: 'Комп’ютери', icon: 'bi-hdd-network' },
        { id: 14, name: 'Фітнес-браслет', price: 1500, category: 'Гаджети', icon: 'bi-activity' },
        { id: 15, name: 'Веб-камера 4K', price: 3800, category: 'Аксесуари', icon: 'bi-camera-video' }
    ]});
};