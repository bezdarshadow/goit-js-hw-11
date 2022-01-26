import '../css/styles.css';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import galleryCardTemplate from '../templates/galleryItemTemplate.hbs'

import { PixabayAPI } from './pixabay-api';

const searchFormEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.js-load-more');
const galleryEl = document.querySelector('.gallery');

const pixabayApi = new PixabayAPI();


searchFormEl.addEventListener('submit', onSearchFormSubmit);

loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

galleryEl.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  event.preventDefault();
   
  if (event.target.nodeName !== 'IMG') {
  return;
  };
}

function onLoadMoreBtnClick (event) {
  pixabayApi.page += 1;
  pixabayApi.totalCount += pixabayApi.per_page;


  pixabayApi.fetchPhotos()
  .then(data =>{
      if(data.total === 0){
        throw new Error('error');
      }
      if(pixabayApi.totalCount > data.total){
        loadMoreBtnEl.classList.add('is-hidden');
      }
      galleryEl.insertAdjacentHTML('beforeend', galleryCardTemplate(data));
      callingSimplelightbox();
  })
  .catch(err => searchError())

}

function onSearchFormSubmit (event){
    event.preventDefault();
  

    const keyword = event.currentTarget.elements['searchQuery'].value;

    if (keyword.trim() === '') {
      return;
    }

    defaultSearchForForm(keyword);
    galleryCleaning();

   
    pixabayApi.fetchPhotos()
    .then(data =>{
      if(data.total === 0){
        throw new Error('error');
      }
      if(data.total <= 20){
        loadMoreBtnEl.classList.add('is-hidden');
      }
      if(data.total > 20){
        loadMoreBtnEl.classList.remove('is-hidden');
      }
      
      Notiflix.Notify.success(`Success ${data.hits.length} images loaded`)
      
      galleryEl.insertAdjacentHTML('beforeend', galleryCardTemplate(data))
      callingSimplelightbox();
    })
    .catch(err => searchError())

}



function callingSimplelightbox() {
  new simpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
}

function galleryCleaning (){
  galleryEl.innerHTML = '';
}

function searchError () {
  loadMoreBtnEl.classList.add('is-hidden');
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

function defaultSearchForForm (keyword) {
  pixabayApi.page = 1;
  pixabayApi.searchQuery = keyword;
  pixabayApi.totalCount = pixabayApi.per_page;
}