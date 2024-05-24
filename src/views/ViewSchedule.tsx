import { FC, forwardRef, useRef, useState, useEffect } from 'react';

import './../style.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useSubject } from '../context/ScheduleContext';
import CalendarWeekView from '../components/CalendarWeekView';
import { useNavigate } from 'react-router-dom';
//import { generatePdf } from '../api/api';
import PdfWrapper from './../components/PdfWrapper';
import { getDates } from './../backend';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const AvailableSubjectsWeekCalendar: React.FC<{ subjects: any[] }> = ({  subjects }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newEvents = [];
    subjects.forEach((subject) => {
      subject.schedules.forEach((schedule) => {
        newEvents.push({
          title: subject.name,
          day: schedule.dia,
          startHour: parseInt(schedule.hora_inicio.split(':')[0], 10),
          endHour: parseInt(schedule.hora_fin.split(':')[0], 10),
          description: 'Grupo ' + schedule.grupo_id,
        });
      });
    });

    setEvents(newEvents);
  }, [subjects]);

  return <CalendarWeekView events={events} />;
};

const ViewSchedule: FC<{ name: string }> = ({ name }) => {
  const calendarRef = useRef();
  const { firstWeek, secondWeek } = useSubject();

  const navigate = useNavigate();

  const goToAnotherPage = () => {
    navigate('/home/report');
  };

  return (
    <>
      <div ref={calendarRef}>
        <h2> Horarios establecidad para la primera semana </h2>
        <AvailableSubjectsWeekCalendar subjects={firstWeek} />
        <h2> Horarios establecidad para la segunda semana </h2>
        <AvailableSubjectsWeekCalendar subjects={secondWeek} />
      </div>
      <div className="button-wrapper">
      <button className="next-page" onClick={goToAnotherPage}>
        Visualizar PDF
      </button>
      </div>
    </>
  );
};

export default ViewSchedule;

const localizer = momentLocalizer(moment);

const MyCalendar = forwardRef((props: { myDates: any[] }, ref) => (
  <div>
    <Calendar
      ref={ref}
      localizer={localizer}
      events={props.myDates}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
));
