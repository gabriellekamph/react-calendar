import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export class App extends Component {
  render() {
    return (
      <div>
      <FullCalendar
        plugins={[ dayGridPlugin ]}
        initialView="dayGridMonth"
        weekends={true} // Show or hide weekends with true/false
        events={[
          { title: 'My birthday, yay!', date: '2021-08-28'},
          { title: 'Second event', date: '2021-08-30'}
        ]}
      />
      </div>
    )
  }
}

export default App;
