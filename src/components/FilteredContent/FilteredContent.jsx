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
    appliedFilters,
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

    // HÀM TẠO TIÊU ĐỀ ĐỘNG
    const generateDynamicTitle = () => {
        const baseTitle = currentFilter?.name || 'Phim';

        // Nếu chưa có filter nào được apply, trả về title gốc
        if (!appliedFilters || Object.values(appliedFilters).every(filter =>
            filter === 'Tất cả' || filter === 'Mới nhất' || filter === ''
        )) {
            return baseTitle;
        }

        const filterParts = [];

        // Thêm thể loại
        if (appliedFilters.genre && appliedFilters.genre !== 'Tất cả') {
            filterParts.push(appliedFilters.genre);
        }

        // Thêm quốc gia
        if (appliedFilters.country && appliedFilters.country !== 'Tất cả') {
            filterParts.push(appliedFilters.country);
        }

        // Thêm năm
        const yearFilter = appliedFilters.yearSearch?.trim() ||
            (appliedFilters.year !== 'Tất cả' ? appliedFilters.year : null);
        if (yearFilter) {
            filterParts.push(`${yearFilter}`);
        }

        // Thêm loại phim
        if (appliedFilters.movieType && appliedFilters.movieType !== 'Tất cả') {
            filterParts.push(appliedFilters.movieType);
        }

        // Tạo tiêu đề
        if (filterParts.length > 0) {
            return `${filterParts.join(' • ')} (${appliedFilters.sortBy || 'Mới nhất'})`;
        }

        return baseTitle;
    };

    const getMediaType = (movie) => {
        // Kiểm tra media_type trực tiếp từ object (nếu có)
        if (movie.media_type) {
            return movie.media_type;
        }

        // Kiểm tra dựa trên properties đặc trưng
        if (movie.title && movie.release_date) {
            return 'movie';
        }
        if (movie.name && movie.first_air_date) {
            return 'tv';
        }

        // Fallback dựa trên currentFilter
        if (currentFilter?.type === 'series') {
            return 'tv';
        }

        // Default
        return 'movie';
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
                <h2>{generateDynamicTitle()}</h2>
                <button className="filter-btn" onClick={() => setShowFilterPanel(true)}>
                    🔍 Bộ lọc
                </button>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
                <div className="filter-panel-container">
                    <div className="filter-panel">
                        {/* Quốc gia */}
                        <div className="filter-row">
                            <label>Quốc gia:</label>
                            <div className="filter-options">
                                {countries.map(country => (
                                    <button
                                        key={country}
                                        className={`filter-option ${tempFilters.country === country ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('country', country)}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Loại phim */}
                        <div className="filter-row">
                            <label>Loại phim:</label>
                            <div className="filter-options">
                                {movieTypes.map(type => (
                                    <button
                                        key={type}
                                        className={`filter-option ${tempFilters.movieType === type ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('movieType', type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Thể loại */}
                        <div className="filter-row">
                            <label>Thể loại:</label>
                            <div className="filter-options">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        className={`filter-option ${tempFilters.genre === genre ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('genre', genre)}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Năm sản xuất */}
                        <div className="filter-row">
                            <label>Năm sản xuất:</label>
                            <div className="year-input-container">
                                <div className="filter-options">
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            className={`filter-option ${tempFilters.year === year ? 'active' : ''}`}
                                            onClick={() => handleFilterChange('year', year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                                <div className="year-input">
                                    <div className="search-icon">
                                        <i className="fa-solid fa-search"></i>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nhập năm"
                                        value={tempFilters.yearSearch}
                                        onChange={(e) => handleFilterChange('yearSearch', e.target.value)}
                                        className="year-search-input"
                                        maxLength="4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sắp xếp */}
                        <div className="filter-row">
                            <label>Sắp xếp:</label>
                            <div className="filter-options">
                                {sortOptions.map(option => (
                                    <button
                                        key={option}
                                        className={`filter-option ${tempFilters.sortBy === option ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('sortBy', option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="filter-buttons">
                            <button className="apply-filter-btn" onClick={handleApplyFilters}>
                                Lọc kết quả
                                <i className="fa-solid fa-arrow-right"></i>
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
                        onClick={() => onMovieClick(movie, getMediaType(movie))}
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
                            <p className='imdb-container'><span className="imdb-text">IMDb</span> {movie.vote_average.toFixed(1)}</p>
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