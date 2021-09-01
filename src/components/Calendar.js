import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';




export class Calendar extends Component {

  calendarRef = React.createRef()

  // Constructor so set initial state

  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  // Fetching event data from json file

  componentDidMount() {
    fetch("http://localhost:3000/events.json")
    .then(res => res.json())
    .then((data) => {
      this.setState({ events: data })
      console.log(data)
      });
  }

  render() {
    return (
      <div>
        <FullCalendar
          ref={this.calendarRef}
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          headerToolbar={{
            left: 'prev next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          initialView="dayGridMonth"
          events={this.state.events}
          select={this.handleDateSelect}
          eventClick={this.handleEventClick}
          eventsSet={this.handleEvents}
        />
      </div>
    )
  }
  
  // Function to create new event after click on date

  handleDateSelect = (selectInfo) => {
    let title = prompt('Add title for your event: ')
    let calendarApi = this.calendarRef.current.getApi()

    calendarApi.unselect()

    if(title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: true
      })
      console.log("Added new event with title: " + title)
    }
  }

  // Function to show info about selected event on click

  handleEventClick = (info) => {
    alert('Event: ' + info.event.title + ' Id:' + info.event.id);
    console.log("Clicked on event with title: " + info.event.title + " and id: " + info.event.id);
  }
}

// Function to create unique id for new event

function createEventId() {

  let randomId = require('random-id');
  let len = 8;
  let pattern = 'aA0';
  let id = randomId(len, pattern);

  return String(id);
}

export default Calendar;
