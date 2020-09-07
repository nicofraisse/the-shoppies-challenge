import React, { Component } from 'react';
import classes from './Movie.module.css';

class Movie extends Component {
  render() {
    return (
      <div className={[classes.Movie, this.props.small ? classes.SmallMovie : ''].join(' ')}>
        <img src={this.props.movie.Poster} alt={this.props.movie.Title + " poster"} />
        <div className={classes.MovieInfo}>
          <h3>{this.props.movie.Title}</h3>
          <span>{this.props.movie.Year}</span>
          <button onClick={this.props.clicked} disabled={this.props.disabled}>
            {this.props.added ? "Remove" : "Nominate"}
          </button>
        </div>
      </div>
    )
  }
}

export default Movie;
