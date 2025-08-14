import React from 'react';
import './Pagination.css';

const Pagination = ({
    currentPage,
    totalPages,
    isLoading,
    onPageClick
}) => {
    const handlePageClick = (page) => {
        if (page === currentPage || isLoading || page < 1 || page > totalPages) {
            return;
        }
        onPageClick(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Show 5 page numbers at most

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="page-number"
                    onClick={() => handlePageClick(1)}
                    disabled={isLoading}
                >
                    1
                </button>
            );

            if (startPage > 2) {
                pages.push(
                    <span key="start-ellipsis" className="page-dots">...</span>
                );
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`page-number ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageClick(i)}
                    disabled={isLoading || i === currentPage}
                >
                    {i}
                </button>
            );
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="end-ellipsis" className="page-dots">...</span>
                );
            }

            pages.push(
                <button
                    key={totalPages}
                    className="page-number"
                    onClick={() => handlePageClick(totalPages)}
                    disabled={isLoading}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <button
                className="pagination-btn"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
            >
                ← Trang trước
            </button>

            <div className="pagination-info">
                <div className="page-numbers">
                    {renderPageNumbers()}
                </div>

                <span className="page-info">
                    Trang {currentPage} / {totalPages}
                </span>
            </div>

            <button
                className="pagination-btn"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
            >
                Trang sau →
            </button>
        </div>
    );
};

export default Pagination;