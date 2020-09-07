import React, { Component } from 'react';
import classes from './MovieSearch.module.css';
import axios from 'axios';

class MovieSearch extends Component {
  state = {

  }

  handleSearch = (event) => {
    axios.get(`http://www.omdbapi.com/?apikey=d73274da&?t=${event.target.value}`)
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <form>
        <input className="form-control" type="text" placeholder="Search..." onChange={this.handleSearch} />
      </form>
    )
  }
}

export default MovieSearch;
