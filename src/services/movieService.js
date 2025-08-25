// movieService.js

import { apiConfig, countriesData } from '../utils/constants';

// Fetch popular movies for hero section
export const fetchHeroMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}movie/popular?api_key=${apiConfig.apiKey}&language=vi-VN&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 6);
    } catch (error) {
        console.error('Error fetching hero movies:', error);
        throw error;
    }
};

// Fetch top rated Korea movies
export const fetchTopRatedKoreaMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=KR&sort_by=vote_average.desc&vote_count.gte=100&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching top rated Korea movies:', error);
        throw error;
    }
};

// Fetch top rated Chinese movies
export const fetchTopRatedChineseMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=CN&sort_by=vote_average.desc&vote_count.gte=100&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching top rated Chinese movies:', error);
        throw error;
    }
};

// Search movies with debounce support
export const searchMovies = async (query) => {
    if (!query.trim()) {
        return [];
    }

    try {
        const response = await fetch(
            `${apiConfig.baseUrl}search/multi?api_key=${apiConfig.apiKey}&language=vi-VN&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        // Filter to show only movies and TV shows, limit to 8 results
        return data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 8);
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

// Fetch movie details
export const fetchMovieDetails = async (movieId, mediaType = 'movie') => {
    try {
        // Fetch movie/TV details
        const detailsResponse = await fetch(
            `${apiConfig.baseUrl}${mediaType}/${movieId}?api_key=${apiConfig.apiKey}&language=vi-VN`
        );
        const details = await detailsResponse.json();

        // Fetch credits (cast and crew)
        const creditsResponse = await fetch(
            `${apiConfig.baseUrl}${mediaType}/${movieId}/credits?api_key=${apiConfig.apiKey}`
        );
        const credits = await creditsResponse.json();

        // Fetch recommendations
        const recommendationsResponse = await fetch(
            `${apiConfig.baseUrl}${mediaType}/${movieId}/recommendations?api_key=${apiConfig.apiKey}&language=vi-VN&page=1`
        );
        const recommendations = await recommendationsResponse.json();

        return {
            details,
            credits,
            recommendations: recommendations.results.slice(0, 5)
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

// Helper function to map filter values to API parameters
const mapFilterToApiParams = (filters, currentFilter) => {
    const params = new URLSearchParams();

    // Base parameters
    params.append('api_key', apiConfig.apiKey);
    params.append('language', 'vi-VN');

    // Media type based on current filter
    const mediaType = currentFilter?.type === 'series' ? 'tv' : 'movie';

    // Country filter
    if (filters.country && filters.country !== 'Tất cả') {
        const countryCode = getCountryCode(filters.country);
        if (countryCode) {
            params.append('with_origin_country', countryCode);
        }
    }

    // Genre filter
    if (filters.genre && filters.genre !== 'Tất cả') {
        const genreId = getGenreId(filters.genre);
        if (genreId) {
            params.append('with_genres', genreId);
        }
    }

    // Year filter
    const year = filters.yearSearch.trim() || (filters.year !== 'Tất cả' ? filters.year : null);
    if (year && year !== 'Tất cả') {
        if (mediaType === 'tv') {
            params.append('first_air_date_year', year);
        } else {
            params.append('year', year);
        }
    }

    // Sort by
    let sortBy = 'popularity.desc'; // default
    switch (filters.sortBy) {
        case 'Mới nhất':
            sortBy = mediaType === 'tv' ? 'first_air_date.desc' : 'release_date.desc';
            break;
        case 'Điểm IMDb':
            sortBy = 'vote_average.desc';
            params.append('vote_count.gte', '100'); // Ensure movies have enough votes
            break;
        case 'Lượt xem':
            sortBy = 'popularity.desc';
            break;
    }
    params.append('sort_by', sortBy);

    return { params, mediaType };
};

// Helper function to get country code from name
const getCountryCode = (countryName) => {
    const countryMap = {
        'Mỹ': 'US',
        'Hàn Quốc': 'KR',
        'Trung Quốc': 'CN',
        'Nhật Bản': 'JP',
        'Thái Lan': 'TH',
        'Anh': 'GB',
        'Pháp': 'FR',
        'Canada': 'CA',
        'Úc': 'AU',
        'Đài Loan': 'TW',
        'Hồng Kông': 'HK',
        'Đức': 'DE'
    };
    return countryMap[countryName];
};

// Helper function to get genre ID from name
const getGenreId = (genreName) => {
    const genreMap = {
        'Hành động': 28,
        'Phiêu lưu': 12,
        'Anime': 16,
        'Hài': 35,
        'Tội phạm': 80,
        'Tài liệu': 99,
        'Gia đình': 10751,
        'Giả tưởng': 14,
        'Lịch sử': 36,
        'Kinh dị': 27,
        'Âm nhạc': 10402,
        'Bí ẩn': 9648,
        'Tình cảm': 10749,
        'Khoa học viễn tưởng': 878,
        'Gây cấn': 53,
        'Chiến tranh': 10752,
        'Tâm lý': 18
    };
    return genreMap[genreName];
};

// THÊM HÀM MỚI: Fetch filtered movies
export const fetchFilteredMovies = async (currentFilter, filters, page = 1) => {
    try {
        const { params, mediaType } = mapFilterToApiParams(filters, currentFilter);

        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        // Determine endpoint based on filter type and media type
        let endpoint = `discover/${mediaType}`;

        // If filtering by movie type specifically
        if (filters.movieType === 'Phim lẻ') {
            endpoint = 'discover/movie';
        } else if (filters.movieType === 'Phim bộ') {
            endpoint = 'discover/tv';
        }

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            const pageParams = new URLSearchParams(params);
            pageParams.set('page', apiPage);

            promises.push(
                fetch(`${apiConfig.baseUrl}${endpoint}?${pageParams.toString()}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results || []);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil((results[0]?.total_pages || 1) / 3)
        };
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        throw error;
    }
};

