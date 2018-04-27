import React, { Component } from 'react';
// import './App.css';
import ThreeContainer from './ThreeContainer'
import Instructions from './Instructions.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Instructions />
        <ThreeContainer />
      </div>
    );
  }
}

export default App;
