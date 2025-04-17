import { useState, useEffect } from "react";
import { Card, CardContent, Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // para poder hacer clic
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [citas, setCitas] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const router = useRouter();

  // Función para redirigir a la página principal
  const handleGoHome = () => {
    router.push('/administrador');  // Redirige a la página principal
  };

  // Función para obtener las citas
  const fetchCitas = async () => {
    const { data, error } = await supabase
      .from("citas")
      .select("*");

    if (error) {
      console.error("Error al obtener citas:", error);
    } else {
      console.log("Datos de citas desde Supabase:", data);
      setCitas(data); // Actualiza el estado con los datos recibidos
    }
  };

  // UseEffect para cargar las citas al inicio
  useEffect(() => {
    fetchCitas();
  }, []);

  // Formateamos las citas para FullCalendar
const eventos = citas.map((cita) => {
  // Aseguramos que fecha y hora estén en el formato adecuado
  // Si la hora tiene segundos (ejemplo: "09:00:00"), la cortamos a "09:00"
  let hora = cita.hora;

  // Asegúrate de que no haya más de dos segmentos en la hora (HH:mm)
  if (hora && hora.split(":").length > 2) {
    hora = hora.split(":").slice(0, 2).join(":"); // "HH:mm" sin segundos
  }

  // Ahora formateamos la fecha completa
  const fechaHora = `${cita.fecha}T${hora}:00`; // Por ejemplo: '2025-04-17T09:00:00'

  return {
    title: `${cita.nombre} - ${cita.servicio}`,
    start: fechaHora,  // Fecha y hora combinadas
    extendedProps: {
      nombre: cita.nombre,
      telefono: cita.telefono,
      fecha: cita.fecha,
      hora: hora,
      servicio: cita.servicio,
      comentario: cita.comentario,
    },
  };
});



console.log("Eventos para FullCalendar:", eventos);  // Verifica aquí que los eventos tengan el formato adecuado

  const handleEventoClick = (info) => {
    setEventoSeleccionado(info.event.extendedProps);
  };

  const handleCloseDialog = () => {
    setEventoSeleccionado(null);
  };

  const handleDelete = async () => {
    if (!eventoSeleccionado) return;

    const { data, error } = await supabase
      .from("citas")
      .delete()
      .eq("fecha", eventoSeleccionado.fecha)
      .eq("hora", eventoSeleccionado.hora);

    if (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Error al eliminar la cita");
    } else {
      alert("Cita eliminada");
      setEventoSeleccionado(null);
      fetchCitas(); // Actualiza las citas después de la eliminación
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      {/* Encabezado con botón atrás y logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Button
          variant="contained"
          onClick={handleGoHome}
          style={{
            backgroundColor: "white",  // Fondo blanco
            color: "black",            // Texto negro
            border: "1px solid #ccc",  // Borde opcional (puedes personalizarlo)
            marginRight: "10px",       // Mantener el margen
          }}
        >
          Atrás
        </Button>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black" }}>
        <CardContent>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Calendario de Citas</h2>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={eventos}
            locale="es"
            eventClick={handleEventoClick}
            height="auto"
            contentHeight="auto"
            headerToolbar={{
              left: 'prev,next',  // Mantén los botones de navegación (anterior, siguiente)
              center: 'title',    // El título sigue apareciendo en el centro
              right: ''           // Eliminamos el botón "Month" y cualquier otro botón en la parte derecha
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={Boolean(eventoSeleccionado)} onClose={handleCloseDialog}>
        <DialogTitle>Detalles de la Cita</DialogTitle>
        <DialogContent>
          {eventoSeleccionado && (
            <>
              <Typography><strong>Nombre:</strong> {eventoSeleccionado.nombre}</Typography>
              <Typography><strong>Teléfono:</strong> {eventoSeleccionado.telefono}</Typography>
              <Typography><strong>Servicio:</strong> {eventoSeleccionado.servicio}</Typography>
              <Typography><strong>Fecha:</strong> {eventoSeleccionado.fecha}</Typography>
              <Typography><strong>Hora:</strong> {eventoSeleccionado.hora}</Typography>
              {eventoSeleccionado.comentario && (
                <Typography><strong>Comentario:</strong> {eventoSeleccionado.comentario}</Typography>
              )}
              <Button
                color="secondary"
                onClick={handleDelete}
                style={{ marginTop: "20px" }}
              >
                Eliminar Cita
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
