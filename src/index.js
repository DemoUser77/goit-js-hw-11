import './css/gallery.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchImages } from '../src/js/fetchImages.js';
import { renderPhoto } from '../src/js/renderPhoto.js';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtn);

let page = 1;
let query = '';
let simpleLightBox;
const perPage = 40;

loadMoreBtnEl.classList.add('is-hidden');

async function handleSearchFormSubmit(event) {
  event.preventDefault();
  page = 1;
    
  query = event.currentTarget.searchQuery.value.trim();
  galleryListEl.innerHTML = '';
  
  if (query === '') {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.failure("The search string cannot be empty. Please specify your search query.");
    return;
  }
    
  try {
    const { totalHits, hits } = await fetchImages(query, page, perPage)
     
    if (totalHits === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    else {
      galleryListEl.insertAdjacentHTML('beforeend', renderPhoto(hits));
      loadMoreBtnEl.classList.remove('is-hidden');
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      Notify.success(`Hooray! We found ${totalHits} images.`)
    }
    } catch (error) {
   
      console.log(error.message);
  }
    searchFormEl.reset();

  }

async function handleLoadMoreBtn() {
    page += 1;
  
  try {
      const { totalHits , hits } = await fetchImages(query, page, perPage)
    
    galleryListEl.insertAdjacentHTML('beforeend', renderPhoto(hits));
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      
  
    if (totalHits < page * perPage) {
        loadMoreBtnEl.classList.add('is-hidden');
        Notify.failure("We're sorry, but you've reached the end of search results.")
      }
    
    } catch (error) {
      console.log(error);
    }
 }

