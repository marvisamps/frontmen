import React, { Component } from 'react';
import './App.css';
import Timer from './Timer';
import { URL_FETCH } from './constants'
import { save, get } from './database'

class App extends Component {
  state = {
    jokes: [],
    isLoading: true,
    error: null,
    favorites: get('favorites'),
    timer: false,
  };

  componentDidMount() {
    this.handleFetch()
      .then(response => {
        this.setState(() => ({ jokes: response.value, isLoading: false }))
      })
      .catch(error => ({ error, isLoading: false }))
  }

  handleSave(state) {
    this.setState(() => ({ ...state }));
    save('favorites', state.favorites)
  }

  handleFetch(limit = 10) {
    const checkResponse = response => response.ok ? response.json() : alert("No data loaded!");

    return fetch(`${URL_FETCH}${limit}`)
      .then(checkResponse)
      .then(data => ({ value: data.value, isLoading: false }))
  }

  handleFavorite(joke) {
    const { jokes, favorites } = this.state;

    const getJoke = from => from.filter(item => item.id === joke).pop();
    const removeJoke = from => from.filter(item => item.id !== joke);

    return favorites.filter(j => j.id === joke).length
      ? this.handleSave({
          jokes: [...jokes, getJoke(favorites)],
          favorites: removeJoke(favorites),
      })
      : this.handleSave({
          jokes: removeJoke(jokes),
          favorites: [...favorites, getJoke(jokes)],
      });
  }

  handleRandomFavorite() {
    const { favorites } = this.state;

    if (this.state.favorites.length < 10) {
      this.handleFetch(1)
        .then(response => this.handleSave({
          favorites: [...favorites, response.value.pop() ],
        }))
    }
  }

  render() {
    const { jokes, isLoading, error, favorites } = this.state;

    if(error) {
      return <p>{error.message}</p>
    }

    if(isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div>
        {this.state.timer && <Timer doSomething={() => this.handleRandomFavorite()} time={3} />}

        <ul className="simpleList">
          <h1>Simple List</h1>

          {jokes.map(jokes =>
            <div key={jokes.id}>
              <li className="simpleItem">
                <span>{jokes.joke}</span>
                <button className="markBtn" onClick={() => this.handleFavorite(jokes.id)}>
                  Mark as favorite
                </button>
              </li>
            </div>
          )}
        </ul>

        <ul className="favList">
          <div className="favHeaderArea">
            <h1 className="favTitle">Favorites List</h1>
            <button className="randomizeBtn" onClick={() => {
              this.setState((prevState) => ({ timer: !prevState.timer }))
            }}>
              {this.state.timer ? ('Stop Randomize') : ('Start Randomize')}
            </button>
          </div>

          {favorites.map(favorite =>
            <div key={favorite.id}>
              <li className="favItem">
                <span>{favorite.joke}</span>
                <button className="unmarkBtn" onClick={() => this.handleFavorite(favorite.id)}>
                  Unmark as favorite
                </button>
              </li>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
