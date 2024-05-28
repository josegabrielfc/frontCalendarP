import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/home.css";
import "./../styles/fancyFile.css";
import { getHolidays, registerUser, sendExcel } from "../api/api";
import imagenes from "../assets/imagenes.js";
import { useSubject } from "../context/ScheduleContext";

const Home: React.FC = () => {
  const { setInitialDate, setHolidays } = useSubject();
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectWay, setSelectWay] = useState<string>("");
  const [fileName, setFileName] = useState<string>(
    "Ningún archivo seleccionado"
  );
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate(); // Utiliza useNavigate para la navegación

  useEffect(() => {
    getHolidays().then(data => setHolidays(data))
  }, []);

  const goToAnotherPage = () => {
    navigate(`/select/week1/${selectWay}`);
  };

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

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleSelectWay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectWay(event.target.value);
  };

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };
  
  const validateForm = () => {
    const newErrors = [];
    const today = normalizeDate(new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })));
    const start = normalizeDate(new Date(startDate));
    const end = normalizeDate(new Date(endDate));
    const minimumEndDate = new Date(start);
    minimumEndDate.setDate(start.getDate() + 12);
  
    if (!file) {
      newErrors.push("No se ha subido ningún archivo");
    } else if (file && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      newErrors.push("Solo se permite archivos tipo excel");
    }
  
    if (!startDate) {
      newErrors.push("No se ha proporcionado la fecha de inicio");
    } else if (start < today) {
      newErrors.push("La fecha de inicio no puede ser antes del día de hoy");
    }
  
    if (!endDate) {
      newErrors.push("No se ha proporcionado la fecha de fin");
    } else if (end < start) {
      newErrors.push("La fecha de fin no puede ser anterior a la fecha de inicio");
    } else if (end < minimumEndDate) {
      newErrors.push("El rango de fechas es menor al esperado");
    }
  
    if (!selectWay) {
      newErrors.push("Se debe elegir una manera para poder generar su calendario");
    }
  
    return newErrors;
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      alert(formErrors.join("\n"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fecha", startDate);
      setInitialDate(new Date(startDate.replaceAll("-", "/")));

      if (file) {
        formData.append("calendario", file);
      }

      const response = await sendExcel(formData);

      if (response) {
        const fechasArray = await response;
        console.log("Fechas recibidas:", fechasArray);

        goToAnotherPage();
      } else {
        console.error("Error al enviar la fecha y el archivo al backend");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
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
          <div className="date-group">
            <div className="form-group">
              <label>Fecha de inicio:</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="form-group">
              <label>Fecha de fin:</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <br></br>

          <div className="form-group">
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
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
