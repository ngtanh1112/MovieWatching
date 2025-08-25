import React from 'react';
import { apiConfig } from '../../utils/constants';
import { getMovieYear, formatRuntime } from '../../utils/helpers';
import './MovieDetail.css';

const MovieDetail = ({
    movie,
    movieDetails,
    movieCredits,
    recommendedMovies,
    detailLoading,
    onHomeClick,
    onMovieClick,
    onActorClick // THÊM PROP MỚI
}) => {
    const [movieVideos, setMovieVideos] = React.useState(null);
    const [videosLoading, setVideosLoading] = React.useState(true);

    // Fetch movie videos/trailers
    React.useEffect(() => {
        const fetchVideos = async () => {
            if (!movieDetails) return;

            setVideosLoading(true);
            try {
                const mediaType = movieDetails.title ? 'movie' : 'tv';
                const response = await fetch(
                    `${apiConfig.baseUrl}${mediaType}/${movieDetails.id}/videos?api_key=${apiConfig.apiKey}&language=en-US`
                );
                const data = await response.json();
                setMovieVideos(data.results);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setMovieVideos([]);
            } finally {
                setVideosLoading(false);
            }
        };

        fetchVideos();
    }, [movieDetails]);

    if (detailLoading) {
        return (
            <div className="movie-detail-container">
                <div className="loading">Đang tải chi tiết...</div>
            </div>
        );
    }

    if (!movieDetails) {
        return (
            <div className="movie-detail-container">
                <div className="error-message">Không thể tải thông tin phim</div>
            </div>
        );
    }

    // Get the best trailer (prioritize official trailers)
    const getTrailerUrl = () => {
        if (!movieVideos || movieVideos.length === 0) {
            return null;
        }

        // Priority order: Official trailer > Trailer > Teaser > Any video
        const priorities = ['Trailer', 'Teaser', 'Clip'];

        for (const type of priorities) {
            const video = movieVideos.find(v =>
                v.type === type &&
                v.site === 'YouTube' &&
                v.official === true
            );
            if (video) return `https://www.youtube.com/embed/${video.key}`;
        }

        // Fallback: any YouTube trailer/teaser
        for (const type of priorities) {
            const video = movieVideos.find(v =>
                v.type === type &&
                v.site === 'YouTube'
            );
            if (video) return `https://www.youtube.com/embed/${video.key}`;
        }

        // Last fallback: any YouTube video
        const anyVideo = movieVideos.find(v => v.site === 'YouTube');
        return anyVideo ? `https://www.youtube.com/embed/${anyVideo.key}` : null;
    };

    const trailerUrl = getTrailerUrl();

    return (
        <div className="movie-detail-container">
            {/* Backdrop Section */}
            <div className="detail-backdrop-section">
                <img
                    src={apiConfig.originalImage(movieDetails.backdrop_path)}
                    alt={movieDetails.title || movieDetails.name}
                    className="backdrop-image"
                />
                <div className="backdrop-overlay"></div>
            </div>

            {/* Main Content Section */}
            <div className="detail-main-content">
                <div className="content-wrapper">
                    {/* Left Side - Movie Info */}
                    <div className="movie-info-section">
                        <div className="detail-poster">
                            <img
                                src={apiConfig.w500Image(movieDetails.poster_path)}
                                alt={movieDetails.title || movieDetails.name}
                            />
                        </div>

                        <div className="detail-info">
                            <h1 className="detail-title">{movieDetails.title || movieDetails.name}</h1>
                            <h2 className="detail-original-title">
                                {movieDetails.original_title || movieDetails.original_name}
                            </h2>

                            <div className="detail-meta">
                                <span className="detail-rating">⭐ {movieDetails.vote_average.toFixed(1)}</span>
                                <span className="detail-year">
                                    {getMovieYear(movieDetails.release_date || movieDetails.first_air_date)}
                                </span>
                                <span className="detail-runtime">
                                    {movieDetails.runtime ? formatRuntime(movieDetails.runtime) :
                                        movieDetails.episode_run_time ? formatRuntime(movieDetails.episode_run_time[0]) : 'N/A'}
                                </span>
                            </div>

                            <div className="detail-genres">
                                {movieDetails.genres && movieDetails.genres.map((genre, index) => (
                                    <span key={index} className="detail-genre-tag">{genre.name}</span>
                                ))}
                            </div>

                            <p className="detail-overview">
                                {movieDetails.overview || 'Không có mô tả'}
                            </p>

                            {/* Episodes Info (for TV series) */}
                            {movieDetails.number_of_seasons && (
                                <div className="episodes-info-inline">
                                    <h4>Thông tin tập phim</h4>
                                    <div className="episodes-stats">
                                        <span>Số mùa: {movieDetails.number_of_seasons}</span>
                                        <span>Tổng số tập: {movieDetails.number_of_episodes}</span>
                                        <span>Trạng thái: {movieDetails.status === 'Ended' ? 'Đã kết thúc' :
                                            movieDetails.status === 'Returning Series' ? 'Đang phát sóng' : movieDetails.status}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Actions and Trailer */}
                    <div className="right-side-section">
                        {/* Actions Section */}
                        <div className="detail-actions">
                            <button className="detail-play-btn">▶ Phát</button>
                            <button className="detail-favorite-btn">❤ Yêu thích</button>
                            <button className="detail-share-btn">📤 Chia sẻ</button>
                        </div>

                        {/* Trailer Section */}
                        <div className="trailer-section">
                            <h3>Trailer</h3>
                            {videosLoading ? (
                                <div className="trailer-loading">
                                    <div className="loading-placeholder">Đang tải trailer...</div>
                                </div>
                            ) : trailerUrl ? (
                                <div className="trailer-container">
                                    <iframe
                                        src={trailerUrl}
                                        title="Movie Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="no-trailer">
                                    <div className="no-trailer-placeholder">
                                        <span>🎬</span>
                                        <p>Trailer chưa có sẵn</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section - CẬP NHẬT ĐỂ THÊM ONCLICK */}
            {movieCredits && movieCredits.cast && movieCredits.cast.length > 0 && (
                <div className="detail-section cast-section">
                    <h3>Diễn viên</h3>
                    <div className="cast-list">
                        {movieCredits.cast.slice(0, 10).map((actor, index) => (
                            <div
                                key={index}
                                className="cast-item"
                                onClick={() => onActorClick && onActorClick(actor)} // THÊM ONCLICK
                                style={{ cursor: 'pointer' }} // THÊM CURSOR POINTER
                            >
                                <div className="cast-photo">
                                    {actor.profile_path ? (
                                        <img
                                            src={apiConfig.w500Image(actor.profile_path)}
                                            alt={actor.name}
                                        />
                                    ) : (
                                        <div className="cast-photo-placeholder">👤</div>
                                    )}
                                </div>
                                <div className="cast-info">
                                    <p className="cast-name">{actor.name}</p>
                                    <p className="cast-character">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            {recommendedMovies && recommendedMovies.length > 0 && (
                <div className="detail-section recommendations-section">
                    <h3>Đề xuất</h3>
                    <div className="recommendations-list">
                        {recommendedMovies.map((movie, index) => (
                            <div
                                key={index}
                                className="recommendation-item"
                                onClick={() => onMovieClick(movie, movie.media_type || 'movie')}
                            >
                                <img
                                    src={apiConfig.w500Image(movie.poster_path)}
                                    alt={movie.title || movie.name}
                                />
                                <div className="recommendation-info">
                                    <h4>{movie.title || movie.name}</h4>
                                    <p>⭐ {movie.vote_average.toFixed(1)}</p>
                                    <p>{getMovieYear(movie.release_date || movie.first_air_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;