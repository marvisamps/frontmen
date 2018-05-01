import React, { Component } from 'react';

const API = 'http://api.icndb.com/jokes/random/';
const queryCounter = 10;

class App extends Component {
  state = {
    jokes: [],
    isLoading: false,
    error: null,
    showList: false,
    favorite: null,
  };

  componentDidMount() {
    this.setState({ isLoading: true });

    fetch(API + queryCounter)
      .then(response => {
        if(response.ok){
          return response.json();
        } else {
          alert("No data loaded!");
        }
      })
      .then(data => this.setState({ jokes: data.value, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }))
  }

  handleClick() {
    this.setState(prevState => ({
      showList: !prevState.showList
    }));
  }

  handleFavorite() {
    this.setState(prevState => ({
      favorite: !prevState.favorite
    }));
  }

  render() {
    const { jokes, isLoading, error } = this.state;

    if(error){
      return <p>{error.message}</p>
    }

    if(isLoading){
      return <p>Loading...</p>
    }

    return (
      <div>
        <button onClick={(e) => this.handleClick(e)}>
          Show Jokes List
        </button>
        {this.state.showList ? (
          <ul>
            <h1>Simple List</h1>
            {jokes.map(jokes =>
              <li key={jokes.id}>
                {this.state.favorite ? (
                  <span>FAVORITE </span>
                ) : (
                  ''
                )}
                <span>{jokes.joke}</span>
                <button onClick={(e, key) => this.handleFavorite(e, key)}>
                  Mark as favorite
                </button>
              </li>
            )}
          </ul>
        ) : (
          <p>Click on the button to see the jokes!</p>
        )}
      </div>
    );
  }
}

export default App;
