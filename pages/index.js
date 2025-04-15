import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Card,
  CardContent,
} from "@mui/material";

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
        .insert([
          {
            nombre: form.nombre,
            telefono: form.telefono,
            fecha: form.fecha,
            hora: form.hora,
            servicio: form.servicio,
            comentario: form.comentario
          }
        ]);

      if (error) {
        alert("Error al guardar la cita");
        console.error("Error de Supabase:", error);
      } else {
        alert("Cita guardada correctamente");
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

  const exportarCSV = () => {
    const contraseña = prompt("Introduce la contraseña de administrador:");

    if (contraseña !== "admin123") {
      alert("Contraseña incorrecta");
      return;
    }

    if (!citas.length) {
      alert("No hay citas para exportar.");
      return;
    }

    const encabezado = ["Nombre", "Teléfono", "Fecha", "Hora", "Servicio", "Comentario"];
    const filas = citas.map((cita) => [
      cita.nombre,
      cita.telefono,
      cita.fecha,
      cita.hora,
      cita.servicio,
      cita.comentario?.replace(/\n/g, " ") || "",
    ]);

    const csvContent =
      [encabezado, ...filas]
        .map((fila) => fila.map((campo) => `"${campo}"`).join(","))
        .join("\n");

    const fechaActual = new Date().toISOString().split("T")[0];
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `citas-${fechaActual}.csv`);
    link.click();
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "black", color: "white", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <img src="/lambo.png" alt="Lambo" style={{ width: "60px", height: "auto" }} />
        <div>
          <img src="/logo-cjmotor.png" alt="Logo CJ MOTOR" style={{ width: "130px", height: "auto" }} />
          <p
            style={{
              fontSize: "18px",
              fontWeight: "300",
              fontFamily: "'Roboto', sans-serif",
              marginTop: "10px",
              letterSpacing: "1px",
            }}
          >
            Gestor de Citas
          </p>
        </div>
        <img src="/neumaticos.png" alt="Neumáticos" style={{ width: "60px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black", marginBottom: "20px" }}>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <InputLabel>Nombre</InputLabel>
              <Input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} fullWidth />
            </div>
            <div>
              <InputLabel>Teléfono</InputLabel>
              <Input
                value={form.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                fullWidth
                type="text" // Usamos type="text" para filtrar el input manualmente
                onInput={(e) => {
                  // Solo permite números, eliminando todo lo que no sea un dígito
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
            </div>
            <div>
              <InputLabel>Día</InputLabel>
              <Input type="date" value={form.fecha} onChange={handleSelectDia} fullWidth />
            </div>
            <div>
              <InputLabel>Hora</InputLabel>
              <Select
                value={form.hora}
                onChange={(e) => handleChange("hora", e.target.value)}
                fullWidth
                disabled={horasDisponibles.length === 0 || !fechaDisponible}
              >
                {horasDisponibles.map((hora, index) => (
                  <MenuItem key={index} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
              {form.fecha && horasDisponibles.length === 0 && (
                <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                  No hay horas disponibles para este día.
                </p>
              )}
            </div>
            <div>
              <FormControl fullWidth>
                <InputLabel>Servicio</InputLabel>
                <Select value={form.servicio} onChange={(e) => handleChange("servicio", e.target.value)} fullWidth>
                  <MenuItem value="Cambio de aceite">Cambio de aceite</MenuItem>
                  <MenuItem value="Revisión general">Revisión general</MenuItem>
                  <MenuItem value="Cambio neumáticos">Cambio neumáticos</MenuItem>
                  <MenuItem value="Diagnóstico">Diagnóstico</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <InputLabel>Comentarios</InputLabel>
              <TextareaAutosize
                value={form.comentario}
                onChange={(e) => handleChange("comentario", e.target.value)}
                minRows={3}
                style={{ width: "100%", minHeight: "80px", padding: "8px" }}
              />
            </div>
            <Button type="submit" variant="contained" disabled={!isFormValid()}>
              Reservar cita
            </Button>
            <Button
              variant="contained"
              style={{
                marginTop: "10px",
                backgroundColor: "#333", // gris oscuro para destacar sobre fondo blanco o negro
                color: "#fff",
              }}
              onClick={() => {
                const pass = prompt("Introduce la contraseña de administrador:");
                if (pass === "admin123") {
                  window.location.href = "/admin-panel";
                } else {
                  alert("Contraseña incorrecta");
                }
              }}
            >
              Ver panel de citas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
