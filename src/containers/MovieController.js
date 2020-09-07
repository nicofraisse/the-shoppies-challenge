import React, { Component } from 'react';
import Aux from '../hoc/Aux';
import MovieSearch from './MovieSearch/MovieSearch';
import MovieShow from './MovieShow/MovieShow';
import MovieNominations from './MovieNominations/MovieNominations';
import Movie from './Movie/Movie'
import classes from './MovieController.module.css';
import axios from 'axios'

class MovieController extends Component {
  state = {
    searchedMovies: [],
    nominatedMovies: [],
    currentInput: '',
    searchedLoading: false,
    nominatedLoading: true,
    searchError: ''
  }

  componentDidMount() {
    axios.get('https://the-shoppies-challenge.firebaseio.com/nominations.json')
      .then(res => {
        if (res.data) {
          this.setState({
            nominatedMovies: Object.keys(res.data).map(key => res.data[key]),
          })
        }
        this.setState({nominatedLoading: false})
      })
      .catch(err => console.log(err))
  }

  handleSearch = (event) => {
    this.setState({
      currentInput: event.target.value,
      searchedLoading: true
    })
    axios.get(`http://www.omdbapi.com/?s=${event.target.value}&type=movie&apikey=d73274da`)
      .then(response => {
        if (response.data.Response !== 'False') {
          this.setState({
            searchedMovies: response.data.Search.slice(0, 10),
            searchedLoading: false,
            searchError: ''
          })
          console.log(response.data)
        }
        else {
          this.setState({
            searchedMovies: [],
            searchedLoading: false,
            searchError: response.data.Error
          })
          console.log(response.data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  addMovieHandler = (movie) => {
    const prevNominatedMovies = [...this.state.nominatedMovies]

    // For retrieving the saved movies in the same order
    const timestampedMovie = {
      movie: movie,
      dateAdded: new Date()
    }
    this.setState({
      nominatedMovies: prevNominatedMovies.concat(timestampedMovie)
    }, () => {
      axios.post('https://the-shoppies-challenge.firebaseio.com/nominations.json', timestampedMovie)
        // .then(res => console.log(res))
        .catch(err => console.log(err));
    })
  }

  removeMovieHandler = (id) => {
    const prevNominatedMovies = [...this.state.nominatedMovies]
    const newNominatedMovies = prevNominatedMovies.filter(movie => movie.movie.imdbID != id)
    this.setState({
      nominatedMovies: newNominatedMovies
    }, () => {
      // Delete all movies from firebase
      axios.delete('https://the-shoppies-challenge.firebaseio.com/nominations.json')
        .then(res => {
          // Repost all movies except the deleted one to firebase
          axios.all([
            newNominatedMovies.map((movie) => {
              axios.post('https://the-shoppies-challenge.firebaseio.com/nominations.json', movie)
                // .then(res => console.log(res))
                .catch(err => console.log(err));
            })
          ])
        })
        .catch(err => console.log(err))
    })
  }

  render() {
    const isAlreadyNominated = (movie) => {
      let nominated = false;
      for (let m of this.state.nominatedMovies) {
        if (m.movie.imdbID == movie.imdbID) {
          nominated = true;
        }
      }
      return nominated;
    }
    const currentShowedMovies = this.state.searchedMovies.map((movie) => {
      return <Movie
              movie={movie}
              key={movie.imdbID}
              disabled={isAlreadyNominated(movie) || this.state.nominatedMovies.length >= 5}
              clicked={() => this.addMovieHandler(movie)} />
    });

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
          <h2>Nominations ({this.state.nominatedMovies.length}/5)</h2>
          { this.state.nominatedLoading ? <p>Loading...</p>
            :
            <div>
              {currentNominatedMovies}
            </div>
          }
          <div style={{display: this.state.nominatedMovies.length >= 5 ? 'block' : 'none'}}>Congrats!</div>
        </div>
      </div>
    )
  }
}

export default MovieController;
