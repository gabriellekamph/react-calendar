import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export class Calendar extends Component {

  handleDateClick = (arg) => {
    alert(arg.dateStr)
    console.log("Clicked on a date");
  }

  render() {
    return (
      <div>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin ]}
          dateClick={this.handleDateClick}
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

export default Calendar;
