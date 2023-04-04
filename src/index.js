// import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchImages } from '../src/js/fetchImages.js';
// import { renderPhoto } from '../src/js/renderPhoto.js';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtn);

let page = 1;
let query = '';
let simpleLightBox;
const perPage = 40;

 function renderPhoto(images) {
  const markup = images
    .map(image => {
      const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image
      return `
        <a class = "photo" href="${largeImageURL}">
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  
   <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
</a>
    `;
    })
     .join('')
   
   galleryListEl.insertAdjacentHTML('beforeend', markup)
   

//    const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// })
}


function handleSearchFormSubmit(event) {
  event.preventDefault();
  page = 1;
    
  query = event.currentTarget.searchQuery.value.trim();
  galleryListEl.innerHTML = '';
  // loadMoreBtnEl.classList.add('is-hidden');


  if (query === '') {
    Notify.failure("The search string cannot be empty. Please specify your search query.");
    return;
  }
    
  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      } else {
        galleryListEl.insertAdjacentHTML('beforeend', renderPhoto(data));
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notify.failure("Hooray! We found ${data.totalHits} images.")
      }
    })
    .catch(error => {
    console.log(error)
  })
}

function handleLoadMoreBtn() {
  page += 1;
  
  
  fetchImages(query, page, perPage)
    .then(data => {
      renderPhoto(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh()
      
      if (page > perPage) {
        Notify.failure("We're sorry, but you've reached the end of search results.")
      }
    }).catch(error => {
      console.log(error)
    })
}
