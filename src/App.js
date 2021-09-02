import React, { Component } from 'react';
import './app.scss';
import Calendar from './components/Calendar';

export class App extends Component {
  render() {
    return (
      <div>
        <Calendar />
      </div>
    )
  }
}

export default App;
