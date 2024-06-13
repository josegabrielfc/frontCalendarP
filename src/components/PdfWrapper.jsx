import React, { useRef, useEffect, useState } from 'react';
import { useSubject } from './../context/ScheduleContext';
import { getSemesters } from "../api/api";
import { useLocation } from 'react-router-dom';

import './../styles/pdf_wrapper.css';
import Logo from './../assets/logo.jpg';
import jsPDF from 'jspdf';

const PdfWrapper = () => {
  const { firstWeek, secondWeek } = useSubject();
  const [availableSubjectsBySemester, setAvailableSubjectsBySemester] = useState([]);
  const reportRef = useRef(null);
  const location = useLocation();
  const { resolucion, fecha, descripcion, director, articulo } = location.state || {};

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      try {
        const subjects = [...firstWeek, ...secondWeek];
        const semesters = await getSemesters();
        let subjectsBySemester = [];
        Object.entries(semesters.semestres).forEach(([semester, _]) => {
          const curr = {};
          curr.id = semester;
          curr.subjects = subjects.filter((subject) =>
            _.some((el) => el.id === subject.id)
          ).filter(subject => Array.from(subject.schedules.values()).length > 0)
          .map(subject => Array.from(subject.schedules.values()))
          .reduce((acc, el) => [...acc, ...el], []);

          if (curr.subjects.length > 0)
            subjectsBySemester.push(curr);
        });

        subjectsBySemester = subjectsBySemester.sort((a, b) =>
          parseInt(a.id) < parseInt(b.id) ? -1 : 1
        );

        setAvailableSubjectsBySemester(subjectsBySemester);
      } catch (error) {
        console.error("Error fetching available subjects:", error);
      }
    };
    fetchAvailableSubjects();
  }, [firstWeek, secondWeek]);

  const printDocument = () => {
    const doc = new jsPDF({ format: [1440, 2160] });
    doc.html(reportRef.current, {
      callback: function (pdf) {
        pdf.save('schedule.pdf');
      },
    });
  };

  const renderTable = () => {
    return (
      <div className="center-div" id="tablasContainer">
        {availableSubjectsBySemester.length > 0 && availableSubjectsBySemester.map(el => {
          return (
            <table className="table table-striped" key={el.id}>
              <thead>
                <tr>
                  <th colSpan="4" className="centered">
                    SEMESTRE {el.id}
                  </th>
                </tr>
              </thead>
              <tbody>
                {el.subjects.map((schedule) => (
                  <tr key={schedule.materia_id + '-' + schedule.grupo_id}>
                    <td className="letter-spacingX">
                      {schedule.materia_id}-{schedule.grupo_id}
                    </td>
                    <td>{schedule.name}</td>
                    <td className="letter-spacing">{schedule.formatDay.toISOString().split('T')[0].replace(/-/g, '/')}</td>
                    <td className="letter-spacing">{schedule.hora_inicio} - {schedule.hora_fin} {schedule.salon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pdf-size" ref={reportRef}>
      <div className="top">
        <img src={Logo} alt="Descripción de la imagen" />
      </div>
      <div className="text-size">
        <br /><br /><br /><br /><br /><br />
        <h3>RESOLUCIÓN N° {resolucion}</h3>
        <h3>{fecha}</h3>
        <h4>{descripcion}</h4>
        <p>{director}</p>
        <br />
        <h3>RESUELVE:</h3>
        <h4>{articulo}</h4>
        <div className="center-div" id="tablasContainer">
          {renderTable()}
        </div>
        <br />
        <button className="butn" id="myguionpdf" onClick={printDocument}>
          Descargar PDF
        </button>
      </div>
      <br />
    </div>
  );
};

export default PdfWrapper;
