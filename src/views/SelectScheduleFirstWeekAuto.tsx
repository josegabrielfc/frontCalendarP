import React, { useEffect, useState } from "react";
import { getSemesters, getSubjectsFromAPI } from "../api/api";
import {
  Schedule,
  Subject,
  SubjectSchedule,
  ParentSubject,
  SubjectsBySemester,
} from "../types/types";
import { SubjectProvider, useSubject } from "../context/ScheduleContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import CalendarWeekView from "../components/CalendarWeekView";
import { getDatesWeek } from "../backend";
import moment from "moment";
import "./../styles/select_schedule.css";
import { useNavigate } from "react-router-dom";


const AvailableSubjectsWeekCalendar: React.FC = () => {
  const { firstWeek } = useSubject();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newEvents = [];
    firstWeek.forEach((subject) => {
      subject.schedules.forEach((schedule) => {
        const startHourString =
          typeof schedule.hora_inicio === "string" ? schedule.hora_inicio : "";
        const endHourString =
          typeof schedule.hora_fin === "string" ? schedule.hora_fin : "";

        newEvents.push({
          title: subject.name,
          day: schedule.dia,
          startHour: parseInt(startHourString.split(":")[0], 10),
          endHour: parseInt(endHourString.split(":")[0], 10),
          description: "Grupo " + schedule.grupo_id,
        });
      });
    });
    setEvents(newEvents);
  }, [firstWeek]);

  return <CalendarWeekView events={events} />;
};

const SelectScheduleFirstWeek: React.FC = () => {
  const navigate = useNavigate();
  const [randomizer, setRandomizer] = useState(false);

  const handleRandomize = () => {
    setRandomizer(true)
    setTimeout(() => goToAnotherPage(), 1000);
  }

  const goToAnotherPage = () => {
    navigate("/select/week2/auto");
  };

  return (
    <>
      <h2> El horario generado para la primera semana es </h2>
      <div className="calendar">
      <AvailableSubjectsWeekCalendar />
      </div>
      <div className="button-wrapper">
        <button className="next-page" onClick={handleRandomize}>
          Generar aleatorio
        </button>
        <button className="next-page" onClick={goToAnotherPage}>
          Siguiente semana
        </button>
      </div>
    </>
  );
};

export default SelectScheduleFirstWeek;
