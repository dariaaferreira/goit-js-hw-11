import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

import ApiService from "./js/api-service";
const apiService = new ApiService(); 

import LoadMoreBtn from "./js/load-more-btn";
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const refs = {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);

// console.log(loadMoreBtn);

const lightbox = new SimpleLightbox('.gallery a', {/* options */});

function onSearch(e) {
  e.preventDefault();
  isShown = 0;
  
  // console.log(apiService.page);

  apiService.resetPage();
  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  refs.galleryContainer.innerHTML = '';

  if (apiService.query === '') {
    alertNoEmptySearch();
    loadMoreBtn.hide();

    return 
  } 

  apiService.fetchGallery().then(data => {
    console.log(data);
    // console.log(data.totalHits);
    // console.log(data.hits.length);

  if (data.totalHits === 0) {
    alertNoImagesFound();
    loadMoreBtn.hide();

  } else {
    
    clearGalleryContainer();
    renderGalleryContainer(data.hits);
    
    alertImagesFound(data);
    loadMoreBtn.show();
  }
  })
}

function onLoadMore() {
  apiService.fetchGallery()
  .then(data => {

    if (isShown <= data.totalHits) {
      renderGalleryContainer(data.hits);
      loadMoreBtn.show();
      // console.log(apiService.page);
    } 
    
    if (isShown >= data.totalHits) {
      alertEndOfSearch();
      loadMoreBtn.hide();
    }
    console.log(isShown)
  });
}

function renderGalleryContainer(hits) {
  isShown += hits.length;

    const images = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>  ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>  ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>`
    }).join("");
      
    refs.galleryContainer.insertAdjacentHTML('beforeend', images);
    lightbox.refresh();
}

function clearGalleryContainer() {
    refs.galleryContainer.innerHTML = '';
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
}

function alertNoEmptySearch() {
  Notiflix.Notify.warning('The search request cannot be empty.')
}

function alertNoImagesFound() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("You've reached the end of search results.")
}

const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    // удалим у кнопки класс btn-up_hide
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    // добавим к кнопке класс btn-up_hide
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    // при прокрутке содержимого страницы
    window.addEventListener('scroll', () => {
      // определяем величину прокрутки
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
      scrollY > 400 ? this.show() : this.hide();
    });
    // при нажатии на кнопку .btn-up
    document.querySelector('.btn-up').onclick = () => {
      // переместим в начало страницы
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}

btnUp.addEventListener();