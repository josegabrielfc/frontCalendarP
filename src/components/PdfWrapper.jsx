import React, { useRef, useEffect, useState } from 'react';
import { useSubject } from './../context/ScheduleContext';
import { getSemesters, getSubjectsFromAPI } from "../api/api";

import './../styles/pdf_wrapper.css';
import Logo from './../assets/logo.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PdfWrapper = () => {
  const {firstWeek, secondWeek} = useSubject();
  const [availableSubjectsBySemester, setAvailableSubjectsBySemester] =
    useState([]);
  const reportRef = useRef(null)

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      try {
        const subjects = [...firstWeek, ...secondWeek]
        const semesters = await getSemesters();
        let subjectsBySemester = [];
        Object.entries(semesters.semestres).forEach(([semester, _]) => {
          const curr = {};
          curr.id = semester;

          curr.subjects = subjects.filter((subject) =>
            _.some((el) => el.id === subject.id)
          ).filter(subject => Array.from(subject.schedules.values()).length > 0)
          .map(subject => Array.from(subject.schedules.values()))
          .reduce((acc, el) => [...acc, ...el], [])

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
  }, [])

  const printDocument = () => {
    //generatePdf(null);
      const doc = new jsPDF({ format: [1440, 2160] });

      doc.html(reportRef.current, {
        callback: function (pdf) {
          pdf.save('schedule.pdf');
        },
      });
  };

  const renderTable = () => {
    return (
      <div class="center-div" id="tablasContainer">
        {availableSubjectsBySemester.length > 0 && availableSubjectsBySemester.map(el => {
          return (
            <table class="table table-striped">
              <thead>
                <tr>
                  <th colspan="4" class="centered">
                    SEMESTRE {el.id}
                  </th>
                </tr>
              </thead>
              <tbody>
                {el.subjects.map((schedule) => (
                    <tr>
                      <td className="letter-spacingX">
                        {schedule.materia_id}-{schedule.grupo_id}
                      </td>
                      <td>{schedule.name}</td>
                      <td className="letter-spacing">{schedule.formatDay.toISOString().split('T')[0].replace(/-/g, '/')}</td>
                      <td className="letter-spacing">{schedule.hora_inicio} - {schedule.hora_fin} {schedule.salon}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
        })}
        {/* {secondWeek.length > 0 && (
          <table class="table table-striped">
            <thead>
              <tr>
                <th colspan="4" class="centered">
                  SEMANA 2
                </th>
              </tr>
            </thead>
            <tbody>
              {secondWeek.map((subject) =>
                Array.from(subject.schedules.values()).map((schedule) => (
                  <tr>
                    <td className="letter-spacingX">
                      {subject.id}-{schedule.grupo_id}
                    </td>
                    <td>{subject.name}</td>
                    <td className="letter-spacing">{schedule.formatDay.toISOString().split('T')[0].replace(/-/g, '/')}</td>
                    <td className="letter-spacing">{schedule.hora_inicio} - {schedule.hora_fin} {schedule.salon}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )} */}
      </div>
    );
  };

  return (
    <div class="pdf-size" ref={reportRef}>
      <div class="top">
        <img src={Logo} alt="Descripción de la imagen" />
      </div>
      <div class="text-size">
        <h3>RESOLUCIÓN N° 03 </h3>
        <h3>31 de octubre de 2023</h3>
        <br />
        <h4>
          POR LA CUAL SE PROGRAMAN LAS FECHAS DE EXÁMENES FINALES DEL PLAN DE
          ESTUDIOS DE INGENIERÍA DE SISTEMAS, CORRESPONDIENTES  AL SEMESTRE 2023
          - 2.
        </h4>
        <p>
          EL DIRECTOR DEL PLAN DE ESTUDIOS DE INGENIERÍA DE SISTEMAS DE LA UFPS,
          en uso de sus facultades reglamentadas,
        </p>
        <br />
        <h3>RESUELVE:</h3>
        <h4>
          ARTÍCULO ÚNICO: Establecer las fechas de EXÁMENES FINALES <br />{' '}
          correspondientes a los estudiantes del Plan de Estudios de INGENIERÍA
          DE SISTEMAS
        </h4>
        <br />
        <div class="center-div" id="tablasContainer">
          {renderTable()}
        </div>
        <br />
        <button class="butn" id="myguionpdf" onClick={printDocument}>
          Descargar PDF
        </button>
      </div>
      <br></br>
    </div>
  );
};

export default PdfWrapper;
