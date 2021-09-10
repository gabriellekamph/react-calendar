import React, { Component } from 'react';
import moment from 'moment';
import calendarimg from '../calendar.png';

class Sidebar extends Component {

    render() {

        // Render sidebar and sort list of events by date

        let countEvents;
        let eventList;
        let unsortedEvents = this.props.allEvents || [];

        const sortedEvents = unsortedEvents.sort((a, b) => {
        let x = moment(a.start).diff(b.start);
        if (x !== 0) {
            return x
        }
        return moment(a.start).diff(b.start);
        })

        if (!localStorage.getItem('events')){
        countEvents = "Let's add some todos, shall we?"
        eventList = '';
        } else {
        countEvents = '';
        eventList = sortedEvents.map(renderSidebarEvent)
        }

        return (
            <div className='sidebar'>
            <div className='sidebar-top'>
                <img src={calendarimg} alt="Calendar" />
                <h1>React calendar with todo's</h1>
                <hr />
            </div>
            <p><b>{countEvents}</b></p>
            <ul>{eventList}</ul>

            {
            localStorage.getItem('events') !== null ? <p className='remove-todos' onClick={this.handleRemoveCompleted}><i className='fas fa-trash-alt' onClick={this.handleRemoveCompleted} /> Remove all completed todos</p> : null
            }   
        </div>
        )
    }

    // Remove all completed todos after trash can click

    handleRemoveCompleted = () => {

        let array = JSON.parse(localStorage.getItem('events'));
        let c = window.confirm("Are you sure you want to remove all the completed todos?");

        if (c === true) {
        let newArray = array.filter(el => el.done !== true)
        localStorage.setItem('events', JSON.stringify(newArray));
        this.props.fetchEvents();
        }
    } 
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
        {moment(event.start).format('dddd, MMM Do, YYYY')}<br />
        {event.title}


      </li>
    )
}

export default Sidebar;