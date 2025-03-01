import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Configuración de idioma
moment.locale('es');
const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          start: new Date(doc.data().date.seconds * 1000),
          end: new Date(doc.data().date.seconds * 1000),
          desc: doc.data().description,
          price: doc.data().price
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#C5A47E', // Color de tu paleta
        border: 'none',
        borderRadius: '4px',
        color: 'white'
      }
    };
  };

  return (
    <div className="my-5 p-3" style={{ height: '80vh', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">Calendario de Eventos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
      />
    </div>
  );
};

export default EventCalendar;