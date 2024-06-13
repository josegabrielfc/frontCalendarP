import { FC, forwardRef, useRef, useState, useEffect } from "react";

import "./../style.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useSubject } from "../context/ScheduleContext";
import CalendarWeekView from "../components/CalendarWeekView";
import { useNavigate } from "react-router-dom";
//import { generatePdf } from '../api/api';
import PdfWrapper from "./../components/PdfWrapper";
import { getDates } from "./../backend";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AvailableSubjectsWeekCalendar: React.FC<{
  subjects: any[];
  initialDate: any;
}> = ({ subjects, initialDate }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newEvents = [];
    subjects.forEach((subject) => {
      subject.schedules.forEach((schedule) => {
        newEvents.push({
          title: subject.name,
          day: schedule.dia,
          startHour: parseInt(schedule.hora_inicio.split(":")[0], 10),
          endHour: parseInt(schedule.hora_fin.split(":")[0], 10),
          description: "Grupo " + schedule.grupo_id,
        });
      });
    });

    setEvents(newEvents);
  }, [subjects]);

  return <CalendarWeekView events={events} initialDate={initialDate} />;
};

const ViewSchedule: FC<{ name: string }> = ({ name }) => {
  const calendarRef = useRef();
  const { firstWeek, secondWeek, initialDate, secondInitialDate } =
    useSubject();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    resolucion: "",
    fecha: "",
    descripcion: "",
    director: "",
    articulo: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("bodyC");
    return () => {
      document.body.classList.remove("bodyC");
    };
  }, []);

  useEffect(() => {
    if (showForm) {
      // Obtenemos la posición del formulario
      const formPosition = document.querySelector('.container').getBoundingClientRect().top + window.scrollY;
      // Desplazamos la página hacia la posición del formulario
      window.scrollTo({
        top: formPosition,
        behavior: 'smooth' // Para que el desplazamiento sea suave
      });
    }
  }, [showForm]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/home/report", { state: formData });
  };

  const showPdfForm = () => {
    setShowForm(true);
  };

  return (
    <>
      <div ref={calendarRef}>
        <h2> Horarios establecidos para la primera semana </h2>
        <div className="calendar">
          <AvailableSubjectsWeekCalendar
            subjects={firstWeek}
            initialDate={initialDate}
          />
        </div>
        <h2> Horarios establecidos para la segunda semana </h2>
        <div className="calendar">
          <AvailableSubjectsWeekCalendar
            subjects={secondWeek}
            initialDate={secondInitialDate}
          />
        </div>
      </div>
      <div className="button-wrapper">
        <button className="next-page" onClick={showPdfForm}>
          Visualizar PDF
        </button>
      </div>
      {showForm && (
        <div className="container">
          <div className="form-wrapper">
            <form onSubmit={handleFormSubmit}>
              <h2>EJEMPLO: </h2>
              <h3>RESOLUCIÓN N° 03 </h3>
              <h3>19 de marzo de 2024</h3>
              <br />
              <h4>
                POR LA CUAL SE PROGRAMAN LAS FECHAS DE EXAMENES FINALES DEL PLAN
                DE ESTUDIOS DE INGENIERÍA DE SISTEMAS, CORRESPONDIENTES AL SEMESTRE
                2024 - 1
              </h4>
              <p>
                EL DIRECTOR DEL PLAN DE ESTUDIOS DE INGENIERÍA DE SISTEMAS DE LA
                UFPS, en uso de sus facultades reglamentadas,
              </p>
              <br />
              <h3>RESUELVE:</h3>
              <h4>
                ARTÍCULO ÚNICO: Establecer las fechas de EXÁMENES FINALES <br />{" "}
                correspondientes a los estudiantes del Plan de Estudios de
                INGENIERÍA DE SISTEMAS
              </h4>
              <br />
              <label>
                Resolución N°:
                <input
                  type="text"
                  name="resolucion"
                  value={formData.resolucion}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <br />
              <label>
                Fecha:
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <br />
              <label>
                Descripción:
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <br />
              <label>
                Director:
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Artículo Unico:
                <textarea
                  name="articulo"
                  value={formData.articulo}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      )}
      <br />
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
