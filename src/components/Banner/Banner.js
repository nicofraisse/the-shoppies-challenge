import React from 'react';
import classes from './Banner.module.css';

const Banner = (props) => {
  // Construct list of movies shown in the banner
  let bannerMovies = '';
  if (props.topMovies) {
    bannerMovies = props.topMovies.map((m, index) => {
      return (
        <div className={classes.BannerMovie} key={index}>
          <div>#{index + 1}</div>
          <h4>{m.movie.Title} ({m.movie.Year})</h4>
        </div>
      );
    });
  }

  return (
    <div
    className={classes.BannerBackdrop}
    onClick={props.clicked}
    style={{display: props.show ? 'flex' : 'none'}}>
      <div className={classes.Banner}>
        <h3>Your Final Nomination 🏅</h3>
        {bannerMovies}
      </div>
    </div>
  );
};

export default Banner;
