// API Configuration
// constant.js

export const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: 'bf5d00c5c6b9099da2d56124dc609c9a',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
};

// Genre mapping
export const genreMap = {
    28: 'Hành động',
    12: 'Phiêu lưu',
    16: 'Hoạt hình',
    35: 'Hài',
    80: 'Tội phạm',
    99: 'Tài liệu',
    18: 'Chính kịch',
    10751: 'Gia đình',
    14: 'Giả tưởng',
    36: 'Lịch sử',
    27: 'Kinh dị',
    10402: 'Nhạc',
    9648: 'Bí ẩn',
    10749: 'Lãng mạn',
    878: 'Khoa học viễn tưởng',
    10770: 'Phim truyền hình',
    53: 'Gây cấn',
    10752: 'Chiến tranh',
    37: 'Miền Tây'
};

// Topics data
export const topicsData = [
    { id: 1, name: 'Marvel', keywords: 'Marvel' },
    { id: 2, name: 'Cổ trang', keywords: 'historical period costume' },
    { id: 3, name: 'Xuyên không', keywords: 'time travel' },
    { id: 4, name: 'Zombie', keywords: 'zombie' },
    { id: 5, name: 'Siêu anh hùng', keywords: 'superhero' },
    { id: 6, name: 'Anime', keywords: 'anime animation' },
    { id: 7, name: 'Kungfu', keywords: 'kung fu martial arts' },
    { id: 8, name: 'Ma thuật', keywords: 'magic wizard' }
];

// Countries data
export const countriesData = [
    { code: 'US', name: 'Mỹ' },
    { code: 'KR', name: 'Hàn Quốc' },
    { code: 'CN', name: 'Trung Quốc' },
    { code: 'JP', name: 'Nhật Bản' },
    { code: 'TH', name: 'Thái Lan' },
    { code: 'IN', name: 'Ấn Độ' },
    { code: 'GB', name: 'Anh' },
    { code: 'FR', name: 'Pháp' },
    { code: 'VN', name: 'Việt Nam' }
];

// View types
export const VIEW_TYPES = {
    HOME: 'home',
    ACTOR_DETAIL: 'actor_detail',
    TOPIC: 'topic',
    GENRE: 'genre',
    COUNTRY: 'country',
    MOVIES: 'movies',
    SERIES: 'series',
    ACTORS: 'actors',
    SCHEDULE: 'schedule',
    DETAIL: 'detail'
};