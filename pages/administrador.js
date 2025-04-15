import { useState, useEffect } from "react";
import { Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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

  const handleEventoClick = (info) =>
