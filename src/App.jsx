import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import MovieList from './components/MovieList/MovieList';
import MovieDetail from './components/MovieDetail/MovieDetail';
import FilteredContent from './components/FilteredContent/FilteredContent';
import { VIEW_TYPES, topicsData, countriesData } from './utils/constants';
import {
  fetchHeroMovies,
  fetchKoreaMovies,
  fetchChineseMovies,
  fetchMovieDetails,
  fetchMoviesByGenre,
  fetchMoviesByCountry,
  fetchMoviesByTopic,
  fetchMovies,
  fetchTVSeries
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
        const [heroData, koreaData, chineseData] = await Promise.all([
          fetchHeroMovies(),
          fetchKoreaMovies(),
          fetchChineseMovies()
        ]);

        setHeroMovies(heroData);
        setKoreaMovies(koreaData);
        setChineseMovies(chineseData);
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
  };

  const handleThumbnailClick = (index) => {
    setCurrentHeroMovie(index);
  };

  const handleMovieListNavigation = (type, direction) => {
    if (type === 'korea') {
      const maxIndex = Math.max(0, koreaMovies.length - 3);
      if (direction === 'next') {
        setKoreaCurrentIndex(prev => Math.min(prev + 3, maxIndex));
      } else {
        setKoreaCurrentIndex(prev => Math.max(prev - 3, 0));
      }
    } else if (type === 'chinese') {
      const maxIndex = Math.max(0, chineseMovies.length - 3);
      if (direction === 'next') {
        setChineseCurrentIndex(prev => Math.min(prev + 3, maxIndex));
      } else {
        setChineseCurrentIndex(prev => Math.max(prev - 3, 0));
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

  // Pagination handler
  const handlePaginationClick = async (newPage) => {
    if (newPage < 1 || newPage > totalPages || isLoadingMore) return;

    setCurrentPage(newPage);
    setIsLoadingMore(true);

    try {
      let result;
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

              <div className="topic-list-container">
                <MovieList
                  title="Phim Hàn Quốc mới"
                  movies={koreaMovies}
                  currentIndex={koreaCurrentIndex}
                  onNavigation={handleMovieListNavigation}
                  onMovieClick={handleMovieClick}
                  type="korea"
                />

                <MovieList
                  title="Phim Trung Quốc mới"
                  movies={chineseMovies}
                  currentIndex={chineseCurrentIndex}
                  onNavigation={handleMovieListNavigation}
                  onMovieClick={handleMovieClick}
                  type="chinese"
                />
              </div>
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
          onHomeClick={handleHomeClick}
          onMovieClick={handleMovieClick}
          onPaginationClick={handlePaginationClick}
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