// Fetch movies by genre with pagination
export const fetchMoviesByGenre = async (genreId, page = 1) => {
    try {
        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            promises.push(
                fetch(`${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_genres=${genreId}&sort_by=popularity.desc&page=${apiPage}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil(results[0].total_pages / 3)
        };
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        throw error;
    }
};

// Fetch movies by country
export const fetchMoviesByCountry = async (countryCode, page = 1) => {
    try {
        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            promises.push(
                fetch(`${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=${countryCode}&sort_by=popularity.desc&page=${apiPage}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil(results[0].total_pages / 3)
        };
    } catch (error) {
        console.error('Error fetching movies by country:', error);
        throw error;
    }
};

// Fetch movies by topic (search-based)
export const fetchMoviesByTopic = async (topic, page = 1) => {
    try {
        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            promises.push(
                fetch(`${apiConfig.baseUrl}search/movie?api_key=${apiConfig.apiKey}&language=vi-VN&query=${encodeURIComponent(topic.keywords)}&page=${apiPage}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil(results[0].total_pages / 3)
        };
    } catch (error) {
        console.error('Error fetching movies by topic:', error);
        throw error;
    }
};

// Fetch movies (general)
export const fetchMovies = async (page = 1) => {
    try {
        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            promises.push(
                fetch(`${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&sort_by=popularity.desc&page=${apiPage}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil(results[0].total_pages / 3)
        };
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// Fetch TV series
export const fetchTVSeries = async (page = 1) => {
    try {
        const promises = [];
        const startPage = ((page - 1) * 3) + 1;

        for (let i = 0; i < 3; i++) {
            const apiPage = startPage + i;
            promises.push(
                fetch(`${apiConfig.baseUrl}discover/tv?api_key=${apiConfig.apiKey}&language=vi-VN&sort_by=popularity.desc&page=${apiPage}`)
                    .then(res => res.json())
            );
        }

        const results = await Promise.all(promises);
        const allMovies = results.flatMap(result => result.results);
        const movies24 = allMovies.slice(0, 24);

        return {
            movies: movies24,
            totalPages: Math.ceil(results[0].total_pages / 3)
        };
    } catch (error) {
        console.error('Error fetching TV series:', error);
        throw error;
    }
};

// Fetch top rated US-UK movies
export const fetchTopRatedUSUKMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=US,GB&sort_by=vote_average.desc&vote_count.gte=500&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching top rated US-UK movies:', error);
        throw error;
    }
};

// Fetch Top 5 trending movies today
export const fetchTrendingToday = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}trending/movie/day?api_key=${apiConfig.apiKey}&language=vi-VN`
        );
        const data = await response.json();
        return data.results.slice(0, 5);
    } catch (error) {
        console.error('Error fetching trending movies today:', error);
        throw error;
    }
};

// Fetch anime
export const fetchAnime = async () => {
    try {
        // Lấy dữ liệu tiếng Việt và tiếng Anh song song - anime 2024-2025 điểm cao
        const [animeMoviesVN, animeTVVN, animeMoviesEN, animeTVEN] = await Promise.all([
            fetch(`${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=50&primary_release_date.gte=2024-01-01&primary_release_date.lte=2025-12-31&page=1`),
            fetch(`${apiConfig.baseUrl}discover/tv?api_key=${apiConfig.apiKey}&language=vi-VN&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=30&first_air_date.gte=2024-01-01&first_air_date.lte=2025-12-31&page=1`),
            fetch(`${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=en-US&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=50&primary_release_date.gte=2024-01-01&primary_release_date.lte=2025-12-31&page=1`),
            fetch(`${apiConfig.baseUrl}discover/tv?api_key=${apiConfig.apiKey}&language=en-US&with_genres=16&with_origin_country=JP&sort_by=vote_average.desc&vote_count.gte=30&first_air_date.gte=2024-01-01&first_air_date.lte=2025-12-31&page=1`)
        ]);

        const moviesDataVN = await animeMoviesVN.json();
        const tvDataVN = await animeTVVN.json();
        const moviesDataEN = await animeMoviesEN.json();
        const tvDataEN = await animeTVEN.json();

        // Tạo map để lưu tên tiếng Anh
        const englishTitles = {};
        [...moviesDataEN.results, ...tvDataEN.results].forEach(item => {
            englishTitles[item.id] = {
                english_title: item.title || item.name,
                english_name: item.title || item.name
            };
        });

        const combined = [
            ...moviesDataVN.results.map(item => ({
                ...item,
                media_type: 'movie',
                english_title: englishTitles[item.id]?.english_title || item.title || item.original_title,
                english_name: englishTitles[item.id]?.english_name || item.name || item.original_name
            })),
            ...tvDataVN.results.map(item => ({
                ...item,
                media_type: 'tv',
                english_title: englishTitles[item.id]?.english_title || item.title || item.original_title,
                english_name: englishTitles[item.id]?.english_name || item.name || item.original_name
            }))
        ];

        return combined
            .filter(item => item.vote_average > 0) // Lọc bỏ những item không có rating
            .sort((a, b) => b.vote_average - a.vote_average) // Sắp xếp theo điểm từ cao xuống thấp
            .slice(0, 15);
    } catch (error) {
        console.error('Error fetching anime:', error);
        throw error;
    }
};

// Fetch actor details
export const fetchActorDetails = async (actorId) => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}person/${actorId}?api_key=${apiConfig.apiKey}&language=vi-VN`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching actor details:', error);
        throw error;
    }
};

// Fetch actor movies/TV shows
export const fetchActorMovies = async (actorId) => {
    try {
        // Fetch both Vietnamese and English data for proper titles
        const [creditsVN, creditsEN] = await Promise.all([
            fetch(`${apiConfig.baseUrl}person/${actorId}/movie_credits?api_key=${apiConfig.apiKey}&language=vi-VN`),
            fetch(`${apiConfig.baseUrl}person/${actorId}/movie_credits?api_key=${apiConfig.apiKey}&language=en-US`)
        ]);

        const dataVN = await creditsVN.json();
        const dataEN = await creditsEN.json();

        // Create map for English titles
        const englishTitles = {};
        dataEN.cast.forEach(item => {
            englishTitles[item.id] = {
                english_title: item.title || item.original_title,
                english_name: item.name || item.original_name
            };
        });

        // Combine cast from movies and TV shows
        const movieCredits = dataVN.cast.map(item => ({
            ...item,
            media_type: 'movie',
            english_title: englishTitles[item.id]?.english_title || item.title || item.original_title,
            english_name: englishTitles[item.id]?.english_name || item.name || item.original_name
        }));

        // Also fetch TV credits
        const [tvCreditsVN, tvCreditsEN] = await Promise.all([
            fetch(`${apiConfig.baseUrl}person/${actorId}/tv_credits?api_key=${apiConfig.apiKey}&language=vi-VN`),
            fetch(`${apiConfig.baseUrl}person/${actorId}/tv_credits?api_key=${apiConfig.apiKey}&language=en-US`)
        ]);

        const tvDataVN = await tvCreditsVN.json();
        const tvDataEN = await tvCreditsEN.json();

        // Create map for TV English titles
        const tvEnglishTitles = {};
        tvDataEN.cast.forEach(item => {
            tvEnglishTitles[item.id] = {
                english_title: item.name || item.original_name,
                english_name: item.name || item.original_name
            };
        });

        const tvCredits = tvDataVN.cast.map(item => ({
            ...item,
            media_type: 'tv',
            english_title: tvEnglishTitles[item.id]?.english_title || item.name || item.original_name,
            english_name: tvEnglishTitles[item.id]?.english_name || item.name || item.original_name
        }));

        // Combine and sort by popularity/release date
        const allCredits = [...movieCredits, ...tvCredits]
            .filter(item => item.poster_path) // Only show items with posters
            .sort((a, b) => {
                const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
                const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
                return dateB - dateA; // Sort by newest first
            })
            .slice(0, 20); // Limit to 20 most recent

        return allCredits;
    } catch (error) {
        console.error('Error fetching actor movies:', error);
        throw error;
    }
};