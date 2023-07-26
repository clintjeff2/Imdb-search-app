import { useState, useEffect } from 'react';

const KEY = '522d8e66';

function useMovies(query, callback) {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  

  useEffect(() => {

    async function fetchMovies() {
      try{
//clearing an api search using an abort controller(this is a browser api) by creating one as the first step
        const controller = new AbortController();

        setIsLoading(true);
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal});

        if(!res.ok) {
          throw new Error('Something went wrong with fetching movies')
        }

        const data = await res.json();
        if(data.Response === "False") {
          throw new Error ('Movie not found');
        }
        setMovies(data.Search);
        
        // console.log(data);
        return function() {
          controller.abort();
        }
      }catch(err) {
        setError(err.message)
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    }

    if(!query.length){
      setMovies([]);
      setError('');

      return; 
    }
    callback?.(); //conditional rendering just like movie?.name, for functions we have handleSomething?.();
    // handleCloseMovie();
    fetchMovies();
  }, [query]);


  return {movies, isLoading, error};
}

export { useMovies };