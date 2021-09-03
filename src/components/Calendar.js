import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '../components/calendar.scss';

export class Calendar extends Component {

  calendarRef = React.createRef()

  // Constructor to set initial state

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: "",
      allEvents: [],
      event: []
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal, event: this.state.event });
    console.log(this.state.event.title);
    console.log(this.state.event.id);

  };

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
          <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
          >
          <ModalHeader toggle={this.toggle}>
            <h3>{this.state.event.title}</h3>
          </ModalHeader>
          <ModalBody>
            <b>{moment(this.state.event.start).format('dddd, MMM Do, YYYY')}</b>
          </ModalBody>
          <ModalFooter>
            <Button color="green">Mark as done</Button>
            <Button color="red" id="btn-delete-event" onClick={this.handleDeleteEvent}>Delete event</Button>
            <Button color="blue" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  }

  // Render sidebar and sort list of events by date

  renderSidebar() {

    let countEvents;
    let eventList;
    let unsortedEvents = this.state.allEvents;

    const sortedEvents = unsortedEvents.sort((a, b) => {
      return moment(a.start).diff(b.start);
    })

    if (!localStorage.getItem("events")){
      countEvents = "No events saved, let's add one!"
      eventList = "";
    } else {
      countEvents = "Upcoming events:";
      eventList = sortedEvents.map(renderSidebarEvent)
    }

    return (
      <div className='sidebar'>
        <h1>React calendar</h1>
        <h2>{countEvents}</h2>
        <ul>{eventList}</ul>
      </div>
    )
  }

  // Function to create new event after click on date

  handleDateSelect = (selectInfo) => {

    <form>
      <input
      type="text"
      name="username"
      value={this.state.title}
      onChange={this.handleTitleInput} />
    </form>

    let title = prompt('Add title for your event: ')
    let calendarApi = this.calendarRef.current.getApi()
    let savedEvents = JSON.parse(localStorage.getItem('events')) || [];

    calendarApi.unselect()

    if(title) {

      let newEvent = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: null,
        allDay: true
      };

      savedEvents.push(newEvent)
      localStorage.setItem('events', JSON.stringify(savedEvents));

      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: null,
        allDay: true
      })

      console.log('Added new event with title: ' + title)  
    }
  }

  // Function to show info about selected event on click

  handleEventClick = ( { event, el }) => {
    this.toggle();
    this.setState({ event: event });

    console.log('Clicked on event with title: ' + event.title + ' and id: ' + event.id);
    
  };

  // handleEvents = (events) => {
  //   this.setState({
  //     test: events
  //   })
  // }

  // Function to save new title

  handleTitleInput = (e) => {
  this.setState({ 
    title: e.target.value 
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
      <b>{moment(event.start).format('dddd, MMM Do, YYYY')}</b>
      <br />
      <i>{event.title}</i>
    </li>
  )
}

export default Calendar;
