import React, { useState, useRef, useEffect } from 'react';
import { searchMovies } from '../../services/movieService';
import { getMovieYear } from '../../utils/helpers';
import { apiConfig } from '../../utils/constants';
import './SearchBar.css';

const SearchBar = ({ onMovieClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const searchRef = useRef(null);
    const searchTimeout = useRef(null);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        // Set new timeout for debounced search
        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await searchMovies(query);
                setSearchResults(results);
                setShowSearchResults(true);
                setIsSearching(false);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
                setShowSearchResults(false);
                setIsSearching(false);
            }
        }, 300);
    };

    const handleSearchResultClick = (item) => {
        setShowSearchResults(false);
        setSearchQuery('');
        onMovieClick(item, item.media_type || 'movie');
    };

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    return (
        <div className="search-container" ref={searchRef}>
            <input
                type="text"
                placeholder="Tìm kiếm phim, diễn viên"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />

            {isSearching && (
                <div className="search-results">
                    <div className="search-loading">Đang tìm kiếm...</div>
                </div>
            )}

            {showSearchResults && searchResults.length > 0 && (
                <div className="search-results">
                    {searchResults.map((item, index) => (
                        <div
                            key={index}
                            className="search-result-item"
                            onClick={() => handleSearchResultClick(item)}
                        >
                            {item.poster_path ? (
                                <img
                                    src={apiConfig.w500Image(item.poster_path)}
                                    alt={item.title || item.name}
                                />
                            ) : (
                                <div className="search-result-placeholder">🎬</div>
                            )}
                            <div className="search-result-info">
                                <h4>{item.title || item.name}</h4>
                                <p>⭐ {item.vote_average.toFixed(1)} • {getMovieYear(item.release_date || item.first_air_date)}</p>
                                <span className="search-media-type">
                                    {item.media_type === 'tv' ? 'Phim bộ' : 'Phim lẻ'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
                <div className="search-results">
                    <div className="search-no-results">Không tìm thấy kết quả</div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;