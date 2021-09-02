import React, { Component } from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export class Calendar extends Component {

  calendarRef = React.createRef()

  // Constructor to set initial state

  constructor(props) {
    super(props);
    this.state = {
      allEvents: []
    };
  }

  // Fetching events from local storage

  componentDidMount() {

    const eventsFromLocalStorage = JSON.parse(localStorage.getItem('events'));
    this.setState({ allEvents: eventsFromLocalStorage });
    console.log('Display all events from local storage');

  }

  // Render calendar 

  render() {
    return (
      <div className='container'>
        {this.renderSidebar()}
          <div className='showCalendar'>
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
              initialView='dayGridMonth'
              events={this.state.allEvents}
              select={this.handleDateSelect}
              eventClick={this.handleEventClick}
              eventsSet={this.handleEvents}
            />
        </div>
      </div>
    )
  }

  // Render sidebar

  renderSidebar() {
    return (
      <div className='sidebar'>
        <h1>React calendar</h1>

        <h2>All events ({this.state.allEvents.length})</h2>
        <ul>
          {this.state.allEvents.map(renderSidebarEvent)}
        </ul>
      </div>
    )
  }

  // Function to create new event after click on date

  handleDateSelect = (selectInfo) => {
    let title = prompt('Add title for your event: ')
    let calendarApi = this.calendarRef.current.getApi()
    let savedEvents = JSON.parse(localStorage.getItem('events')) || [];

    calendarApi.unselect()

    if(title) {

      let newEvent = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr
      };

      savedEvents.push(newEvent)
      localStorage.setItem('events', JSON.stringify(savedEvents));

      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      })

      console.log('Added new event with title: ' + title)     
      this.forceUpdate(); 
    }
  }

  // Function to show info about selected event on click

  handleEventClick = (info) => {
    alert('Event: ' + info.event.title + ' Id:' + info.event.id);
    console.log('Clicked on event with title: ' + info.event.title + ' and id: ' + info.event.id);
  }

  handleEvents = (events) => {
    this.setState({
      test: events
    })
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

// Function to render sidebar with list of all events

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})} </b>
      <br />
      <i>{event.title}</i>
    </li>
  )
}

export default Calendar;
