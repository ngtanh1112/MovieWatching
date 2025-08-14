import React from 'react';
import { apiConfig } from '../../utils/constants';
import './MovieList.css';

const MovieList = ({
    title,
    movies,
    currentIndex,
    onNavigation,
    onMovieClick,
    type
}) => {
    const maxIndex = Math.max(0, movies.length - 3);

    const handlePrevClick = () => {
        onNavigation(type, 'prev');
    };

    const handleNextClick = () => {
        onNavigation(type, 'next');
    };

    return (
        <div className="movie-list-section">
            <div className="topic-header">
                <div className="topic-name">{title}</div>
                <div className="topic-navigation">
                    <button
                        className="nav-btn prev-btn"
                        onClick={handlePrevClick}
                        disabled={currentIndex === 0}
                    >
                        ‹
                    </button>
                    <button
                        className="nav-btn next-btn"
                        onClick={handleNextClick}
                        disabled={currentIndex >= maxIndex}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="movie-list">
                {movies.slice(currentIndex, currentIndex + 3).map((movie, index) => (
                    <div
                        key={index}
                        className="movie-item"
                        onClick={() => onMovieClick(movie)}
                    >
                        <img
                            src={apiConfig.w500Image(movie.poster_path)}
                            alt={movie.title}
                            loading="lazy"
                        />
                        <div className="movie-info">
                            <h4>{movie.title}</h4>
                            <p>⭐ {movie.vote_average.toFixed(1)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;