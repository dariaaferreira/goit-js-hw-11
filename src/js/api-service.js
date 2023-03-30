import axios from 'axios';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;

  }
  async fetchGallery() {
    const searchParams = {
      method: 'get',
      url: 'https://pixabay.com/api/',
      params: {
        key: '34850970-a8e6c100d46912143d60db3a6',
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: 40,
      },
    };
    try {
      const response = await axios(searchParams);

      const data = response.data;

      this.incrementPage();

      return data;

    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}