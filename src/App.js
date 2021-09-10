import React, { Component } from 'react';
import Calendar from './components/Calendar';
import 'bootstrap/dist/css/bootstrap.css';

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
