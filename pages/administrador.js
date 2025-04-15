import { useState, useEffect } from "react";
import { Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // para poder hacer clic
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [citas, setCitas] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const router = useRouter();

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

  const eventos = citas.map((cita) => ({
    title: `${cita.nombre} - ${cita.servicio}`,
    start: `${cita.fecha}T${cita.hora}:00`,
    extendedProps: {
      nombre: cita.nombre,
      telefono: cita.telefono,
      fecha: cita.fecha,
      hora: cita.hora,
      servicio: cita.servicio,
      comentario: cita.comentario,
    },
  }));

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
    <div style={styles.container}>
      <div style={styles.header}>
        <IconButton onClick={() => router.push("/")} style={styles.iconButton}>
          <HomeIcon />
        </IconButton>
        <img src="/logo-cjmotor.png" alt="Logo" style={styles.logo} />
      </div>

      <Card style={styles.card}>
        <CardContent>
          <h2 style={styles.title}>Calendario de Citas</h2>
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

      <div style={styles.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/citas-panel")}
        >
          Listado de citas
        </Button>
      </div>

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
                onClick={() => handleDelete(eventoSeleccionado)}
                style={styles.deleteButton}
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

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  iconButton: {
    color: '#fff',
    marginRight: '20px',
  },
  logo: {
    width: '130px',
    height: 'auto',
  },
  card: {
    backgroundColor: '#fff',
    color: '#000',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  buttonWrapper: {
    marginTop: '20px',
    textAlign: 'right',
  },
  deleteButton: {
    marginTop: '20px',
  },
};

