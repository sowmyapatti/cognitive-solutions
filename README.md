# 📚 Book Finder

A modern React web application that allows users to search for books using the Open Library API. Built with React functional components, hooks, and styled with Tailwind CSS.

## ✨ Features

- **Search Functionality**: Search for books by title or author name
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Book Details**: Display title, author(s), first publish year, and cover images
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Pagination**: "Load More" button for additional results
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Cover Images**: Book covers from Open Library with fallback placeholders

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🏗️ Project Structure

```
book-finder/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   └── BookCard.js     # Individual book card component
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## 🔧 How It Works

### API Integration

The app uses the [Open Library Search API](https://openlibrary.org/search.json) to fetch book data:

- **Title Search**: `https://openlibrary.org/search.json?title={bookTitle}`
- **Author Search**: `https://openlibrary.org/search.json?author={authorName}`
- **Cover Images**: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`

### Key Components

1. **App.js**: Main component handling:
   - Search form and state management
   - API calls to Open Library
   - Loading and error states
   - Pagination logic

2. **BookCard.js**: Individual book display component showing:
   - Book cover image (with fallback)
   - Title, authors, and publish year
   - Responsive card layout

### State Management

The app uses React hooks for state management:
- `useState` for local component state
- `useCallback` for optimized API calls
- State includes: search query, books array, loading status, error messages, pagination

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Responsive Grid**: CSS Grid for book card layout (1-4 columns based on screen size)
- **Custom Colors**: Primary blue color scheme with hover effects
- **Loading Animations**: Spinner animations for better UX

## 🚀 Deployment

### CodeSandbox

1. Upload the project files to CodeSandbox
2. The app will automatically start with `npm start`
3. Share the live URL with others

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Netlify

1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Configure redirects for React Router if needed

## 🔍 Usage

1. **Select Search Type**: Choose between "Book Title" or "Author Name"
2. **Enter Search Query**: Type the book title or author name
3. **Click Search**: View results in a responsive grid layout
4. **Load More**: Click "Load More Books" for additional results
5. **View Details**: Each card shows title, author, publish year, and cover image

## 🛡️ Error Handling

The app includes comprehensive error handling:
- Network errors with user-friendly messages
- Missing book data with fallback values
- Image loading errors with placeholder icons
- Empty search results with helpful guidance

## 🎯 Future Enhancements

Potential improvements for future versions:
- Book details modal/page
- Favorites/bookmarking system
- Advanced search filters (genre, year range)
- User authentication and personal libraries
- Book recommendations
- Dark mode toggle

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the Book Finder application.

---

**Happy Reading! 📖**
