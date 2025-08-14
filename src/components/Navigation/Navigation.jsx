import React, { useState, useRef, useEffect } from 'react';
import { topicsData, genreMap, countriesData } from '../../utils/constants';
import './Navigation.css';

const Navigation = ({
    onTopicClick,
    onGenreClick,
    onCountryClick,
    onMoviesClick,
    onSeriesClick,
    onActorsClick,
    onScheduleClick
}) => {
    const [showTopicDropdown, setShowTopicDropdown] = useState(false);
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const topicRef = useRef(null);
    const genreRef = useRef(null);
    const countryRef = useRef(null);

    const toggleTopicDropdown = () => {
        setShowTopicDropdown(!showTopicDropdown);
        setShowGenreDropdown(false);
        setShowCountryDropdown(false);
    };

    const toggleGenreDropdown = () => {
        setShowGenreDropdown(!showGenreDropdown);
        setShowTopicDropdown(false);
        setShowCountryDropdown(false);
    };

    const toggleCountryDropdown = () => {
        setShowCountryDropdown(!showCountryDropdown);
        setShowTopicDropdown(false);
        setShowGenreDropdown(false);
    };

    const handleTopicClick = (topic) => {
        onTopicClick(topic);
        setShowTopicDropdown(false);
    };

    const handleGenreClick = (genreId) => {
        onGenreClick(genreId);
        setShowGenreDropdown(false);
    };

    const handleCountryClick = (countryCode) => {
        onCountryClick(countryCode);
        setShowCountryDropdown(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (topicRef.current && !topicRef.current.contains(event.target)) {
                setShowTopicDropdown(false);
            }
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setShowGenreDropdown(false);
            }
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navigation-container">
            {/* Topics Dropdown */}
            <div className="nav-dropdown" ref={topicRef}>
                <button className="nav-btn topic-btn" onClick={toggleTopicDropdown}>
                    Chủ đề {showTopicDropdown ? '▲' : '▼'}
                </button>
                {showTopicDropdown && (
                    <div className="dropdown-menu">
                        {topicsData.map((topic) => (
                            <div
                                key={topic.id}
                                className="dropdown-item"
                                onClick={() => handleTopicClick(topic)}
                            >
                                {topic.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Genres Dropdown */}
            <div className="nav-dropdown" ref={genreRef}>
                <button className="nav-btn genre-btn" onClick={toggleGenreDropdown}>
                    Thể loại {showGenreDropdown ? '▲' : '▼'}
                </button>
                {showGenreDropdown && (
                    <div className="dropdown-menu">
                        {Object.entries(genreMap).map(([id, name]) => (
                            <div
                                key={id}
                                className="dropdown-item"
                                onClick={() => handleGenreClick(id)}
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Countries Dropdown */}
            <div className="nav-dropdown" ref={countryRef}>
                <button className="nav-btn country-btn" onClick={toggleCountryDropdown}>
                    Quốc gia {showCountryDropdown ? '▲' : '▼'}
                </button>
                {showCountryDropdown && (
                    <div className="dropdown-menu">
                        {countriesData.map((country) => (
                            <div
                                key={country.code}
                                className="dropdown-item"
                                onClick={() => handleCountryClick(country.code)}
                            >
                                {country.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Direct Navigation Buttons */}
            <button className="nav-btn movie-btn" onClick={onMoviesClick}>
                Phim lẻ
            </button>
            <button className="nav-btn series-btn" onClick={onSeriesClick}>
                Phim bộ
            </button>
            <button className="nav-btn actor-btn" onClick={onActorsClick}>
                Diễn viên
            </button>
            <button className="nav-btn schedule-btn" onClick={onScheduleClick}>
                Lịch chiếu
            </button>
        </nav>
    );
};

export default Navigation;