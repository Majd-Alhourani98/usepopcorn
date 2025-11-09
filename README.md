# 🍿 usePopcorn - Movie Search & Rating App

A modern, interactive React application for searching movies, viewing detailed information, and rating your favorite films. Built with React hooks and the OMDb API.

![React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![API](https://img.shields.io/badge/API-OMDb-orange.svg)

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Technologies Used](#technologies-used)
- [Custom Hooks](#custom-hooks)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

**usePopcorn** is a movie search and rating application that allows users to:

- Search for movies using the OMDb API
- View detailed information about movies (plot, cast, director, ratings)
- Rate movies using an interactive star rating system
- Save watched movies to a personal list
- View statistics about watched movies (average ratings, runtime, etc.)
- Persist data using browser localStorage

This project demonstrates modern React development practices, including:
- Custom React hooks
- Component composition
- State management
- API integration
- LocalStorage persistence
- Keyboard shortcuts
- Responsive design

## ✨ Features

### 🔍 Movie Search
- Real-time movie search as you type
- Searches only when query is 3+ characters (reduces API calls)
- Displays movie posters, titles, and release years
- Shows number of search results

### 📺 Movie Details
- Comprehensive movie information:
  - Poster image
  - Title, year, genre
  - IMDb rating
  - Plot summary
  - Cast and crew information
- Interactive star rating system (1-10 stars)
- Add movies to your watched list
- Keyboard shortcut: Press `Escape` to close movie details

### ⭐ Rating System
- Interactive star rating component
- Hover effects for better UX
- Rate movies from 1 to 10 stars
- View your previous ratings

### 📊 Watched Movies
- Personal list of watched movies
- Statistics dashboard showing:
  - Total number of movies watched
  - Average IMDb rating
  - Average user rating
  - Average runtime
- Delete movies from your list
- Data persists across page refreshes (localStorage)

### ⌨️ Keyboard Shortcuts
- `Enter` - Focus search input and clear it
- `Escape` - Close movie details view

### 🎨 User Interface
- Modern, dark theme design
- Collapsible sections
- Loading states
- Error handling
- Responsive layout

## 📸 Screenshots

*Add screenshots of your application here*

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/usepopcorn.git
   cd usepopcorn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get an OMDb API Key** (optional, but recommended)
   - Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
   - Get a free API key
   - Replace the API key in `src/App.js` and `src/useMovies.js`:
     ```javascript
     const key = "YOUR_API_KEY_HERE";
     ```
   - Note: The app includes a demo API key, but it may have rate limits

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - The app will automatically open at [http://localhost:3000](http://localhost:3000)
   - If it doesn't open automatically, navigate to the URL manually

### Build for Production

To create a production build:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
usepopcorn/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   ├── index.css           # Global styles
│   ├── StarRating.js       # Star rating component
│   ├── useMovies.js        # Custom hook for movie search
│   ├── useLocalStorage.js  # Custom hook for localStorage
│   └── useKey.js           # Custom hook for keyboard events
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## 🔧 How It Works

### Application Flow

1. **Search**: User types in the search box
   - Query triggers `useMovies` hook
   - Hook fetches movies from OMDb API
   - Results are displayed in the left panel

2. **Select Movie**: User clicks on a movie
   - Movie ID is stored in state
   - `MovieDetails` component fetches full movie details
   - Movie details are displayed in the right panel

3. **Rate Movie**: User rates the movie using stars
   - Rating is stored in component state
   - User clicks "Add to list" button
   - Movie is added to watched list (stored in localStorage)

4. **View Statistics**: User views watched movies
   - Watched movies are loaded from localStorage
   - Statistics are calculated and displayed
   - User can delete movies from the list

### State Management

The application uses React's built-in state management:

- **Search Query**: Controlled input that triggers API calls
- **Selected Movie**: Tracks which movie is currently being viewed
- **Watched Movies**: Array of movies stored in localStorage
- **Loading States**: Tracks API call status
- **Error States**: Stores error messages from API calls

### Data Persistence

- Watched movies are stored in `localStorage`
- Data persists across page refreshes
- Uses the `useLocalStorage` custom hook for seamless synchronization

## 💻 Technologies Used

- **React 19.2.0** - UI library
- **React DOM** - DOM rendering
- **JavaScript (ES6+)** - Programming language
- **OMDb API** - Movie database API
- **CSS3** - Styling
- **Create React App** - Build tooling

## 🎣 Custom Hooks

### `useMovies(query, callback)`

Custom hook for fetching movies from the OMDb API.

**Parameters:**
- `query` (string): Search query
- `callback` (function, optional): Function to execute when query changes

**Returns:**
- `movies` (array): Array of movie objects
- `isLoading` (boolean): Loading state
- `error` (string): Error message

**Features:**
- Debounced search (only searches when query is 3+ characters)
- Request cancellation (prevents race conditions)
- Error handling
- Loading state management

### `useLocalStorage(initialState, key)`

Custom hook for synchronizing state with localStorage.

**Parameters:**
- `initialState` (any): Default value if localStorage is empty
- `key` (string): localStorage key

**Returns:**
- `[value, setValue]`: Same API as `useState`

**Features:**
- Automatic synchronization with localStorage
- Persists data across page refreshes
- Handles JSON serialization/deserialization

### `useKey(key, action)`

Custom hook for keyboard event handling.

**Parameters:**
- `key` (string): Key code to listen for (e.g., "Enter", "Escape")
- `action` (function): Function to execute when key is pressed

**Features:**
- Automatic event listener cleanup
- Case-insensitive key matching
- Global keyboard shortcuts

## 📖 Usage

### Searching for Movies

1. Type in the search box (minimum 3 characters)
2. Movies matching your query will appear in the left panel
3. Click on a movie to view details

### Rating a Movie

1. Click on a movie to view its details
2. Hover over the stars to preview your rating
3. Click on a star to set your rating (1-10)
4. Click "Add to list" to save the movie with your rating

### Managing Watched Movies

- View your watched movies in the right panel
- See statistics about your watched movies
- Delete movies by clicking the "x" button
- Your list persists across page refreshes

### Keyboard Shortcuts

- Press `Enter` to focus the search input
- Press `Escape` to close movie details

## 🔌 API

This application uses the [OMDb API](http://www.omdbapi.com/) to fetch movie data.

### API Endpoints Used

1. **Search Movies**: `http://www.omdbapi.com/?apikey={key}&s={query}`
   - Searches for movies by title
   - Returns array of movie objects

2. **Get Movie Details**: `http://www.omdbapi.com/?apikey={key}&i={id}`
   - Fetches detailed information about a specific movie
   - Returns full movie object with plot, cast, etc.

### Getting an API Key

1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free API key
3. Replace the API key in the code (see Installation section)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing movie data
- [React](https://reactjs.org/) for the amazing framework
- [Create React App](https://create-react-app.dev/) for the build tooling

## 📧 Contact

If you have any questions or suggestions, please feel free to open an issue or contact the maintainer.

---

**Made with ❤️ using React**

Happy movie searching! 🍿🎬
