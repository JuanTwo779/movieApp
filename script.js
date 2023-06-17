//base URL; directs to API
const BASE_URL = 'https://api.themoviedb.org/3'; 
//authenticate requests to API
const API_KEY = 'api_key=6a8725217517f3fc5184d578b96e25ec'; 


/**Methods for pagination */
const prev = document.getElementById('previous');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

next.addEventListener('click', () => {
    if(nextPage <= totalPages) {
        pageCall(nextPage)
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}

prev.addEventListener('click', () => {
    if(prevPage > 0) {
        pageCall(prevPage);
    }
})


/**Methods for working search bar */
const form = document.getElementById('form');
const search = document.getElementById('search');
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(SEARCH_URL+'&query='+searchTerm);
    } else {
        getMovies(GET_MOVIES_URL);
    }
})


/**Methods for getting popular movies */
    //API endpoint, traverses API to find endpoint that will execute an action
const GET_MOVIES_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY; 

const IMAGE_URL = 'https://image.tmdb.org/t/p/w500/';
const main = document.getElementById('main');

getMovies(GET_MOVIES_URL);

function getMovies(url) {

    lastUrl = url;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
        if(data.results.length !== 0){
            showMovies(data.results); //array of elements
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if (currentPage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            }else if (currentPage >= totalPages) {
                next.classList.add('disabled');
                prev.classList.remove('disabled');
            }else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }

            search.scrollIntoView({behavior : "smooth"});

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }

    })
}
    //loops through array of data, for each element/movie, create a html card from the index.html
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        // const {title, poster_path, vote_average, overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${IMAGE_URL + movie.poster_path}" alt="${movie.title}">

            <div class="movie-info">
                <h3>"${movie.title}"</h3>
                <span class="${getColor(movie.vote_average)}">${movie.vote_average}</span>
            </div> 

            <div class="overview">
                <h3>Overview</h3>
                "${movie.overview}"               
            </div>
        
        `
        main.appendChild(movieEl)
    });
}

function getColor(vote_ave){
    if(vote_ave >= 7.5){return 'green';}
    else if (vote_ave < 7.5 && vote_ave >= 5) {return 'orange';}
    else {return 'red';}
}