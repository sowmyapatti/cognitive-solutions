import React, { useState, useCallback } from 'react';
import BookCard from './components/BookCard';

/**
 * Main App component for the Book Finder application
 * Handles search functionality, API calls, and displays results
 */
function App() {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title', 'author', 'subject'
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  
  // New state for enhanced features
  const [bookmarks, setBookmarks] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [filters, setFilters] = useState({
    yearFrom: '',
    yearTo: '',
    language: '',
    subject: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Fetches books from Open Library API with enhanced search options
   * @param {string} query - Search query
   * @param {string} type - Search type ('title', 'author', 'subject')
   * @param {number} page - Page number for pagination
   * @param {boolean} append - Whether to append results to existing books
   */
  const fetchBooks = useCallback(async (query, type, page = 1, append = false) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Construct API URL based on search type and filters
      let searchParam = type === 'author' ? 'author' : type === 'subject' ? 'subject' : 'title';
      let apiUrl = `https://openlibrary.org/search.json?${searchParam}=${encodeURIComponent(query)}&page=${page}&limit=12`;
      
      // Add filters to API URL
      if (filters.yearFrom) apiUrl += `&first_publish_year[from]=${filters.yearFrom}`;
      if (filters.yearTo) apiUrl += `&first_publish_year[to]=${filters.yearTo}`;
      if (filters.language) apiUrl += `&language=${filters.language}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        const newBooks = data.docs;
        setBooks(prevBooks => append ? [...prevBooks, ...newBooks] : newBooks);
        setHasMoreResults(data.docs.length === 12);
        setCurrentPage(page);
      } else {
        if (!append) {
          setBooks([]);
        }
        setHasMoreResults(false);
      }
    } catch (err) {
      setError(`Failed to fetch books: ${err.message}`);
      if (!append) {
        setBooks([]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Handles search form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage(1);
      fetchBooks(searchQuery, searchType, 1, false);
    }
  };

  /**
   * Handles "Load More" button click for pagination
   */
  const handleLoadMore = () => {
    if (hasMoreResults && !loading) {
      fetchBooks(searchQuery, searchType, currentPage + 1, true);
    }
  };

  /**
   * Handles search type change
   */
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setBooks([]);
    setCurrentPage(1);
    setHasMoreResults(false);
  };

  /**
   * Bookmark management functions
   */
  const toggleBookmark = (book) => {
    const bookId = book.key || book.title;
    setBookmarks(prev => {
      const isBookmarked = prev.some(b => (b.key || b.title) === bookId);
      if (isBookmarked) {
        return prev.filter(b => (b.key || b.title) !== bookId);
      } else {
        return [...prev, book];
      }
    });
  };

  const addToReadingList = (book) => {
    const bookId = book.key || book.title;
    setReadingList(prev => {
      const isInList = prev.some(b => (b.key || b.title) === bookId);
      if (!isInList) {
        return [...prev, { ...book, addedDate: new Date().toISOString() }];
      }
      return prev;
    });
  };

  const removeFromReadingList = (bookId) => {
    setReadingList(prev => prev.filter(b => (b.key || b.title) !== bookId));
  };

  /**
   * Show book details modal
   */
  const showBookModal = (book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  /**
   * Filter management
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      yearFrom: '',
      yearTo: '',
      language: '',
      subject: ''
    });
  };

  /**
   * Quick search suggestions for college students
   */
  const quickSearchSuggestions = [
    { type: 'subject', query: 'computer science', label: 'Computer Science' },
    { type: 'subject', query: 'mathematics', label: 'Mathematics' },
    { type: 'subject', query: 'psychology', label: 'Psychology' },
    { type: 'subject', query: 'literature', label: 'Literature' },
    { type: 'subject', query: 'history', label: 'History' },
    { type: 'author', query: 'Stephen King', label: 'Stephen King' },
    { type: 'title', query: '1984', label: '1984 by Orwell' },
    { type: 'title', query: 'Harry Potter', label: 'Harry Potter Series' }
  ];

  const handleQuickSearch = (suggestion) => {
    setSearchType(suggestion.type);
    setSearchQuery(suggestion.query);
    setCurrentPage(1);
    fetchBooks(suggestion.query, suggestion.type, 1, false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowBookDetails(false)}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200"
              >
                🔍 Search
              </button>
              <button 
                onClick={() => setShowBookDetails('bookmarks')}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <span>🔖</span>
                <span>Bookmarks ({bookmarks.length})</span>
              </button>
              <button 
                onClick={() => setShowBookDetails('reading-list')}
                className="text-white/90 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <span>📖</span>
                <span>Reading List ({readingList.length})</span>
              </button>
            </div>
          </nav>
          
          <div className="text-center animate-fadeInUp">
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              📚 Book Finder
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your personal library assistant for academic and leisure reading
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-24 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white/10"></div>
      </header>

      {/* Search Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-large p-8 mb-8 border border-white/20">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Selection */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label htmlFor="searchType" className="block text-sm font-semibold text-gray-700 mb-3">
                  Search by:
                </label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                >
                  <option value="title">📖 Book Title</option>
                  <option value="author">✍️ Author Name</option>
                  <option value="subject">🎓 Subject/Topic</option>
                </select>
              </div>
              
              <div className="flex-2">
                <label htmlFor="searchQuery" className="block text-sm font-semibold text-gray-700 mb-3">
                  {searchType === 'title' ? '📖 Book Title' : searchType === 'author' ? '✍️ Author Name' : '🎓 Subject/Topic'}:
                </label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'title' ? 'Enter book title...' : searchType === 'author' ? 'Enter author name...' : 'Enter subject (e.g., computer science, psychology)...'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">🔧 Advanced Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Year</label>
                    <input
                      type="number"
                      value={filters.yearFrom}
                      onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                      placeholder="e.g., 2000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Year</label>
                    <input
                      type="number"
                      value={filters.yearTo}
                      onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                      placeholder="e.g., 2023"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any Language</option>
                      <option value="eng">English</option>
                      <option value="spa">Spanish</option>
                      <option value="fre">French</option>
                      <option value="ger">German</option>
                      <option value="ita">Italian</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Search Suggestions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">⚡ Quick Search</h3>
              <div className="flex flex-wrap gap-2">
                {quickSearchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickSearch(suggestion)}
                    className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium hover:from-primary-200 hover:to-secondary-200 transition-all duration-200 transform hover:scale-105"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl shadow-large hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      🔍 Search Books
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-soft animate-fadeInUp">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
                <div className="mt-2 text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {books.length > 0 && (
          <div className="mb-8 animate-fadeInUp">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                📚 Search Results
              </h2>
              <p className="text-lg text-gray-600">
                Found <span className="font-semibold text-primary-600">{books.length}</span> amazing books
              </p>
            </div>
            
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
                <div key={`${book.key || book.title}-${index}`} className="animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                  <BookCard 
                    book={book} 
                    onBookmark={toggleBookmark}
                    onAddToReadingList={addToReadingList}
                    onShowDetails={showBookModal}
                    bookmarks={bookmarks}
                    readingList={readingList}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreResults && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="group relative px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl shadow-large hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        📖 Load More Books
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results Message */}
        {!loading && books.length === 0 && searchQuery && !error && (
          <div className="text-center py-16 animate-fadeInUp">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-large border border-white/20 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No books found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any books matching your search. Try different keywords or check your spelling.
              </p>
              <div className="text-sm text-gray-500">
                💡 Try searching for: "Harry Potter", "1984", or "Stephen King"
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!loading && books.length === 0 && !searchQuery && (
          <div className="text-center py-16 animate-fadeInUp">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-large border border-white/20 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">Welcome to Book Finder!</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Discover your next favorite book using our powerful search engine powered by Open Library.
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <span>🔍</span>
                  <span>Search by book title or author name</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📖</span>
                  <span>Browse beautiful book covers and details</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>⚡</span>
                  <span>Get instant results with our fast search</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookmarks View */}
        {showBookDetails === 'bookmarks' && (
          <div className="mb-8 animate-fadeInUp">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                🔖 My Bookmarks
              </h2>
              <p className="text-lg text-gray-600">
                {bookmarks.length > 0 ? `${bookmarks.length} saved books` : 'No bookmarks yet'}
              </p>
            </div>
            
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {bookmarks.map((book, index) => (
                  <div key={`bookmark-${book.key || book.title}-${index}`} className="animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <BookCard 
                      book={book} 
                      onBookmark={toggleBookmark}
                      onAddToReadingList={addToReadingList}
                      onShowDetails={showBookModal}
                      bookmarks={bookmarks}
                      readingList={readingList}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-large border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🔖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No bookmarks yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start bookmarking books you want to read later by clicking the bookmark icon on any book card.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reading List View */}
        {showBookDetails === 'reading-list' && (
          <div className="mb-8 animate-fadeInUp">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                📖 My Reading List
              </h2>
              <p className="text-lg text-gray-600">
                {readingList.length > 0 ? `${readingList.length} books to read` : 'No books in reading list yet'}
              </p>
            </div>
            
            {readingList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {readingList.map((book, index) => (
                  <div key={`reading-${book.key || book.title}-${index}`} className="animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="relative">
                      <BookCard 
                        book={book} 
                        onBookmark={toggleBookmark}
                        onAddToReadingList={addToReadingList}
                        onShowDetails={showBookModal}
                        bookmarks={bookmarks}
                        readingList={readingList}
                      />
                      <button
                        onClick={() => removeFromReadingList(book.key || book.title)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                        title="Remove from reading list"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-large border border-white/20 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No books in reading list</h3>
                  <p className="text-gray-600 mb-6">
                    Add books to your reading list by clicking the reading list icon on any book card.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              Made with ❤️ for book lovers everywhere
            </p>
            <p className="text-gray-500 text-xs">
              Powered by{' '}
              <a 
                href="https://openlibrary.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Open Library
              </a>
              {' '}• Built with React & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
