import React, { useState } from 'react';
import Pagination from '../Pagination/Pagination';
import { apiConfig } from '../../utils/constants';
import { getMovieYear } from '../../utils/helpers';
import './FilteredContent.css';

const FilteredContent = ({
    loading,
    movies,
    currentFilter,
    currentPage,
    totalPages,
    isLoadingMore,
    onHomeClick,
    onMovieClick,
    onPaginationClick,
    onFilterChange
}) => {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        country: 'Tất cả',
        movieType: 'Tất cả',
        genre: 'Tất cả',
        year: 'Tất cả',
        yearSearch: '',
        sortBy: 'Mới nhất'
    });

    const countries = ['Tất cả', 'Anh', 'Canada', 'Hàn Quốc', 'Hồng Kông', 'Mỹ', 'Nhật Bản', 'Pháp', 'Thái Lan', 'Trung Quốc', 'Úc', 'Đài Loan', 'Đức'];
    const movieTypes = ['Tất cả', 'Phim lẻ', 'Phim bộ'];
    const genres = ['Tất cả', 'Anime', 'Kinh dị', 'Hành động', 'Phiêu lưu', 'Hài', 'Tình cảm', 'Khoa học viễn tưởng', 'Tâm lý', 'Tài liệu', 'Gia đình', 'Chiến tranh', 'Âm nhạc', 'Bí ẩn'];
    const years = ['Tất cả', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
    const sortOptions = ['Mới nhất', 'Điểm IMDb', 'Lượt xem'];

    const getMediaType = () => {
        return currentFilter?.type === 'series' ? 'tv' : 'movie';
    };

    const handleFilterChange = (filterType, value) => {
        setTempFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleApplyFilters = () => {
        // Xử lý năm tìm kiếm
        let finalYear = tempFilters.year;
        if (tempFilters.yearSearch.trim() !== '') {
            finalYear = tempFilters.yearSearch.trim();
        }

        const appliedFilters = {
            ...tempFilters,
            year: finalYear
        };

        if (onFilterChange) {
            onFilterChange(appliedFilters);
        }
        setShowFilterPanel(false);
    };

    const handleCloseFilter = () => {
        setShowFilterPanel(false);
    };

    if (loading) {
        return (
            <div className="filtered-content">
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="filtered-content">
            <div className="filtered-header">
                <button className="back-btn" onClick={onHomeClick}>
                    ← Về trang chủ
                </button>
                <h2>{currentFilter?.name}</h2>
                <button className="filter-btn" onClick={() => setShowFilterPanel(true)}>
                    🔍 Bộ lọc
                </button>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
                <div className="filter-overlay">
                    <div className="filter-panel">
                        <h3>Bộ lọc phim</h3>

                        {/* Quốc gia */}
                        <div className="filter-group">
                            <label>Quốc gia:</label>
                            <select
                                value={tempFilters.country}
                                onChange={(e) => handleFilterChange('country', e.target.value)}
                            >
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Loại phim */}
                        <div className="filter-group">
                            <label>Loại phim:</label>
                            <select
                                value={tempFilters.movieType}
                                onChange={(e) => handleFilterChange('movieType', e.target.value)}
                            >
                                {movieTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Thể loại */}
                        <div className="filter-group">
                            <label>Thể loại:</label>
                            <select
                                value={tempFilters.genre}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                            >
                                {genres.map(genre => (
                                    <option key={genre} value={genre}>{genre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Năm sản xuất */}
                        <div className="filter-group">
                            <label>Năm sản xuất:</label>
                            <div className="year-filter-container">
                                <select
                                    value={tempFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Nhập năm"
                                    value={tempFilters.yearSearch}
                                    onChange={(e) => handleFilterChange('yearSearch', e.target.value)}
                                    className="year-search-input"
                                />
                            </div>
                        </div>

                        {/* Sắp xếp */}
                        <div className="filter-group">
                            <label>Sắp xếp:</label>
                            <select
                                value={tempFilters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                {sortOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="filter-buttons">
                            <button className="apply-filter-btn" onClick={handleApplyFilters}>
                                Lọc kết quả
                            </button>
                            <button className="close-filter-btn" onClick={handleCloseFilter}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="filtered-movies-grid">
                {movies.map((movie, index) => (
                    <div
                        key={`${movie.id}-${index}`}
                        className="filtered-movie-item"
                        onClick={() => onMovieClick(movie, getMediaType())}
                    >
                        {movie.poster_path ? (
                            <img
                                src={apiConfig.w500Image(movie.poster_path)}
                                alt={movie.title || movie.name}
                                loading="lazy"
                            />
                        ) : (
                            <div className="movie-poster-placeholder">
                                🎬
                            </div>
                        )}
                        <div className="filtered-movie-info">
                            <h4>{movie.title || movie.name}</h4>
                            <p>⭐ {movie.vote_average.toFixed(1)}</p>
                            <p>{getMovieYear(movie.release_date || movie.first_air_date)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {movies.length === 0 && (
                <div className="no-results">
                    <p>Không tìm thấy phim nào</p>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={isLoadingMore}
                    onPageClick={onPaginationClick}
                />
            )}

            {isLoadingMore && (
                <div className="loading-more">Đang tải thêm...</div>
            )}
        </div>
    );
};

export default FilteredContent;