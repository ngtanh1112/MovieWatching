import { apiConfig } from '../utils/constants';

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

// Fetch Korea movies
export const fetchKoreaMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=KR&sort_by=release_date.desc&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching Korea movies:', error);
        throw error;
    }
};

// Fetch Chinese movies
export const fetchChineseMovies = async () => {
    try {
        const response = await fetch(
            `${apiConfig.baseUrl}discover/movie?api_key=${apiConfig.apiKey}&language=vi-VN&with_origin_country=CN&sort_by=release_date.desc&page=1`
        );
        const data = await response.json();
        return data.results.slice(0, 20);
    } catch (error) {
        console.error('Error fetching Chinese movies:', error);
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