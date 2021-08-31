import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export class Calendar extends Component {

  // Callback function to handle what happens when clicking on a date

  handleDateClick = (arg) => {
    alert("Clicked on: " + arg.dateStr)
    console.log("Clicked on a date");
  }

  handleEventClick = (info) => {
    alert('Event: ' + info.event.title);
    console.log("Clicked on event with title: " + info.event.title);
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
            { title: 'My birthday, yay!', date: '2021-08-28' },
            { title: 'Second event', date: '2021-08-30' }
          ]}
          eventClick={this.handleEventClick}
        />
      </div>
    )
  }
}

export default Calendar;
