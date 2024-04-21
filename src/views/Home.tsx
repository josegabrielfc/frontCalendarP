import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/home.css";
import "./../styles/fancyFile.css";
import { registerUser, sendExcel } from "../api/api";
import imagenes from "../assets/imagenes.js";

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectWay, setSelectWay] = useState<string>("");
  const [fileName, setFileName] = useState<string>(
    "Ningún archivo seleccionado"
  );
  const navigate = useNavigate(); // Utiliza useNavigate para la navegación
  const goToAnotherPage = () => {
    navigate(`/select/week1/${selectWay}`);
  };

  console.log(selectedDate);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
    setFileName(
      selectedFile ? selectedFile.name : "Ningún archivo seleccionado"
    );
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSelectWay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectWay(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fecha", selectedDate);

      if (file) {
        formData.append("calendario", file);
      }

      const response = await sendExcel(formData);

      if (response) {
        const fechasArray = await response;
        console.log("Fechas recibidas:", fechasArray);

        // Después de recibir la respuesta del backend, navega a otra página
        goToAnotherPage();
      } else {
        console.error("Error al enviar la fecha y el archivo al backend");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <body>
      <div className="container">
        <div className="header-container">
          <img src={imagenes.header} alt="Header" />
        </div>
        <h1>UFPS CALENDAR</h1>
        <div className="my-form-container">
          <h2>Ingrese los siguientes datos</h2>
          <form className="my-form" onSubmit={handleSubmit}>
            <div>
              <input
                type="file"
                className="fancy-file red"
                id="archivo"
                onChange={handleFileChange}
                accept=".xlsx"
                data-button="Examinar"
                data-empty="Sin archivos"
              ></input>
              <label htmlFor="archivo">
                <span className="fancy-file__fancy-file-name">{fileName}</span>
                <span className="fancy-file__fancy-file-button">
                  Buscar archivo
                </span>
              </label>
            </div>
            <br></br>
            <div className="form-group">
              <label>
                Seleccionar Fecha:
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </label>
            </div>
            <br></br>
            <form action="#">
              <label htmlFor="lang">
                Seleccione como desea generar su Calendario
              </label>
              <div className="content-select">
                <select name="opciones" id="lang" onChange={handleSelectWay}>
                  <option value="">-</option>
                  <option value="manual">Manual</option>
                  <option value="auto">Automatico</option>
                </select>
                <i></i>
              </div>
            </form>
            <div className="form-group">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
};

export default Home;
