import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button, Input, FormControl, InputLabel, Select, MenuItem, TextareaAutosize, Card, CardContent } from "@mui/material";

const HORARIOS_DISPONIBLES = {
  lunes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  martes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  miércoles: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  jueves: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  viernes: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  sábado: ["09:00", "10:00", "11:00", "12:00", "13:00"],
};

export default function Home() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    servicio: "",
    comentario: "",
  });

  const [citas, setCitas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [fechaDisponible, setFechaDisponible] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(""); // Estado para el mensaje de éxito

  // Recuperar citas de Supabase
  const fetchCitas = async () => {
    const { data, error } = await supabase.from("citas").select("*");
    if (error) {
      console.error("Error al obtener citas:", error);
    } else {
      setCitas(data); // Guardamos las citas ocupadas
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const checkFechaDisponible = (fecha, hora) => {
    const citaExistente = citas.find(
      (item) => item.fecha === fecha && item.hora === hora
    );
    setFechaDisponible(!citaExistente);
  };

  const handleChange = (field, value) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);

    if ((field === "fecha" || field === "hora") && updatedForm.fecha && updatedForm.hora) {
      checkFechaDisponible(updatedForm.fecha, updatedForm.hora); // Verificamos si la fecha y la hora están ocupadas
    }
  };

  const handleSelectDia = (e) => {
    const fechaSeleccionada = new Date(e.target.value);
    const diaSemana = fechaSeleccionada.getDay();

    let horasDisponiblesDelDia = [];
    if (diaSemana !== 0) {
      const diaNombre = Object.keys(HORARIOS_DISPONIBLES)[diaSemana - 1];
      horasDisponiblesDelDia = HORARIOS_DISPONIBLES[diaNombre];
    }

    // Filtrar horas ocupadas
    const horasDisponiblesFiltradas = horasDisponiblesDelDia.filter((hora) => {
      return !citas.some((cita) => cita.fecha === e.target.value && cita.hora === hora);
    });

    setHorasDisponibles(horasDisponiblesFiltradas);
    setForm({ ...form, fecha: e.target.value, hora: "" }); // Limpiar la hora al cambiar la fecha
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.telefono || !form.fecha || !form.servicio || !form.hora) return;

    try {
      // Guardar cita en Supabase
      const { data, error } = await supabase
        .from('citas')
        .insert([{
          nombre: form.nombre,
          telefono: form.telefono,
          fecha: form.fecha,
          hora: form.hora,
          servicio: form.servicio,
          comentario: form.comentario,
        }]);

      if (error) {
        alert("Error al guardar la cita");
        console.error("Error de Supabase:", error);
      } else {
        // Aquí es donde manejamos el mensaje de éxito
        setMensajeExito("Cita guardada correctamente"); 
        setForm({
          nombre: "",
          telefono: "",
          fecha: "",
          servicio: "",
          comentario: "",
          hora: "",
        });
        fetchCitas(); // Volver a obtener las citas actualizadas
      }
    } catch (error) {
      alert("Hubo un error al enviar la cita");
      console.error(error);
    }
  };

  const isFormValid = () => {
    return form.nombre && form.telefono && form.fecha && form.hora && form.servicio;
  };

  // Resetea el mensaje de éxito cuando la página se vuelve a cargar o navegas
  useEffect(() => {
    setMensajeExito(""); // Reseteamos el mensaje al navegar o recargar la página
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "black", color: "white", minHeight: "100vh" }}>
      {/* Aquí se muestra el mensaje de éxito */}
      {mensajeExito && (
        <div style={{ color: "green", fontSize: "18px", marginBottom: "20px" }}>
          {mensajeExito}
        </div>
      )}

      {/* Formulario y otros componentes */}
      <Card style={{ backgroundColor: "white", color: "black", marginBottom: "20px" }}>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {/* Aquí van los inputs del formulario */}
            <Button type="submit" variant="contained" disabled={!isFormValid()}>
              Reservar cita
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

