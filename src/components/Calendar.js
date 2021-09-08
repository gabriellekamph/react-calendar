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

  calendarRef = React.createRef();

  // Constructor to set initial state

  constructor(props) {
    super(props);
    this.state = {
      firstModal: false,
      secondModal: false,
      title: '',
      start: '',
      allEvents: [],
      event: [],
      todaysTodos: []
    };
  }

  // Fetch initial data

  componentDidMount() {
    this.fetchEvents();
  }

  // Fetch todos from local storage

  fetchEvents = () => {
    const eventsFromLocalStorage = JSON.parse(localStorage.getItem('events'));
    this.setState({ allEvents: eventsFromLocalStorage });
    console.log('Display all events from local storage');

    if (this.state.event.done === true) {
      console.log("these are checked")
    }
  }

  // Toggle modals between open and close (toggleFirst = show selected event, toggleSecond = create new event)

  toggleFirst = () => {
    this.setState({ firstModal: !this.state.firstModal, event: this.state.event });
    this.fetchEvents();
  };

  toggleSecond = () => {
    this.setState({ secondModal: !this.state.secondModal, event: this.state.event });
    this.fetchEvents();
  }

  onChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  onSubmit = (event) => {
    let calendarApi = this.calendarRef.current.getApi()
    let savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    let title = this.state.title;
    let start = this.state.start;
    
    event.preventDefault();

    if(title) {
      let newEvent = {
        id: createEventId(),
        title,
        start: start,
        end: null,
        allDay: true,
        done: null,
        color: "blue"
      };

      savedEvents.push(newEvent)
      localStorage.setItem('events', JSON.stringify(savedEvents));

      calendarApi.unselect();
      this.toggleSecond();
    }
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
              dateClick={this.handleDateClick}
            />

            {/* First modal to display selected event */}

          <Modal
          isOpen={this.state.firstModal}
          toggleFirst={this.toggleFirst}
          className={this.props.className}
          >
            <ModalHeader toggleFirst={this.toggleFirst}>
              <h3>{moment(this.state.event.start).format('dddd, MMM Do, YYYY')}</h3>
            </ModalHeader>
            <ModalBody>
              <h2>{this.state.event.title}</h2>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleCheckedEvent}>Mark as done</Button>
              <Button id="btn-delete-event" onClick={this.handleDeleteEvent}>Delete</Button>
              <Button onClick={this.toggleFirst}>Cancel</Button>
            </ModalFooter>
          </Modal>

          {/* Second modal to create new event */}

          <Modal
          isOpen={this.state.secondModal}
          toggleSecond={this.toggleSecond}
          className={this.props.className}
          >
            <ModalHeader toggleSecond={this.toggleSecond}>
            <h3>{moment(this.state.start).format('dddd, MMM Do, YYYY')}</h3>
            </ModalHeader>
            <form onSubmit={this.onSubmit}>
              <ModalBody>
              <h2><ul>
                {this.state.todaysTodos.map(item => (
                  <li key={item}>{item}</li>
                  ))}
              </ul></h2>
                <br />
                <h2>
                  Add new todo: <br />
                  <input type="text" name="title" placeholder="Title" onChange={this.onChange}></input>
                </h2>
              </ModalBody>
              <ModalFooter>
                <Button type='submit'>Save new todo</Button>
                <Button onClick={this.toggleSecond}>Cancel</Button>
              </ModalFooter>
            </form>
          </Modal>

        </div>
      </div>
    )
  }

  // Render sidebar and sort list of events by date

  renderSidebar() {

    let countEvents;
    let eventList;
    let unsortedEvents = this.state.allEvents || [];

    const sortedEvents = unsortedEvents.sort((a, b) => {
      let x = moment(a.start).diff(b.start);
      if (x !== 0) {
        return x
      }
      return moment(a.start).diff(b.start);
    })

    if (!localStorage.getItem('events')){
      countEvents = "No upcoming todos, let's add one!"
      eventList = '';
    } else {
      countEvents = 'Upcoming todos:';
      eventList = sortedEvents.map(renderSidebarEvent)
    }

    return (
      <div className='sidebar'>
        <h1>React calendar with todo's</h1>
        <h2>{countEvents}</h2>
        <ul>{eventList}</ul>
        <div>
          <p className='remove-todos' onClick={this.handleRemoveCompleted}><i className='fas fa-trash-alt' onClick={this.handleRemoveCompleted} /> Remove all completed todos</p>
        </div>
      </div>
    )
  }

  // Remove selected event on delete button click 

  handleDeleteEvent = () => {

    let eventId = this.state.event.id;
    this.state.event.remove();        // Removes event from calendar view

    let arr = JSON.parse(localStorage.getItem('events'));
    let updatedArr = arr.filter(function(a) {
      return a.id !== eventId;        // Removes event from local storage
    });

    localStorage.setItem('events', JSON.stringify(updatedArr));
    this.toggleFirst();
  }

  // Mark event as checked on button click

  handleCheckedEvent = () => {

    let eventId = this.state.event.id;
    let arr = JSON.parse(localStorage.getItem('events'));
    let updatedArr = arr.map(event => event.id === eventId ? { ...event, done: true, color: '#D3D3D3' } : event);

    localStorage.setItem('events', JSON.stringify(updatedArr));
    this.toggleFirst();
  }

  // Remove all completed todos after trash can click

  handleRemoveCompleted = () => {

    let array = JSON.parse(localStorage.getItem('events'));
    let c = window.confirm("Are you sure you want to remove all the completed todos?");

    if (c === true) {
      let newArray = array.filter(el => el.done !== true)
      localStorage.setItem('events', JSON.stringify(newArray));
      this.fetchEvents();
    }
  }

  // Display all current events on selected day 

  showTodaysEvent = (e) => {
    let todaysDate = this.state.start;
    let array = JSON.parse(localStorage.getItem('events')) || [];
    let filteredArray = array.filter(event => event.start === todaysDate) 
    let newestArray = filteredArray.map(todo => todo.title)
    this.setState({ todaysTodos: newestArray })
  }

  // Create new event after click on date

  handleDateSelect = (e) => {
    this.toggleSecond();
    this.setState({ start: e.startStr, todaysTodos: [] })
    this.showTodaysEvent();
  }

  // Show info about selected event on click

  handleEventClick = ( { event }) => {
    this.toggleFirst();
    this.setState({ event: event });
  };
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

  let setClass;

  if (event.done === true) {
    setClass = "done";
  } else {
    setClass = "notDone";
  }

  return (
    <li key={event.id} className={setClass}>
      <b>{moment(event.start).format('dddd, MMM Do, YYYY')}</b><br />
      <i>{event.title}</i>
    </li>
  )
}

export default Calendar;