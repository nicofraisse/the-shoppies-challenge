import React, { Component } from 'react';
import classes from './Movie.module.css';

class Movie extends Component {
  render() {
    return (
      <div>
        {this.props.movie.Title} ({this.props.movie.Year})
        <button onClick={this.props.clicked} disabled={this.props.disabled}>
          {this.props.added ? "Remove" : "Nominate"}
        </button>
      </div>
    )
  }
}

export default Movie;
