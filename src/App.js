import { useEffect, useRef, useState } from "react";
import { useMovies } from './useMovies';
import './index.css';
import StarRating from './StarRating';
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = '522d8e66';
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({children}) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}
function NumResults ({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
  </div>
  )
}

function Search ({query, setQuery}) {

  const search = useRef();
  
  useKey('Enter', function focusSearch() {
    if(document.activeElement === search.current) return;
    setQuery('');
    return search.current.focus()
  });

  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    ref={search}
  />
  )
}

function Main({children}) {
  return (
    <main className="main">
      {children}
    </main>
  )

}

function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  )
}

function MovieList({movies, onSelectMovie}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />))}
    </ul>
  )
}

function Movie ({movie, onSelectMovie}) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function WatchedMoviesList({watched, onDeleteMovie}) {
  return (
    <ul className="list">
    {watched.map((movie) => (<WatchedMovie movie={movie} key={movie.imdbID} onDeleteMovie={onDeleteMovie} />))}
  </ul>
  )
}

function WatchedMovie ({movie, onDeleteMovie}){
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={() => onDeleteMovie(movie.imdbID)}>
          X
        </button>

      </div>
    </li>
  )
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (children )}
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState("");
  // const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null)


  const {movies, isLoading, error} = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");




  
  function handleCloseMovie() {
    setSelectedId(null);
    // document.title = 'usePopcorn';
  }

  useKey('Escape', handleCloseMovie);


  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId? null: id); 
  }


  function handleAddWatched (movie) {
    setWatched(watched => [...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));

  }

  function handleDeleteWatched (id) {
    setWatched(watched => watched.filter(el => el.imdbID !== id ));
  }
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader /> }
          {
            !isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>
            // isLoading? <Loader />: <MovieList movies={movies} />
          }
          {error && <ErrorMessage message={error} /> }
        </Box>
        <Box>
          { 
            selectedId ? 
            <SelectedMovie 
              selectedId={selectedId} 
              onCloseMovie={handleCloseMovie} 
              onAddWatched={handleAddWatched}
              watched={watched}
              
            /> :
            <>
              <WatchedSummary  watched ={watched} />
              <WatchedMoviesList watched={watched} onDeleteMovie={handleDeleteWatched} />
            </>

          }
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({message}) {
  return (
    <p className="error">
      <span>❌ </span>
      {message}
    </p>
  )
}



function SelectedMovie({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [isLoading, setIsLoading] = useState(false)
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState('');
  const {Title: title, Year: year, Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre, Poster:poster } = movie;
  
  const countRef = useRef(0);

  useEffect(() => {
    if(userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  useEffect(() => {
    const loadMovie = async () => {
      setIsLoading(true)
      const movie = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await movie.json();

      setMovie(data);
      console.log(data)
      setIsLoading(false)
    }
    loadMovie();

  }, [selectedId]);

  useEffect(() => {
    if(!title) return;
    document.title = title;
    return function () {
      document.title = 'usePopcorn';
      console.log(`Clean up effect for movie ${title}`);
    }
  }, [title]);



  const handleAdd = () => {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    onAddWatched(newMovie);
    onCloseMovie();
  }
  let defaultRating = 0;
  const handleDefaultRating = () => {
    const isOnWatchlist = watched.find(el => el.imdbID === selectedId);
    if(isOnWatchlist) defaultRating = isOnWatchlist.userRating;
  }
  handleDefaultRating();


  return(
    <div className="details">
      {
        isLoading ?  <Loader /> :
        <>
          <header>
  
            <button className="btn-back" onClick={onCloseMovie} >
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>
                  🌟
                </span>
                {imdbRating} IMDb rating
              </p>
  
            </div>
          </header>
          
          <section>
            <div className="rating">
              {              
                defaultRating === 0 &&
                <StarRating 
                  maxRating={10} 
                  size={24} 
                  key={selectedId} 
                  onSetRating={setUserRating }
                  defaultRating={defaultRating}
                />
              }
              

              {
                userRating > 0 &&
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              }

              {defaultRating !== 0 && <p>You rated this movie { defaultRating } / 10</p> }

            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors} </p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>
  )
}

function Loader() {
  return (
    <p className="loader">
      Loading...
    </p>
  )
}