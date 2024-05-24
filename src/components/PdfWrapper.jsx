import React, { useRef } from 'react';
import { useSubject } from './../context/ScheduleContext';
import './../styles/pdf_wrapper.css';
import Logo from './../assets/logo.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PdfWrapper = () => {
  const {firstWeek, secondWeek} = useSubject();
  const reportRef = useRef(null)

  const printDocument = () => {
    //generatePdf(null);
      const doc = new jsPDF({ format: [1440, 2160] });

      doc.html(reportRef.current, {
        callback: function (pdf) {
          pdf.save('schedule.pdf');
        },
      });

    // const addImageToPdf = (imgData) => {
    //   const pdf = new jsPDF('p', 'mm', 'a4'); // Ajusta el tamaño del PDF si es necesario
    //   const imgProps = pdf.getImageProperties(imgData);
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();
      
    //   // Calcular la escala para mantener la relación de aspecto de la imagen
    //   const imgWidth = pdfWidth;
    //   const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    
    //   // Calcular la posición x,y para centrar la imagen
    //   const x = 0;
    //   const y = (pdfHeight - imgHeight) / 2; // Ajusta si también quieres centrar verticalmente
    
    //   pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    //   pdf.save('schedule.pdf');
    // };

    // html2canvas(reportRef.current).then(canvas => {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF({ format: [720, 1080] });
    //   addImageToPdf(imgData);
    // });
  };

  const renderTable = () => {
    return (
      <div class="center-div" id="tablasContainer">
        {firstWeek.length > 0 && (
          <table class="table table-striped">
            <thead>
              <tr>
                <th colspan="4" class="centered">
                  SEMANA 1
                </th>
              </tr>
            </thead>
            <tbody>
              {firstWeek.map((subject) =>
                Array.from(subject.schedules.values()).map((schedule) => (
                  <tr>
                    <td className="letter-spacingX">
                      {subject.id}-{schedule.grupo_id}
                    </td>
                    <td>{subject.name}</td>
                    <td className="letter-spacing">14/12/2023</td>
                    <td className="letter-spacing">{schedule.hora_inicio} - {schedule.hora_fin} {schedule.salon}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {secondWeek.length > 0 && (
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
                    <td className="letter-spacing">14/12/2023</td>
                    <td className="letter-spacing">{schedule.hora_inicio} - {schedule.hora_fin} {schedule.salon}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
