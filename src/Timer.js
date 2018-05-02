import React, { Component } from 'react'

class Timer extends Component {
  state = {
    counter: null,
  };

  componentDidMount() {
    this.setState(() => ({
      counter: setInterval(() => this.props.doSomething(), this.props.time * 1000)
    }))
  }

  componentWillUnmount() {
    clearInterval(this.state.counter)
  }

  render() {
    return null
  }
}

export default Timer;
