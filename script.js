const apiKeyInput = document.getElementById('api-key-input');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');


searchButton.addEventListener('click', function() {
  const expression = searchInput.value;
  const apiKey = apiKeyInput.value;

  if (apiKey === "") {
    alert("You should provide an API key.");
    return;
  } else if (expression === "") {
    alert("Please enter a search term.");
    return;
  }

  url = "https://imdb-api.com/en/API/SearchMovie/" + apiKey + "/" + expression;

  search(url, apiKey);
});

function search(url, apiKey) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.errorMessage !== "") {
        alert(data.errorMessage);
        return;
      } else if (data.results.length === 0) {
        alert("No movie title resembling the search term was found.");
        return;
      }

    console.log(data)

    id = data.results[0].id

    moviUrl = "https://imdb-api.com/en/API/Title/" + apiKey + "/" + id

    fetch(moviUrl)
      .then(response => response.json())
      .then(movieData => {
        movieRequest = data.results;
        console.log(movieData);

        image = movieData.image
        title = movieData.fullTitle
        releaseDate = movieData.releaseDate
        runtimeMins = movieData.runtimeMins
        if (runtimeMins === null) {
          runtimeMins = '--'
        } else {
          runtimeMins = runtimeMins + " min"
        }
        rating = movieData.imDbRating
        genres = movieData.genres
        languages = movieData.languages
        plot = movieData.plot
        actorList = movieData.actorList
        let actors = make_actors_list(actorList)
        awards = movieData.awards
        if (awards === "") {
          awards = 'No awards'
        }
        similars = movieData.similars

        const searchedMovieInfo = document.getElementById('searched-movie-presentation');
        searchedMovieInfo.innerHTML = `
        <img id="searched-movie-poster" src="${image}" alt="Poster">
        <div id="searche-movie-info">
          <div id="up">
            <div id="upper-left">
              <h2 id="title">${title}</h2>
              <p id="release-date-and-length">${releaseDate}<span id="runtime">${runtimeMins}</span></p>
            </div>
            <h1 id="rating">${rating}</h1>
          </div>
          <p id="genres">${genres}</p>
          <p id="languages">${languages}</p>
          <hr/>
          <p id="plot">${plot}</p>
          <hr/>
          <p id="actorList">${actors}</p>
          <hr/>
          <p id="awards">${awards}</p>
        </div>
      `;

      const beforeSearchMovieText = document.getElementById('before-search-movie-text');
      beforeSearchMovieText.style.display = 'none';
      searchedMovieInfo.style.display = 'flex';

      let similarMovies = "";
      const similarMoviesList = document.getElementById('similar-movies-list');
      for (let i = 0; i < 4; i++) {
        let movie = similars[i]
        let image = movie.image
        console.log(image)
        let title = movie.title
        let imDbRating = movie.imDbRating
        let similarMovie = `
        <div class="movie-card">
          <img class="similar-movie" src="${image}" alt="Poster">
          <h4 class="similar-movie-title">${title}</h2>
          <p class="similar-movie-rating">${rating}</p>
        </div>
      `;
      similarMovies += similarMovie;
      }
      similarMoviesList.innerHTML = similarMovies;

      const beforeSearchSimilarsText = document.getElementById('before-search-similars-text');
      console.log(beforeSearchSimilarsText);
      beforeSearchSimilarsText.style.display = 'none';
      similarMoviesList.style.display = 'flex';
      })
  })
}

function make_actors_list(actors_list) {
  let actors = "";
  let length = actors_list.length;
  for (let i = 0; i < length; i++) {
    actor = actors_list[i].name;
    actors += actor;
    if (i+1 != length) {
      actors += ", "
    }
  }

  return actors;
}
