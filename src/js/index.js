import '../css/styles.css';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import galleryCardTemplate from '../templates/galleryItemTemplate.hbs'

import { PixabayAPI } from './pixabay-api';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const pixabayApi = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit (event){
    event.preventDefault();

    const keyword = event.currentTarget.elements['searchQuery'].value;

    if (keyword.trim() === '') {
      return;
    }

    pixabayApi.page = 1;
    pixabayApi.searchQuery = keyword;
   
    pixabayApi.fetchPhotos().then(data =>{
        console.log(data)
        galleryEl.insertAdjacentHTML('beforeend', galleryCardTemplate(data))
    })

}
