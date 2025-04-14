import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Card, CardContent } from "@mui/material";

export default function Calendario() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarCitas = async () => {
      const res = await fetch("/horarios.json");
      const data = await res.json();

      const citas = data.citas.map((cita) => ({
        title: `${cita.nombre} - ${cita.servicio}`,
        date: cita.fecha,
      }));

      setEventos(citas);
    };

    cargarCitas();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <Card>
        <CardContent>
          <h2>Calendario de Citas</h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={eventos}
            height="auto"
          />
        </CardContent>
      </Card>
    </div>
  );
}