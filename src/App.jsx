// App.jsx

import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import MovieList from './components/MovieList/MovieList';
import MovieDetail from './components/MovieDetail/MovieDetail';
import ActorDetail from './components/ActorDetail/ActorDetail';
import FilteredContent from './components/FilteredContent/FilteredContent';
import { VIEW_TYPES, topicsData, countriesData, apiConfig } from './utils/constants';
import {
  fetchHeroMovies,
  fetchTopRatedKoreaMovies,      // Thay fetchKoreaMovies
  fetchTopRatedChineseMovies,    // Thay fetchChineseMovies
  fetchTopRatedUSUKMovies,       // Thay fetchUSUKMovies
  fetchMovieDetails,
  fetchMoviesByGenre,
  fetchMoviesByCountry,
  fetchMoviesByTopic,
  fetchMovies,
  fetchTVSeries,
  fetchFilteredMovies,
  fetchTrendingToday,
  fetchAnime
} from './services/movieService';
import './styles/variables.css';
import './styles/globals.css';
import './App.css';

function App() {
  // Loading and data states
  const [loading, setLoading] = useState(true);
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroMovie, setCurrentHeroMovie] = useState(0);
  const [koreaMovies, setKoreaMovies] = useState([]);
  const [chineseMovies, setChineseMovies] = useState([]);
  const [koreaCurrentIndex, setKoreaCurrentIndex] = useState(0);
  const [chineseCurrentIndex, setChineseCurrentIndex] = useState(0);

  // Navigation states
  const [currentView, setCurrentView] = useState(VIEW_TYPES.HOME);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Actor detail states
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorDetails, setActorDetails] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);

  const [usukMovies, setUsukMovies] = useState([]);
  const [usukCurrentIndex, setUsukCurrentIndex] = useState(0);
  const [trendingToday, setTrendingToday] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [currentAnime, setCurrentAnime] = useState(0);

  // Filter states - THÊM MỚI
  const [appliedFilters, setAppliedFilters] = useState({
    country: 'Tất cả',
    movieType: 'Tất cả',
    genre: 'Tất cả',
    year: 'Tất cả',
    yearSearch: '',
    sortBy: 'Mới nhất'
  });

  // Movie detail states
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const [heroData, koreaData, chineseData, usukData, trendingData, animeData] = await Promise.all([
          fetchHeroMovies(),
          fetchTopRatedKoreaMovies(),
          fetchTopRatedChineseMovies(),
          fetchTopRatedUSUKMovies(),
          fetchTrendingToday(),
          fetchAnime()  // Thay đổi
        ]);

        setHeroMovies(heroData);
        setKoreaMovies(koreaData);
        setChineseMovies(chineseData);
        setUsukMovies(usukData);
        setTrendingToday(trendingData);
        setPopularAnime(animeData);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  // Navigation handlers
  const handleHomeClick = () => {
    setCurrentView(VIEW_TYPES.HOME);
    setCurrentFilter(null);
    // Reset filters khi về trang chủ
    setAppliedFilters({
      country: 'Tất cả',
      movieType: 'Tất cả',
      genre: 'Tất cả',
      year: 'Tất cả',
      yearSearch: '',
      sortBy: 'Mới nhất'
    });
  };

  const handleThumbnailClick = (index) => {
    setCurrentHeroMovie(index);
  };

  const handleMovieListNavigation = (type, direction) => {
    if (type === 'korea') {
      const maxIndex = Math.max(0, koreaMovies.length - 5); // Thay 3 thành 5
      if (direction === 'next') {
        setKoreaCurrentIndex(prev => Math.min(prev + 5, maxIndex)); // Thay 3 thành 5
      } else {
        setKoreaCurrentIndex(prev => Math.max(prev - 5, 0)); // Thay 3 thành 5
      }
    } else if (type === 'chinese') {
      const maxIndex = Math.max(0, chineseMovies.length - 5); // Thay 3 thành 5
      if (direction === 'next') {
        setChineseCurrentIndex(prev => Math.min(prev + 5, maxIndex)); // Thay 3 thành 5
      } else {
        setChineseCurrentIndex(prev => Math.max(prev - 5, 0)); // Thay 3 thành 5
      }
    } else if (type === 'usuk') {
      const maxIndex = Math.max(0, usukMovies.length - 5); // Thay 3 thành 5
      if (direction === 'next') {
        setUsukCurrentIndex(prev => Math.min(prev + 5, maxIndex)); // Thay 3 thành 5
      } else {
        setUsukCurrentIndex(prev => Math.max(prev - 5, 0)); // Thay 3 thành 5
      }
    }
  };

  // Movie detail handler
  const handleMovieClick = async (movie, mediaType = 'movie') => {
    try {
      setSelectedMovie({ ...movie, media_type: mediaType });
      setCurrentView(VIEW_TYPES.DETAIL);
      setDetailLoading(true);

      const { details, credits, recommendations } = await fetchMovieDetails(movie.id, mediaType);

      setMovieDetails(details);
      setMovieCredits(credits);
      setRecommendedMovies(recommendations);

      // Scroll to top when showing details
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Actor detail handler
  const handleActorClick = async (actor) => {
    try {
      setSelectedActor(actor);
      setCurrentView(VIEW_TYPES.ACTOR_DETAIL);
      setDetailLoading(true);

      // Fetch actor details và movies
      const [detailsResponse, moviesResponse] = await Promise.all([
        fetch(`${apiConfig.baseUrl}person/${actor.id}?api_key=${apiConfig.apiKey}&language=vi`),
        fetch(`${apiConfig.baseUrl}person/${actor.id}/combined_credits?api_key=${apiConfig.apiKey}&language=vi`)
      ]);

      const details = await detailsResponse.json();
      const moviesData = await moviesResponse.json();

      setActorDetails(details);
      setActorMovies(moviesData.cast || []);

      // Scroll to top when showing details
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error fetching actor details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  // THÊM HÀM XỬ LÝ FILTER - QUAN TRỌNG
  const handleFilterChange = async (filters) => {
    try {
      setLoading(true);
      setCurrentPage(1);
      setAppliedFilters(filters);

      // Gọi API với filters mới
      const { movies, totalPages: total } = await fetchFilteredMovies(
        currentFilter,
        filters,
        1
      );

      setFilteredMovies(movies);
      setTotalPages(total);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const handleTopicClick = async (topic) => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const { movies, totalPages: total } = await fetchMoviesByTopic(topic, 1);

      setFilteredMovies(movies);
      setTotalPages(total);
      setCurrentView(VIEW_TYPES.TOPIC);
      setCurrentFilter({ type: 'topic', id: topic.id, name: topic.name });
    } catch (error) {
      console.error('Error fetching movies by topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = async (genreId) => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const { movies, totalPages: total } = await fetchMoviesByGenre(genreId, 1);

      setFilteredMovies(movies);
      setTotalPages(total);
      setCurrentView(VIEW_TYPES.GENRE);
      setCurrentFilter({ type: 'genre', id: genreId, name: `Genre ${genreId}` });
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = async (countryCode) => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const { movies, totalPages: total } = await fetchMoviesByCountry(countryCode, 1);
      const country = countriesData.find(c => c.code === countryCode);

      setFilteredMovies(movies);
      setTotalPages(total);
      setCurrentView(VIEW_TYPES.COUNTRY);
      setCurrentFilter({ type: 'country', code: countryCode, name: country.name });
    } catch (error) {
      console.error('Error fetching movies by country:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviesClick = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const { movies, totalPages: total } = await fetchMovies(1);

      setFilteredMovies(movies);
      setTotalPages(total);
      setCurrentView(VIEW_TYPES.MOVIES);
      setCurrentFilter({ type: 'movies', name: 'Phim lẻ' });
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesClick = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);

      const { movies, totalPages: total } = await fetchTVSeries(1);

      setFilteredMovies(movies);
      setTotalPages(total);
      setCurrentView(VIEW_TYPES.SERIES);
      setCurrentFilter({ type: 'series', name: 'Phim bộ' });
    } catch (error) {
      console.error('Error fetching TV series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActorsClick = () => {
    setCurrentView(VIEW_TYPES.ACTORS);
    setCurrentFilter({ type: 'actors', name: 'Diễn viên' });
  };

  const handleScheduleClick = () => {
    setCurrentView(VIEW_TYPES.SCHEDULE);
    setCurrentFilter({ type: 'schedule', name: 'Lịch chiếu' });
  };

  const handleAnimeThumbnailClick = (index) => {
    setCurrentAnime(index);
  };
  // Pagination handler - CẬP NHẬT ĐỂ HỖ TRỢ FILTER
  const handlePaginationClick = async (newPage) => {
    if (newPage < 1 || newPage > totalPages || isLoadingMore) return;

    setCurrentPage(newPage);
    setIsLoadingMore(true);

    try {
      let result;

      // Nếu có filter đã được apply, sử dụng filter
      if (Object.values(appliedFilters).some(filter => filter !== 'Tất cả' && filter !== 'Mới nhất' && filter !== '')) {
        result = await fetchFilteredMovies(currentFilter, appliedFilters, newPage);
      } else {
        // Ngược lại sử dụng logic cũ
        switch (currentFilter?.type) {
          case 'genre':
            result = await fetchMoviesByGenre(currentFilter.id, newPage);
            break;
          case 'country':
            result = await fetchMoviesByCountry(currentFilter.code, newPage);
            break;
          case 'topic':
            const topic = topicsData.find(t => t.id === currentFilter.id);
            result = await fetchMoviesByTopic(topic, newPage);
            break;
          case 'movies':
            result = await fetchMovies(newPage);
            break;
          case 'series':
            result = await fetchTVSeries(newPage);
            break;
          default:
            return;
        }
      }

      setFilteredMovies(result.movies);
    } catch (error) {
      console.error('Error fetching paginated data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Render main content based on current view
  const renderMainContent = () => {
    if (currentView === VIEW_TYPES.DETAIL && selectedMovie) {
      return (
        <MovieDetail
          movie={selectedMovie}
          movieDetails={movieDetails}
          movieCredits={movieCredits}
          recommendedMovies={recommendedMovies}
          detailLoading={detailLoading}
          onHomeClick={handleHomeClick}
          onMovieClick={handleMovieClick}
          onActorClick={handleActorClick}
        />
      );
    }

    if (currentView === VIEW_TYPES.ACTOR_DETAIL && selectedActor) {
      return (
        <ActorDetail
          actor={selectedActor}
          actorDetails={actorDetails}
          actorMovies={actorMovies}
          detailLoading={detailLoading}
          onHomeClick={handleHomeClick}
          onMovieClick={handleMovieClick}
        />
      );
    }

    if (currentView === VIEW_TYPES.HOME) {
      return (
        <>
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <>
              <HeroSection
                heroMovies={heroMovies}
                currentHeroMovie={currentHeroMovie}
                onThumbnailClick={handleThumbnailClick}
                onMovieClick={handleMovieClick}
              />

              {/* Movie Lists */}
              <div className="topic-list-container">
                <MovieList
                  title="Top Phim Hàn Quốc"
                  movies={koreaMovies}
                  currentIndex={koreaCurrentIndex}
                  onNavigation={handleMovieListNavigation}
                  onMovieClick={handleMovieClick}
                  type="korea"
                />

                <MovieList
                  title="Top Phim Trung Quốc"
                  movies={chineseMovies}
                  currentIndex={chineseCurrentIndex}
                  onNavigation={handleMovieListNavigation}
                  onMovieClick={handleMovieClick}
                  type="chinese"
                />

                <MovieList
                  title="Top Phim US-UK"
                  movies={usukMovies}
                  currentIndex={usukCurrentIndex}
                  onNavigation={handleMovieListNavigation}
                  onMovieClick={handleMovieClick}
                  type="usuk"
                />
              </div>

              {/* Top 5 Movies Today */}
              <div className="top-movies-today">
                <div className="section-header">
                  <h2 className="section-title">Top 5 Bộ Phim Hôm Nay</h2>
                </div>
                <div className="top-movies-grid">
                  {trendingToday.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="top-movie-item"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="movie-rank">{index + 1}</div>
                      <img
                        src={apiConfig.w500Image(movie.poster_path)}
                        alt={movie.title}
                      />
                      <div className="top-movie-info">
                        <h3>{movie.title}</h3>
                        <div className="movie-meta">
                          <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
                          <span className="year">{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Anime Section */}
              <h2 className="anime-section-title">Kho Tàng Anime</h2>

              {popularAnime.length > 0 && (
                <div className="anime-section">
                  <div className="anime-container">
                    <div className="anime-content">
                      <div className="anime-info">
                        <div className="anime-titles">
                          <div className="anime-title">{popularAnime[currentAnime]?.title || popularAnime[currentAnime]?.name}</div>
                          <div className="anime-original-title">
                            {popularAnime[currentAnime]?.english_title || popularAnime[currentAnime]?.english_name ||
                              popularAnime[currentAnime]?.original_title || popularAnime[currentAnime]?.original_name}
                          </div>
                        </div>

                        <div className="anime-tags">
                          <span className="tag tag-rating">IMDb: {popularAnime[currentAnime]?.vote_average.toFixed(1)}</span>
                          <span className="tag tag-year">
                            Năm: {new Date(popularAnime[currentAnime]?.release_date || popularAnime[currentAnime]?.first_air_date).getFullYear()}
                          </span>
                          <span className="tag tag-type">
                            {popularAnime[currentAnime]?.media_type === 'tv' ? 'TV Series' : 'Movie'}
                          </span>
                        </div>

                        <div className="anime-overview">
                          {popularAnime[currentAnime]?.overview || 'Không có mô tả'}
                        </div>

                        <div className="anime-actions">
                          <button className="action-btn play-btn">▶</button>
                          <button className="action-btn favorite-btn">❤</button>
                          <button
                            className="action-btn detail-btn"
                            onClick={() => handleMovieClick(popularAnime[currentAnime], popularAnime[currentAnime]?.media_type)}
                          >ℹ</button>
                        </div>
                      </div>

                      <div className="anime-background">
                        <img
                          src={apiConfig.originalImage(popularAnime[currentAnime]?.backdrop_path)}
                          alt={popularAnime[currentAnime]?.title || popularAnime[currentAnime]?.name}
                        />
                        <div className="anime-overlay"></div>
                      </div>
                    </div>

                    <div className="anime-thumbnails">
                      <div className="anime-thumbnail-list">
                        {popularAnime.map((anime, index) => (
                          <div
                            key={index}
                            className={`anime-thumbnail-item ${index === currentAnime ? 'active' : ''}`}
                            onClick={() => handleAnimeThumbnailClick(index)}
                          >
                            <img
                              src={apiConfig.w500Image(anime.poster_path)}
                              alt={anime.title || anime.name}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </>
      );
    }

    if ([VIEW_TYPES.TOPIC, VIEW_TYPES.GENRE, VIEW_TYPES.COUNTRY, VIEW_TYPES.MOVIES, VIEW_TYPES.SERIES].includes(currentView)) {
      return (
        <FilteredContent
          loading={loading}
          movies={filteredMovies}
          currentFilter={currentFilter}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoadingMore={isLoadingMore}
          appliedFilters={appliedFilters} // THÊM PROP NÀY
          onHomeClick={handleHomeClick}
          onMovieClick={handleMovieClick}
          onPaginationClick={handlePaginationClick}
          onFilterChange={handleFilterChange}
        />
      );
    }

    // Placeholder for other views
    return (
      <div className="placeholder-content">
        <div className="placeholder-header">
          <button className="back-btn" onClick={handleHomeClick}>← Về trang chủ</button>
          <h2>{currentFilter?.name}</h2>
        </div>
        <p>Chức năng đang được phát triển...</p>
      </div>
    );
  };

  return (
    <div className="App">
      <Header
        onHomeClick={handleHomeClick}
        onTopicClick={handleTopicClick}
        onGenreClick={handleGenreClick}
        onCountryClick={handleCountryClick}
        onMoviesClick={handleMoviesClick}
        onSeriesClick={handleSeriesClick}
        onActorsClick={handleActorsClick}
        onScheduleClick={handleScheduleClick}
        onMovieClick={handleMovieClick}
      />

      {renderMainContent()}
    </div>
  );
}

export default App;