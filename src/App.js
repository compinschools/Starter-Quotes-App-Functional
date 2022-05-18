import axios from "axios";
import React, { useState, useEffect } from "react";
import {ApiClient} from './ApiClient.js'


function App() {
  const [quotes, changeQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });

  const [fetching,changeFetching] = useState(false);
  const [authors,changeAuthors] = useState([]);
  const [lastIndex, changeLastIndex] = useState(20);
  const [pageSize, changePageSize] = useState(20);
  const [authorId,changeAuthorId] = useState(undefined);
  const apiClient = new ApiClient();

  const updateQuote = (responseObject) => {
    changeQuotes({
      content: responseObject.content,
      author: responseObject.author,
      tags: responseObject.tags
    })
  }

  const updateAuthors = (response) => {
    console.log(response);
    const authorList = response.results.map( (author) => 
    
    {
      return {
        id: author._id,
        name: author.name,
        count: author.quoteCount,
    } 
    
  });
    changeAuthors(authorList);
  }

  const refreshAuthors = (next) => {
    if(next) {
      listAuthors(lastIndex);
      changeLastIndex(lastIndex + pageSize);
    } else {
      listAuthors(lastIndex - pageSize * 2);
      changeLastIndex(lastIndex < pageSize ? pageSize : lastIndex - pageSize);
    }
  }

  const refreshPagination = (event) => {
    changePageSize(parseInt(event.target.value));
  }


  const listAuthors = (skip = 0) => {
    skip = skip > 0 ? skip : 0;
    apiClient.getAuthors(skip,pageSize).then( (response) => {
      updateAuthors(response.data);
    })
  };

  const refreshQuote = () => {
    changeQuotes({
      content: "a quote we made up",
      author: "anon",
      tags: ["quote", "stuff", "blah"],
    });
    changeFetching(true);

    if(authorId) {
      apiClient.getQuoteByAuthor(authorId)
      .then((response) => {
        updateQuote(
          response.data.results[Math.floor(Math.random() * response.data.count)]
        )
      })
      .finally((state) => changeFetching(false));
    } else {

    apiClient
      .getQuote()
      .then( (response) => {
        updateQuote(response.data);
      })
      .finally((state) => changeFetching(false));
  }
}

  useEffect(() => {
    refreshQuote();
    listAuthors();
  }, []);

  useEffect( () => {
    listAuthors();
  }, [pageSize]);

  useEffect(() => {
    refreshQuote();
  }, [authorId]);

  const makeAuthorTable = () => {
    return authors.map( (author,index) => {
      return (
        <tr key={index}>
          <td
            style={{backgroundColor: authorId === author.id ? "green" : ""}}
          >
              <a onClick={ () => {changeAuthorId(author.id);console.log(author.id)}}> {author.name}</a>
          </td>
          <td>
              {author.count}
          </td>
        </tr>

      )
    })
  }

  return (
    <>
      <h1>Quote of the day</h1>
      <p>
        <b>Content:</b> {quotes.content}{" "}
      </p>
      <p>
        <b>Author:</b> {quotes.author}{" "}
      </p>
      <p>
        <b>Tags:</b> {quotes.tags.join(", ")}
      </p>

      <button disabled={fetching} onClick={() => refreshQuote()}>
        New Quote
      </button>
      <hr />
      <button onClick={() => refreshAuthors(false)}>Previous</button>
      <button onClick={() => refreshAuthors(true)}>Next</button>
      <br /> Page Size
      <select onChange={ (event) => refreshPagination(event)} value={pageSize}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
      <table>
        <thead>
            <tr>
              <th>Name</th>
              <th>No of quotes</th>
            </tr>
        </thead>
        <tbody>
          {makeAuthorTable()}
        </tbody>
      </table>
    </>
  );
}

export default App;
