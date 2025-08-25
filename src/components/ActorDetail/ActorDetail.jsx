import React from 'react';
import { apiConfig } from '../../utils/constants';
import { getMovieYear } from '../../utils/helpers';
import './ActorDetail.css';

const ActorDetail = ({
    actor,
    actorDetails,
    actorMovies,
    detailLoading,
    onHomeClick,
    onMovieClick
}) => {
    if (detailLoading) {
        return (
            <div className="actor-detail-container">
                <div className="loading">Đang tải thông tin diễn viên...</div>
            </div>
        );
    }

    if (!actorDetails) {
        return (
            <div className="actor-detail-container">
                <div className="error-message">Không thể tải thông tin diễn viên</div>
            </div>
        );
    }

    const calculateAge = (birthday) => {
        if (!birthday) return null;
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(actorDetails.birthday);

    return (
        <div className="actor-detail-container">

            {/* Main Content */}
            <div className="actor-main-content">
                <div className="content-wrapper">
                    {/* Left Side - Actor Info */}
                    <div className="actor-info-section">
                        <div className="actor-poster">
                            {actorDetails.profile_path ? (
                                <img
                                    src={apiConfig.w500Image(actorDetails.profile_path)}
                                    alt={actorDetails.name}
                                />
                            ) : (
                                <div className="actor-photo-placeholder">
                                    <span>👤</span>
                                    <p>Không có ảnh</p>
                                </div>
                            )}
                        </div>

                        <div className="actor-info">
                            <h1 className="actor-name">{actorDetails.name}</h1>

                            <div className="actor-meta">
                                {age && <span className="actor-age">Tuổi: {age}</span>}
                                {actorDetails.birthday && (
                                    <span className="actor-birthday">
                                        Sinh: {new Date(actorDetails.birthday).toLocaleDateString('vi-VN')}
                                    </span>
                                )}
                                {actorDetails.place_of_birth && (
                                    <span className="actor-birthplace">Quốc gia: {actorDetails.place_of_birth?.split(',').pop().trim()}</span>)}
                            </div>

                            {actorDetails.biography && (
                                <div className="actor-biography">
                                    <h3>Tiểu sử</h3>
                                    <p>{actorDetails.biography}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Movies */}
                    <div className="actor-movies-section">
                        <h2>Các phim đã tham gia</h2>
                        {actorMovies && actorMovies.length > 0 ? (
                            <div className="actor-movies-grid">
                                {actorMovies.map((movie, index) => (
                                    <div
                                        key={`${movie.id}-${movie.media_type}-${index}`}
                                        className="actor-movie-item"
                                        onClick={() => onMovieClick(movie, movie.media_type)}
                                    >
                                        <div className="actor-movie-poster">
                                            <img
                                                src={apiConfig.w500Image(movie.poster_path)}
                                                alt={movie.title || movie.name}
                                            />
                                            <div className="movie-overlay">
                                                <span className="play-icon">▶</span>
                                            </div>
                                        </div>
                                        <div className="actor-movie-info">
                                            <h4 className="movie-title-vietnamese">
                                                {movie.title || movie.name}
                                            </h4>
                                            <p className="movie-title-english">
                                                {movie.english_title || movie.english_name || movie.original_title || movie.original_name}
                                            </p>
                                            <div className="movie-meta">
                                                <span className="movie-year">
                                                    {getMovieYear(movie.release_date || movie.first_air_date)}
                                                </span>
                                                {movie.vote_average > 0 && (
                                                    <span className="movie-rating">
                                                        ⭐ {movie.vote_average.toFixed(1)}
                                                    </span>
                                                )}
                                                <span className="movie-type">
                                                    {movie.media_type === 'tv' ? 'TV' : 'Phim'}
                                                </span>
                                            </div>
                                            {movie.character && (
                                                <p className="movie-character">Vai: {movie.character}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-movies">
                                <p>Không tìm thấy tác phẩm nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActorDetail;