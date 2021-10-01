import React, { Component } from 'react';
import Calendar from './components/Calendar';
import 'bootstrap/dist/css/bootstrap.css';

interface Props {

}

interface State {

}

export class App extends Component <Props, State> {
  render() {
    return (
      <div>
        <Calendar />
      </div>
    )
  }
}

export default App;
