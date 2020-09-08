import React from 'react';
import classes from './Banner.module.css';

const Banner = (props) => {
  let bannerMovies = ''
  if (props.topMovies) {
    bannerMovies = props.topMovies.map((m, index) => {
      return (
        <div className={classes.BannerMovie}>
          <div>#{index + 1}</div>
          <h4>{m.movie.Title} ({m.movie.Year})</h4>
        </div>
      )
    });
  }
  console.log(props.topMovies)
  console.log(bannerMovies)
  return (
    <div
    className={classes.BannerBackdrop}
    onClick={props.clicked}
    style={{display: props.show ? 'flex' : 'none'}}
    >
      <div className={classes.Banner}>
        <h3>Your Final Nomination 🏅</h3>
        {bannerMovies}
      </div>
    </div>
  )
}

export default Banner;
