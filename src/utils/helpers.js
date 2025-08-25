// Helpers.js

import { genreMap } from './constants';

// Get movie year from release date
export const getMovieYear = (releaseDate) => {
    return releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
};

// Get genre names from genre IDs
export const getGenreNames = (genreIds) => {
    return genreIds.map(id => genreMap[id] || 'Unknown').slice(0, 3);
};

// Format runtime to hours and minutes
export const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};