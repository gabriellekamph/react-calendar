import React, { Component } from 'react';
import './app.scss';
import Calendar from './components/Calendar';

export class App extends Component {
  render() {
    return (
      <div>
        <h1>React calendar</h1>
        <Calendar />
      </div>
    )
  }
}

export default App;
