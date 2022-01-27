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




async function onLoadMoreBtnClick (event) {
  pixabayApi.page += 1;
  pixabayApi.totalCount += pixabayApi.per_page;
  try{
    const { data } = await pixabayApi.fetchPhotos();
   
    if(data.totalHits === 0){
     throw new Error('error');
    }
    if(pixabayApi.totalCount >= data.totalHits){
     loadMoreBtnEl.classList.add('is-hidden');
     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    } 
    galleryEl.insertAdjacentHTML('beforeend', galleryCardTemplate(data));
    callingSimplelightbox();
    smoothScroll();
    

  } catch(err) {
    searchError();
  }

};

async function onSearchFormSubmit (event){
    event.preventDefault();
  
    const keyword = event.currentTarget.elements['searchQuery'].value;

    if (keyword.trim() === '') {
      return;
    }

    defaultSearchForForm(keyword);
    galleryCleaning();
    try{
      const {data} =  await pixabayApi.fetchPhotos()
      if(data.totalHits === 0){
        throw new Error('error');
      }
      if(data.totalHits <= pixabayApi.per_page){
        loadMoreBtnEl.classList.add('is-hidden');
      }
      if(data.totalHits > pixabayApi.per_page){
        loadMoreBtnEl.classList.remove('is-hidden');
      }
      Notiflix.Notify.success(`Success ${data.totalHits} images loaded`)
        
      galleryEl.insertAdjacentHTML('beforeend', galleryCardTemplate(data))
      callingSimplelightbox();

    }catch(err){
      searchError();
    }

    
  

}


function callingSimplelightbox() {
  new simpleLightbox('.gallery a', { captionDelay: 250, showCounter: false });
};

function galleryCleaning (){
  galleryEl.innerHTML = '';
};

function smoothScroll (){
  const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function searchError () {
  loadMoreBtnEl.classList.add('is-hidden');
  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function defaultSearchForForm (keyword) {
  pixabayApi.page = 1;
  pixabayApi.searchQuery = keyword;
  pixabayApi.totalCount = pixabayApi.per_page;
};

function onGalleryClick(event) {
  event.preventDefault();
   
  if (event.target.nodeName !== 'IMG') {
  return;
  };
};