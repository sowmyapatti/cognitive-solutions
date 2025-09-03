import React from 'react';

/**
 * BookCard component displays individual book information in a card format
 * @param {Object} book - Book object containing title, author, publish year, and cover
 * @param {Function} onBookmark - Function to handle bookmarking
 * @param {Function} onAddToReadingList - Function to add to reading list
 * @param {Function} onShowDetails - Function to show book details
 * @param {Array} bookmarks - Array of bookmarked books
 * @param {Array} readingList - Array of books in reading list
 */
const BookCard = ({ book, onBookmark, onAddToReadingList, onShowDetails, bookmarks = [], readingList = [] }) => {
  // Extract book information with fallbacks
  const title = book.title || 'Unknown Title';
  const authors = book.author_name || ['Unknown Author'];
  const publishYear = book.first_publish_year || 'Unknown Year';
  const coverId = book.cover_i;
  const bookId = book.key || book.title;
  
  // Check if book is bookmarked or in reading list
  const isBookmarked = bookmarks.some(b => (b.key || b.title) === bookId);
  const isInReadingList = readingList.some(b => (b.key || b.title) === bookId);
  
  // Construct cover image URL if cover ID exists
  const coverImageUrl = coverId 
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  return (
    <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden border border-white/20 transform hover:-translate-y-2">
      {/* Book Cover */}
      <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer" onClick={() => onShowDetails && onShowDetails(book)}>
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center text-gray-400 ${coverImageUrl ? 'hidden' : 'flex'}`}
        >
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-500">No Cover</p>
          </div>
        </div>
        
        {/* Action buttons overlay */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark && onBookmark(book);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isBookmarked 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-yellow-500 hover:text-white'
            }`}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            {isBookmarked ? '🔖' : '🔖'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToReadingList && onAddToReadingList(book);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isInReadingList 
                ? 'bg-green-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-green-500 hover:text-white'
            }`}
            title={isInReadingList ? 'In reading list' : 'Add to reading list'}
          >
            {isInReadingList ? '📖' : '📖'}
          </button>
        </div>
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Book Information */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Author</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {Array.isArray(authors) ? authors.join(', ') : authors}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">Published</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">{publishYear}</p>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-400">📖</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
