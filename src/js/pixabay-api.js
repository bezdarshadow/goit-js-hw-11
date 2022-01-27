'use strict';

import axios from "axios";

export class PixabayAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '25406672-b5207d9f82ab532bfb9f3b93a';

    constructor(keyword = null){
        this.page = 1;
        this.searchQuery = keyword;
        this.per_page = 40;
        this.totalCount = this.per_page;
    }

    fetchPhotos(){
        return axios.get(`${this.#BASE_URL}`, {
            params:{
                key: this.#API_KEY,
                q: this.searchQuery,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: this.page,
                per_page: this.per_page,
            },
        });
    };

}

