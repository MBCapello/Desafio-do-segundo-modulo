const movies = document.querySelector('.movies');
const highlight__video = document.querySelector('.highlight__video');
const highlight__title = document.querySelector('.highlight__title');
const highlight__rating = document.querySelector('.highlight__rating');
const highlight__genres = document.querySelector('.highlight__genres');
const highlight__launch = document.querySelector('.highlight__launch');
const highlight__description = document.querySelector('.highlight__description');

let catalogo = [];
const porPg = 5;
let pg = 0;
let start = pg * porPg;
let end = start + porPg;

//popula a primeira pg
function primeiraPG() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (resposta) {
        const promise = resposta.json();

        promise.then(function (body) {
            const array = body.results;
            const posters = array.slice(start, end)
            popularLista(posters);
            catalogo = [];
            array.forEach((element) => {
                catalogo.push(element)
            });

        });
    });
};
primeiraPG();
//popula segunda seção testando com .Then
function segundaSection() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (resposta) {
        const promise = resposta.json();

        promise.then(function (element) {
            highlight__video.style.backgroundImage = `url(${element.backdrop_path})`;
            highlight__title.textContent = element.title;
            highlight__rating.textContent = element.vote_average;
            highlight__genres.textContent = element.genres[0].name + ', ' + element.genres[1].name + ', ' + element.genres[2].name;
            let data_americana = element.release_date;
            let data_brasileira = data_americana.split('-').reverse().join('/');
            highlight__launch.textContent = data_brasileira;
            highlight__description.textContent = element.overview;
        })
    });
};
segundaSection()
//link externo
const videoLink = document.querySelector('.highlight__video-link');
fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(function (resposta) {
    const promise = resposta.json();

    promise.then(function (element) {
        videoLink.href = `https://www.youtube.com/watch?v=${element.results[0].key}`;
    });
});
//controladores
const next = document.querySelector('.btn-next');
next.addEventListener('click', () => {
    pg++;
    start = pg * porPg;
    end = start + porPg;

    if (pg > (catalogo.length / 5) - 1) {
        pg = 0;
        start = pg * porPg;
        end = start + porPg;
    }
    const posters = catalogo.slice(start, end)
    while (movies.firstChild) {
        movies.removeChild(movies.firstChild);
    }

    popularLista(posters)

})
const prev = document.querySelector('.btn-prev');
prev.addEventListener('click', () => {
    pg--;
    start = pg * porPg;
    end = start + porPg;
    if (pg < 0) {
        pg = (catalogo.length / 5) - 1;
        start = pg * porPg;
        end = start + porPg;
    }
    const posters = catalogo.slice(start, end)
    while (movies.firstChild) {
        movies.removeChild(movies.firstChild);
    }
    popularLista(posters)


})

//function usada nos controles e na primeira população
function popularLista(element) {
    element.forEach(element => {
        const divMovie = document.createElement('div');
        divMovie.classList.add('movie');
        divMovie.style.backgroundImage = `url(${element.poster_path})`

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = element.title;
        movieTitle.style.color = 'white'

        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');
        movieRating.textContent = element.vote_average;
        movieRating.style.color = '#FBCD6E';

        const movieImg = document.createElement('img');
        movieImg.src = './assets/estrela.svg';


        movieRating.append(movieImg)
        movieInfo.append(movieTitle, movieRating);
        divMovie.append(movieInfo);
        movies.append(divMovie);
        eventoModal(divMovie, element);

    })
}
//function para modal
function eventoModal(element1, element2) {
    element1.addEventListener('click', async () => {
        const promise = await fetch(` https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${element2.id}?language=pt-BR`);
        const result = await promise.json();

        const movieId = result;
        modal.classList.remove('hidden');

        const modal__title = document.querySelector('.modal__title');
        modal__title.textContent = movieId.title;

        const modal__img = document.querySelector('.modal__img');
        modal__img.src = movieId.backdrop_path;

        const modal__description = document.querySelector('.modal__description');
        modal__description.textContent = movieId.overview;

        const modal__average = document.querySelector('.modal__average');
        modal__average.textContent = movieId.vote_average;

    })
}
//manipula o modal
const modal = document.querySelector('.modal');
const modal__close = document.querySelector('.modal__close');
modal__close.addEventListener('click', () => {
    const modal = document.querySelector('.modal')
    modal.classList.add('hidden')
})
//função de busca do input tstando com Async
const input = document.querySelector('.input');
input.addEventListener('keydown', async (event) => {
    const key = event.key;
    if (key !== 'Enter') {
        return
    }
    if (input.value === '') {
        movies.innerHTML = "";
        pg = 0;
        start = pg * porPg;
        end = start + porPg;
        catalogo = [];
        primeiraPG()
        return
    }
    const promesaBusca = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
    const respostaBusca = await promesaBusca.json();
    const busca = await respostaBusca;
    input.value = "";
    const array = busca.results;
    pg = 0;
    start = pg * porPg;
    end = start + porPg;
    const posters = array.slice(start, end)
    movies.innerHTML = "";
    if (busca.total_results > 0) {
        popularLista(posters);
        catalogo = [];
        array.forEach((element) => {
            catalogo.push(element)
        });
    } else {
        catalogo = [];
        fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(function (resposta) {
            const promise = resposta.json();

            promise.then(function (body) {
                const array = body.results;
                const posters = array.slice(start, end)
                popularLista(posters);
                array.forEach((element) => {
                    catalogo.push(element)
                });

            });
        });
    }
})
//troca de tema
const btn_theme = document.querySelector('.btn-theme');
const body = document.querySelector('body');
btn_theme.addEventListener('click', () => {
    btn_theme.src = btn_theme.src === "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/light-mode.svg" ? "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/dark-mode.svg" : "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/light-mode.svg";

    next.src = next.src === "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-preta.svg" ? "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-branca.svg" : "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-direita-preta.svg";

    prev.src = prev.src === "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-preta.svg" ? "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-branca.svg" : "http://127.0.0.1:5500/desafio-frontend-modulo-02-integral/assets/seta-esquerda-preta.svg";

    const novoTemaClaro = body.style.getPropertyValue('--tema-claro') === '#000' ? '#fff' : '#000';
    body.style.setProperty('--tema-claro', novoTemaClaro)
    const novoTemaEscuro = body.style.getPropertyValue('--tema-escuro') === '#fff' ? '#000' : '#fff';
    body.style.setProperty('--tema-escuro', novoTemaEscuro)
})

