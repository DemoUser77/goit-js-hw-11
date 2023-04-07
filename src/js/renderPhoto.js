// const galleryListEl = document.querySelector('.gallery');

 export function renderPhoto(images) {
  return images
     .map(image => {
       const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image
       return `
 <div class="photo-card">
  <a class = "photo" href="${largeImageURL}"></a>
   <img src="${webformatURL}" alt="${tags}" loading="lazy" width="150" height="100" class="photo-img"/>
   
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
     `
     })
     .join('')
     
    }

//      const { height: cardHeight } = document
//    .querySelector(".gallery")
//    .firstElementChild.getBoundingClientRect();

//  window.scrollBy({
//    top: cardHeight * 2,
//    behavior: "smooth",
//  })
