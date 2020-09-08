import React, { Component } from 'react';
import Movie from '../components/Movie/Movie';
import classes from './MovieController.module.css';
import Banner from '../components/Banner/Banner';
import axios from 'axios';

class MovieController extends Component {
  state = {
    searchedMovies: [],
    nominatedMovies: [],
    currentInput: '',
    searchedLoading: false,
    nominatedLoading: true,
    searchError: '',
    bannerShowing: false
  }

  // Retrieve the nominated movies from firebase when the component has mounted
  componentDidMount() {
    axios.get('https://the-shoppies-challenge.firebaseio.com/nominations.json')
      .then(response => {
        if (response.data) {
          this.setState({
            nominatedMovies: Object.keys(response.data).map(key => response.data[key]),
          })
        }
        this.setState({nominatedLoading: false});
      })
      .catch(err => console.log(err));
  }

  // Search on omdbapi when user types in the form
  // Update the loading state as well as the error state, for special cases
  handleSearch = (event) => {
    this.setState({
      currentInput: event.target.value,
      searchedLoading: true
    })
    axios.get(`https://www.omdbapi.com/?s=${event.target.value}&type=movie&apikey=d73274da`)
      .then(response => {
        if (response.data.Response !== 'False') {
          this.setState({
            searchedMovies: response.data.Search.slice(0, 10),
            searchedLoading: false,
            searchError: ''
          });
        }
        else {
          this.setState({
            searchedMovies: [],
            searchedLoading: false,
            searchError: response.data.Error
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  addMovieHandler = (movie) => {
    const prevNominatedMovies = [...this.state.nominatedMovies];

    // For retrieving the saved movies in the same order
    const timestampedMovie = {
      movie: movie,
      dateAdded: new Date()
    }

    // Right after changing the state, to take into account the new nominated movie,
    // post the new movie data to firebase, and show a banner if there are 5 nominated movies.
    this.setState({
      nominatedMovies: prevNominatedMovies.concat(timestampedMovie)
    }, () => {
      axios.post('https://the-shoppies-challenge.firebaseio.com/nominations.json', timestampedMovie)
        .catch(err => console.log(err));
      if (this.state.nominatedMovies.length >= 5) {
        this.setState({bannerShowing: true});
      }
    });
  }

  removeMovieHandler = (id) => {
    const prevNominatedMovies = [...this.state.nominatedMovies];
    const newNominatedMovies = prevNominatedMovies.filter(movie => movie.movie.imdbID !== id);
    this.setState({
      nominatedMovies: newNominatedMovies
    }, () => {
      // Delete all movies from firebase
      axios.delete('https://the-shoppies-challenge.firebaseio.com/nominations.json')
        .then(res => {
          // Repost all movies except the deleted one to firebase
          axios.all([
            newNominatedMovies.map((movie) => {
              return (
                axios.post('https://the-shoppies-challenge.firebaseio.com/nominations.json', movie)
                  .catch(err => console.log(err));
              );
            })
          ])
        })
        .catch(err => console.log(err));
    });
  }

  // Remove the modal banner when the user clicks anywhere on the screen
  bannerClickedHandler = () => {
    this.setState({
      bannerShowing: false
    });
  }

  render() {
    // Function to check if a movie has already been nominated
    const isAlreadyNominated = (movie) => {
      let nominated = false;
      for (let m of this.state.nominatedMovies) {
        if (m.movie.imdbID === movie.imdbID) {
          nominated = true;
        }
      }
      return nominated;
    }

    // Generate an array of Movie components to be shown when user searches
    const currentShowedMovies = this.state.searchedMovies.map((movie) => {
      return <Movie
              movie={movie}
              key={movie.imdbID}
              disabled={isAlreadyNominated(movie) || this.state.nominatedMovies.length >= 5}
              clicked={() => this.addMovieHandler(movie)} />
    });

    // Genereate an array of nominated Movie components
    const currentNominatedMovies = this.state.nominatedMovies.map((m) => {
      return <Movie
              movie={m.movie}
              added
              small
              key={m.movie.imdbID}
              disabled={false}
              clicked={() => this.removeMovieHandler(m.movie.imdbID)} />
    });

    return (
      <div className={classes.MovieController}>
        <div className={[classes.SearchSection, classes.Section].join(' ')}>
          <h1><i className="fas fa-video"></i><span>SHOPPIES CHALLENGE</span></h1>
          <form>
            <input className="form-control" type="text" placeholder="Search..." onChange={this.handleSearch} />
          </form>

          <div className={classes.MoviesShow}>
            {
              this.state.currentInput ? <h2>Results for "{this.state.currentInput}"</h2>
              : <h2>Search for movies!</h2>
            }
            {
              this.state.searchError && this.state.searchError !== "Incorrect IMDb ID." ? <p>{this.state.searchError}</p>
              :
              <div className={classes.MovieGrid}>
                {currentShowedMovies}
              </div>
            }
          </div>
        </div>

        <div className={[classes.NominationsSection, classes.Section].join(' ')}>
          <h1 className="d-none-md"><i className="fas fa-video"></i><span>SHOPPIES CHALLENGE</span></h1>
          <h2>Nominations ({this.state.nominatedMovies.length}/5)</h2>
          { this.state.nominatedLoading ? <p>Loading...</p>
            :
            <div>
              {currentNominatedMovies}
            </div>
          }
          <Banner
          topMovies={this.state.nominatedMovies}
          clicked={this.bannerClickedHandler}
          show={this.state.bannerShowing}/>
        </div>
      </div>
    );
  }
}

export default MovieController;
