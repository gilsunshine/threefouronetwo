import React, { Component } from 'react';
import ThreeEntryPoint from './ThreeEntryPoint';

export default class ThreeContainer extends Component {
  componentDidMount() {
    ThreeEntryPoint(this.threeRootElement);
  }
  render () {
      return (
        <div ref={element => this.threeRootElement = element} />
      );
  }
}
