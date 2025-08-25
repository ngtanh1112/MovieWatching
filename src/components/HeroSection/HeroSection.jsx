import React from 'react';
import { apiConfig } from '../../utils/constants';
import { getMovieYear, getGenreNames } from '../../utils/helpers';
import './HeroSection.css';

const HeroSection = ({
    heroMovies,
    currentHeroMovie,
    onThumbnailClick,
    onMovieClick
}) => {
    if (!heroMovies || heroMovies.length === 0 || currentHeroMovie >= heroMovies.length) {
        return <div className="no-data">Không có dữ liệu phim</div>;
    }

    const currentMovie = heroMovies[currentHeroMovie];

    return (
        <section className="hero-section">
            <div className="hero-background">
                <img
                    src={apiConfig.originalImage(currentMovie.backdrop_path)}
                    alt={currentMovie.title}
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
                <div className="heromovie-titles">
                    <div className="heromovie-title">{currentMovie.title}</div>
                    <div className="heromovie-original-title">
                        {currentMovie.original_title}
                    </div>
                </div>

                <div className="heromovie-tags">
                    <span className="tag tag-rating">IMDb: {currentMovie.vote_average.toFixed(1)}</span>
                    <span className="tag tag-year">Năm: {getMovieYear(currentMovie.release_date)}</span>
                </div>

                <div className="heromovie-genres">
                    {getGenreNames(currentMovie.genre_ids).map((genre, index) => (
                        <button key={index} className="genre-btn">{genre}</button>
                    ))}
                </div>

                <div className="heromovie-overview">
                    {currentMovie.overview || 'Không có mô tả'}
                </div>

                <div className="heromovie-bottom">
                    <div className="heromovie-actions">
                        <button className="action-btn play-btn">▶</button>
                        <button className="action-btn favorite-btn">❤</button>
                        <button
                            className="action-btn detail-btn"
                            onClick={() => onMovieClick(currentMovie)}
                        >ℹ
                        </button>
                    </div>

                    <div className="heromovie-thumbnails">
                        <div className="thumbnail-list">
                            {heroMovies.map((movie, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail-item ${index === currentHeroMovie ? 'active' : ''}`}
                                    onClick={() => onThumbnailClick(index)}
                                >
                                    <img
                                        src={apiConfig.w500Image(movie.poster_path)}
                                        alt={movie.title}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;