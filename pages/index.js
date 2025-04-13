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
  const [adminPass, setAdminPass] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchHorarios = async () => {
      const response = await fetch("/horarios.json");
      const data = await response.json();
      setCitas(data.citas);
    };
    fetchHorarios();
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
      checkFechaDisponible(updatedForm.fecha, updatedForm.hora);
    }
  };

  const handleSelectDia = (e) => {
    const fechaSeleccionada = new Date(e.target.value);
    const diaSemana = fechaSeleccionada.getDay();

    if (diaSemana === 0) {
      alert("No se puede seleccionar domingos");
      setForm({ ...form, fecha: "" });
      setHorasDisponibles([]);
      return;
    }

    const diaNombre = Object.keys(HORARIOS_DISPONIBLES)[diaSemana - 1];
    const horasDisponiblesDelDia = HORARIOS_DISPONIBLES[diaNombre];

    setHorasDisponibles(horasDisponiblesDelDia);
    setForm({ ...form, fecha: e.target.value, hora: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.fecha || !form.servicio || !form.hora) return;

    try {
      const response = await fetch("/api/guardarCitas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cita: form }),
      });

      if (response.ok) {
        alert("Cita guardada correctamente");
        setForm({
          nombre: "",
          telefono: "",
          fecha: "",
          servicio: "",
          comentario: "",
          hora: "",
        });
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert("Hubo un error al enviar la cita");
      console.error(error);
    }
  };

  const isFormValid = () => {
    return form.nombre && form.telefono && form.fecha && form.hora && form.servicio;
  };

  const handleAdminLogin = () => {
    if (adminPass === "admin123") {
      setIsAdmin(true);
      setAdminPass("");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleExportarCSV = () => {
    window.open("/api/exportarCitas", "_blank");
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
          <p style={{
            fontSize: "18px",
            fontWeight: "300",
            fontFamily: "'Roboto', sans-serif",
            marginTop: "10px",
            letterSpacing: "1px",
          }}>
            Gestor de Citas
          </p>
        </div>
        <img src="/neumaticos.png" alt="Neumáticos" style={{ width: "60px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black" }}>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <InputLabel>Nombre</InputLabel>
              <Input value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} fullWidth />
            </div>
            <div>
              <InputLabel>Teléfono</InputLabel>
              <Input value={form.telefono} onChange={(e) => handleChange("telefono", e.target.value)} fullWidth />
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
                disabled={horasDisponibles.length === 0}
              >
                {horasDisponibles.map((hora, index) => (
                  <MenuItem key={index} value={hora}>
                    {hora}
                  </MenuItem>
                ))}
              </Select>
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
          </form>

          <div style={{ marginTop: "30px" }}>
            {!isAdmin ? (
              <>
                <Input
                  type="password"
                  placeholder="Contraseña admin"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                />
                <Button onClick={handleAdminLogin} style={{ marginLeft: "10px" }} variant="outlined">
                  Acceder como admin
                </Button>
              </>
            ) : (
              <Button onClick={handleExportarCSV} variant="contained" color="secondary">
                Exportar citas CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}