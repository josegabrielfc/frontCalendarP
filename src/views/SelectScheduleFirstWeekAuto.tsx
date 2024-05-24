import React, { useEffect, useState } from "react";
import { getSemesters, getAutoSubjectsFromAPI } from "../api/api";
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
  const { addFirstWeek, firstWeek } = useSubject();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    let total = 0

    const response = getAutoSubjectsFromAPI()
    response.then( data => {
      const newEvents = [];
      const newRecords = [];
      data.forEach((subject) => {
        total += subject.schedules.length
        const schedules = [];
        subject.schedules.slice(0, subject.schedules.length / 2).forEach((schedule) => {
          schedules.push(schedule)
          const startHourString =
            typeof schedule.hora_inicio === "string"
              ? schedule.hora_inicio
              : "";
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
        newRecords.push([subject, schedules])
      });
      
      addFirstWeek(newRecords)
      console.log("First Week", total, " vs ", newEvents.length)
      setEvents(newEvents);
    })
  }, []);

  return <CalendarWeekView events={events} />;
};

const SelectScheduleFirstWeek: React.FC = () => {
  const navigate = useNavigate();
  const [randomizer, setRandomizer] = useState(false);

  useEffect(() => {
    document.body.classList.add("bodyC");
    return () => {
      document.body.classList.remove("bodyC");
    };
  }, []);

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
        <button className="next-page" onClick={goToAnotherPage}>
          Siguiente semana
        </button>
      </div>
      <br></br>
    </>
  );
};

export default SelectScheduleFirstWeek;
