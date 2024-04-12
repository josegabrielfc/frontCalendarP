import React, { useEffect, useState } from "react";
import { getSemesters, getSubjectsFromAPI } from "../api/api";
import {
  Schedule,
  Subject,
  SubjectSchedule,
  ParentSubject,
  SubjectsBySemester,
} from "../types/types";
import { SubjectProvider, useSubject } from "./../context/ScheduleContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import CalendarWeekView from "./../components/CalendarWeekView";
import { getDatesWeek } from "./../backend";
import moment from "moment";
import "./../styles/select_schedule.css";
import { useNavigate } from "react-router-dom";

const AvailableSubjectsTable: React.FC<{randomize: boolean}> = ({ randomize }) => {
  const { addSubjectFirstWeek: addSubject, firstWeek: subjects } = useSubject();
  // const [availableSubjects, setAvailableSubjects] = useState<SubjectSchedule[]>(
  //   []
  // );
  const [availableSubjectsBySemester, setAvailableSubjectsBySemester] =
    useState<SubjectsBySemester[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<
    (SubjectSchedule | ParentSubject)[]
  >([]);
  const [openSubjectId, setOpenSubjectId] = useState(null);
  const [openSemesterId, setOpenSemesterId] = useState(null);

  const toggleSubject = (subjectId) => {
    setOpenSubjectId(openSubjectId === subjectId ? null : subjectId);
  };

  const toggleSemester = (semesterId) => {
    setOpenSemesterId(openSemesterId === semesterId ? null : semesterId);
  };

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      try {
        const semesters = await getSemesters();
        const subjectsWithSchedules = await getSubjectsFromAPI();
        subjectsWithSchedules.forEach(
          (subject) =>
            (subject.schedules = subject.schedules.sort((a, b) =>
              a.grupo_id < b.grupo_id ? -1 : 1
            ))
        );

        let subjectsBySemester: SubjectsBySemester[] = [];
        Object.entries(semesters.semestres).forEach(([semester, subjects]) => {
          const curr: SubjectsBySemester = {} as SubjectsBySemester;
          curr.id = semester;
          subjectsBySemester.push(curr);

          curr.subjects = subjectsWithSchedules.filter((subject) =>
            subjects.some((el) => el.id === subject.id)
          );
        });

        subjectsBySemester = subjectsBySemester.sort((a, b) =>
          parseInt(a.id) < parseInt(b.id) ? -1 : 1
        );

        setAvailableSubjectsBySemester(subjectsBySemester);
        setAvailableSubjects(subjectsWithSchedules);

        if (randomize) {

        }
      } catch (error) {
        console.error("Error fetching available subjects:", error);
        // Handle errors appropriately
      }
    };

    fetchAvailableSubjects();
  }, []);

  const selectSchedule: (subject: Subject, schedule: Schedule) => void = (
    subject,
    schedule
  ) => {
    addSubject(subject, schedule);
  };

  return (
    <div className="big-container">
      {availableSubjectsBySemester.map((semester, key) => {
        return (
          <div className="semester-row" key={key}>
            <button
              className="semester-name"
              onClick={() => toggleSemester(semester.id)}
            >
              SEMESTRE {semester.id}
            </button>
            {openSemesterId === semester.id && (
              <div className="subjects-container">
                {semester.subjects.map((subject) => (
                  <div key={subject.id} className="subject-container">
                    <button
                      className="subject-name"
                      onClick={() => toggleSubject(subject.id)}
                    >
                      {subject.name}
                    </button>

                    {openSubjectId === subject.id && (
                      <div className="schedule-container">
                        {subject.schedules.map((schedule) => {
                          const isSelected = subjects.find(
                            (s) =>
                              s.id === subject.id &&
                              s.schedules.has(schedule.grupo_id) &&
                              s.schedules.get(schedule.grupo_id).id ===
                                schedule.id
                          );

                          return (
                            <div
                              key={schedule.id}
                              className={
                                "schedule" + (isSelected ? " selected" : "")
                              }
                              onClick={() => selectSchedule(subject, schedule)}
                            >
                              <div>Codigo: {subject.id}</div>
                              <div>Grupo: {schedule.grupo_id}</div>
                              <div>Dia: {schedule.dia}</div>
                              <div>
                                Hora Inicio: {schedule.hora_inicio as any}
                              </div>
                              <div>Hora Fin: {schedule.hora_fin as any}</div>
                              <div>Salon: {schedule.salon}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

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
    navigate("/select/week2");
  };

  return (
    <>
      <h2> Estas son las materias disponibles: </h2>
      <AvailableSubjectsTable randomize={randomizer}/>
      <h2> El horario generado para la primera semana es </h2>
      <AvailableSubjectsWeekCalendar />
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
