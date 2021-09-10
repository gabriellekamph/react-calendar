import React, { Component } from 'react';
import FullCalendar, { eventTupleToStore } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '../components/calendar.scss';
import Sidebar from './Sidebar';

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
      todaysTodos: [],
      done: false
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

  // Create new event 

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
        done: false,
        color: '#89b6a0'
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
        <Sidebar allEvents={this.state.allEvents} fetchEvents={this.fetchEvents} />
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
          className="custom-modal-style"
          >
            <ModalHeader toggleFirst={this.toggleFirst}>
              <h2>{moment(this.state.event.start).format('dddd, MMM Do, YYYY')}</h2>
            </ModalHeader>
            <ModalBody>
              <h2>{this.state.event.title}</h2>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleCheckedEvent} id="done-btn">Mark as done</Button>
              <Button onClick={this.handleDeleteEvent}>Delete</Button>
              <Button onClick={this.toggleFirst}>Cancel</Button>
            </ModalFooter>
          </Modal>

          {/* Second modal to create new event */}

          <Modal
          isOpen={this.state.secondModal}
          toggleSecond={this.toggleSecond}
          className="custom-modal-style"
          >
            <ModalHeader toggleSecond={this.toggleSecond}>
            <h2>{moment(this.state.start).format('dddd, MMM Do, YYYY')}</h2>
            </ModalHeader>
            <form onSubmit={this.onSubmit}>
              <ModalBody>
              <h4><ul>
                {this.state.todaysTodos.map(item => (
                  <li key={item}>{item}</li>
                  ))}
              </ul></h4>
                <h4>
                  Add new todo: <br />
                </h4>
                <input type="text" name="title" placeholder="Title" onChange={this.onChange}></input>
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
    let updatedArr = arr.map(event => event.id === eventId ? { ...event, done: true, color: '#D3D3D3'} : event);

    localStorage.setItem('events', JSON.stringify(updatedArr));
    this.toggleFirst();

    
    }

  // Display all current events on selected day 

  showTodaysEvent = () => {
    let todaysDate = this.state.start;
    let array = JSON.parse(localStorage.getItem('events')) || [];
    let filteredArray = array.filter(event => event.start === todaysDate && event.done === false) 
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

  handleEventClick = ({ event }) => {

    this.setState({ event: event });
    let thisId = event.id;

    let array = JSON.parse(localStorage.getItem('events')) || [];
    let doneStatus = array.filter(event => event.id === thisId && event.done === false) 
    let newestArray = doneStatus.map(todo => {this.toggleFirst()})

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