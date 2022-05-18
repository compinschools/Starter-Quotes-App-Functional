import axios from "axios";
export class ApiClient {

    responseStatusCheck (responseObject) {
        if(responseObject.status >= 200 && responseObject.status < 300) {
          return Promise.resolve(responseObject);
        } else {
          return Promise.reject(new Error(responseObject.statusText));
        }
      }

      getRequest(url){
          return axios.get(url)
          .then(this.responseStatusCheck)
          .catch((error) => {
                console.log(error);
                alert(error);

          })
      }
    
      getAuthors (skip = 0,limit) {
        return this.getRequest(`https://api.quotable.io/authors?skip=${skip}&limit=${limit}`)
      }

      getQuote () {
        return this.getRequest("https://api.quotable.io/random")
      }

      getQuoteByAuthor (authorId) {
        return this.getRequest(`https://api.quotable.io/quotes?authorId=${authorId}`)
      }
}