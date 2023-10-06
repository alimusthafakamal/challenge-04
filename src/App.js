import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Movie from "./components/Movie";
import Youtube from "react-youtube";
import { Button, Navbar } from "react-bootstrap";
import Routes from "./routes";
import { Link } from "react-router-dom";

function App() {
  const MOVIE_API = "https://api.themoviedb.org/3/";
  const SEARCH_API = MOVIE_API + "search/movie";
  const DISCOVER_API = MOVIE_API + "discover/movie";
  const API_KEY = "55b519b04e81752b3189d43e79ed1d14";
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

  const [playing, setPlaying] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [movie, setMovie] = useState({ title: "Loading Movies" });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const { data } = await axios.get(
      `${searchKey ? SEARCH_API : DISCOVER_API}`,
      {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      }
    );

    console.log(data.results[0]);
    setMovies(data.results);
    setMovie(data.results[0]);

    if (data.results.length) {
      await fetchMovie(data.results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    setMovie(data);
  };

  const selectMovie = (movie) => {
    fetchMovie(movie.id);
    setPlaying(false);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  const renderMovies = () =>
    movies.map((movie) => (
      <Movie selectMovie={selectMovie} key={movie.id} movie={movie} />
    ));

  const loginButtonStyle = {
    backgroundColor: "Transparent",
    color: "red",
    borderRadius: "25px",
    borderColor: "red",
    marginright: "10px",
  };
  const registerButtonStyle = {
    backgroundColor: "red",
    color: "white",
    borderRadius: "25px",
    border: "none",
    marginLeft: "10px",
  };
  const navGap = {
    gap: "8px",
  };

  return (
    <div className="App">
      <header>
        <Navbar
          className="navbar center-max-size header"
          bg="trasnparent navbar-expand-lg fixed-top p-2"
        >
          <Link to="/" className={"brand"}>Movielist</Link>
          <form className="form" onSubmit={fetchMovies}>
            <input
              placeholder="What do you want to watch"
              className="search"
              type="text"
              id="search"
              onInput={(event) => setSearchKey(event.target.value)}
            />
            <button className="submit-search" type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
          <div>
            <Button href="" style={loginButtonStyle}>
              Login
            </Button>
            <Button href="" style={registerButtonStyle}>
              Register
            </Button>
          </div>
        </Navbar>
      </header>
      {movies.length ? (
        <main>
          {movie ? (
            <div
              className="poster"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
              }}
            >
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className={"youtube amru"}
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button
                    onClick={() => setPlaying(false)}
                    className={"button close-video"}
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="center-max-size">
                  <div className="poster-content">
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                    {trailer ? (
                      <Button
                        style={registerButtonStyle}
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        <i icon="fa-thin fa-caret-right"></i>
                        WATCH TRAILER{" "}
                      </Button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className={"center-max-size container"}>{renderMovies()}</div>
        </main>
      ) : (
        "Sorry, no movies found"
      )}

      <Routes />
    </div>
  );
}

export default App;
