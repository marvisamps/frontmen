import React, { Component } from 'react';
import Timer from './Timer';
import { URL_FETCH } from './constants'

class App extends Component {
  state = {
    jokes: [],
    isLoading: true,
    error: null,
    showList: false,
    favorites: [],
    timer: false,
  };

  componentDidMount() {
    this.handleFetch()
      .then(response => {
        this.setState(() => ({ jokes: response.value, isLoading: false }))
      })
      .catch(error => ({ error, isLoading: false }))
  }

  handleFetch(limit = 10) {
    const checkResponse = response => response.ok ? response.json() : alert("No data loaded!")

    return fetch(`${URL_FETCH}${limit}`)
      .then(checkResponse)
      .then(data => ({ value: data.value, isLoading: false }))
  }

  handleFavorite(joke) {
    return this.state.favorites.includes(joke)
      ? this.setState(prevState => ({ favorites: prevState.favorites.filter(item => item !== joke) }))
      : this.setState(prevState => ({ favorites: [...prevState.favorites, joke] }));
  }

  handleRandomFavorite() {
    if (this.state.favorites.length < 10) {
      this.handleFetch(1)
        .then(response => this.setState(prevState => ({
          jokes: [...prevState.jokes, response.value[0]],
          favorites: [...this.state.favorites, response.value[0].id]
        })))
    }

    console.log(this.state.favorites)
  }

  render() {
    const { jokes, isLoading, error } = this.state;

    if(error) {
      return <p>{error.message}</p>
    }

    if(isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div>
        <button onClick={() => {
          this.setState(prevState => ({ showList: !prevState.showList}))
        }}>
          {this.state.showList ? ('Simple Jokes List') : ('Favorite Jokes List')}
        </button>

        {this.state.timer && <Timer doSomething={() => this.handleRandomFavorite()} time={3} />}

        {this.state.showList ? (
          <ul>
            <h1>Favorites List</h1>

            <button onClick={() => {
              this.setState((prevState) => ({ timer: !prevState.timer }))
            }}>
              {this.state.timer ? ('Stop Randomize') : ('Start Randomize')}
            </button>

            {jokes.map(jokes =>
              <div key={jokes.id}>
                {this.state.favorites.includes(jokes.id) && (
                  <li>
                    <span>FAVORITE </span>
                    <span>{jokes.joke}</span>
                    <button onClick={() => this.handleFavorite(jokes.id)}>
                      Unmark as favorite
                    </button>
                  </li>
                )}
              </div>
            )}
          </ul>
        ) : (
          <ul>
            <h1>Simple List</h1>
            {jokes.map(jokes =>
              <div key={jokes.id}>
                {!this.state.favorites.includes(jokes.id) && (
                  <li>
                    <span>{jokes.joke}</span>
                    <button onClick={() => this.handleFavorite(jokes.id)}>
                      Mark as favorite
                    </button>
                  </li>
                )}
              </div>
            )}
          </ul>
        )}
      </div>
    );
  }
}

export default App;
