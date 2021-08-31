import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export class Calendar extends Component {

  calendarRef = React.createRef()
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
          events={this.state.currentEvents}
          eventClick={this.handleEventClick}
          select={this.handleDateSelect}
          eventsSet={this.handleEvents}

          // eventsDidUpdate={this.handleEventsDidUpdate}
          // eventContent={renderEventContent}
          // eventClick={this.handleEventClick}
          // dateClick={this.handleDateClick}
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


  // handleEvents = (events) => {
  //   this.setState({
  //     currentEvents: events
  //   })
  // }


  // Function to show info about selected event on click

  handleEventClick = (info) => {
    alert('Event: ' + info.event.title + ' Id:' + info.event.id);
    console.log("Clicked on event with title: " + info.event.title + " and id: " + info.event.id);
  }
}

let eventGuid = 0
function createEventId() {
  return String(eventGuid++)
}

export default Calendar;
