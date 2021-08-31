import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


export class Calendar extends Component {

  state = {
    modal: false,
    currentEvents: []
  };

  // Fetch all events from json file and set as state

  componentDidMount() {
    fetch('../events.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({currentEvents: data})
    }
    );
  }

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
          events={this.state.currentEvents}
          eventClick={this.handleEventClick}
        />
      </div>
    )
  }
}

export default Calendar;
