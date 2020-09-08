import React from 'react';
import classes from './Movie.module.css';
import Button from '../../components/Button/Button';

const Movie = (props) => {
  // Show a placeholder image if the image is missing
  const imgSource = props.movie.Poster === 'N/A' ? 'https://www.edgeintelligence.com/wp-content/uploads/2018/08/placeholder.png' : props.movie.Poster;

  return (
    <div className={[classes.Movie, props.small ? classes.SmallMovie : ''].join(' ')}>
      <img src={imgSource} alt={props.movie.Title + " poster"} />
      <div className={classes.MovieInfo}>
        <h3>{props.movie.Title}</h3>
        <span>{props.movie.Year}</span>
        <Button
        click={props.clicked}
        disabled={props.disabled}
        added={props.added}/>
      </div>
    </div>
  );
};

export default Movie;
