import React, { useEffect, useState } from "react";
import {
  getAutoSubjectsFromAPI,
  getSemesters,
  getSubjectsFromAPI,
} from "../api/api";
import {
  Schedule,
  Subject,
  SubjectSchedule,
  SubjectsBySemester,
} from "../types/types";
import { SubjectProvider, useSubject } from "../context/ScheduleContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import CalendarWeekView from "../components/CalendarWeekView";
import { getDatesWeek } from "../backend";
import moment from "moment";
import "./../styles/select_schedule.css";
import { useNavigate } from "react-router-dom";
import { legibleDate, convertDay, getInitialDate, isInCurrentWeek, getStartWeekDate } from "../utils/utils";

const AvailableSubjectsWeekCalendar: React.FC = () => {
  const {
    addSecondWeek,
    insertNewFirstWeek,
    secondWeek,
    firstWeek,
    initialDate,
    secondInitialDate,
    holidays
  } = useSubject();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const assignSchedule = async () => {
      let total = 0;

      let subjectsWithSchedules = await getAutoSubjectsFromAPI();

      subjectsWithSchedules.forEach((subject) => {
        const usedSubject = firstWeek.find((s) => subject.id === s.id);

        subject.schedules = subject.schedules.filter((schedule) => {
          return !usedSubject || !usedSubject.schedules.has(schedule.grupo_id);
        });

        subject.schedules = subject.schedules.sort((a, b) =>
          a.grupo_id < b.grupo_id ? -1 : 1
        );
      });

      subjectsWithSchedules = subjectsWithSchedules.filter(
        (subject) => subject.schedules && subject.schedules.length != 0
      );
      const newEvents = [];
      const firstWeekRecords = [];
      const secondWeekRecords = [];
      subjectsWithSchedules.forEach((subject) => {
        total += subject.schedules.length;
        const schedulesFirstWeek = [];
        const schedulesSecondWeek = [];
        subject.schedules
        .forEach((schedule) => {
            if (!isInCurrentWeek(secondInitialDate, schedule.dia, holidays)) {
              schedulesFirstWeek.push(schedule);
              schedule.calendarDay =  legibleDate(convertDay(schedule.dia, initialDate, holidays));
              schedule.formatDay =  convertDay(schedule.dia, initialDate, holidays)
              return;
            }
            schedulesSecondWeek.push(schedule)
            const startHourString =
            typeof schedule.hora_inicio === "string"
            ? schedule.hora_inicio
            : "";
            const endHourString =
            typeof schedule.hora_fin === "string" ? schedule.hora_fin : "";
            
            newEvents.push({
              title: subject.name,
              day: schedule.dia,
              calendarDay: convertDay(schedule.dia, secondInitialDate, holidays),
              startHour: parseInt(startHourString.split(":")[0], 10),
              endHour: parseInt(endHourString.split(":")[0], 10),
              description: "Grupo " + schedule.grupo_id,
            });
            schedule.calendarDay =  legibleDate(convertDay(schedule.dia, secondInitialDate, holidays));
            schedule.formatDay =  convertDay(schedule.dia, secondInitialDate, holidays)
          });
        firstWeekRecords.push([subject, schedulesFirstWeek])
        secondWeekRecords.push([subject, schedulesSecondWeek])
      });
      insertNewFirstWeek(firstWeekRecords)
      addSecondWeek(secondWeekRecords)
      setEvents(newEvents);
    };

    assignSchedule();
  }, []);

  return <CalendarWeekView events={events} initialDate={getStartWeekDate(secondInitialDate)}/>;
};

const SelectScheduleSecondWeek: React.FC = () => {
  const navigate = useNavigate();

  const goToAnotherPage = () => {
    navigate("/home/schedule");
  };

  return (
    <>
      <h2> Estas son las materias disponibles: </h2>
      <h2> El horario generado para la segunda semana es </h2>
      <div className="calendar">
      <AvailableSubjectsWeekCalendar />
      </div>
      <div className="button-wrapper">
        <button className="next-page" onClick={goToAnotherPage}>
          Ir a horario
        </button>
      </div>
      <br></br>
    </>
  );
};

export default SelectScheduleSecondWeek;
