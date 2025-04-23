import { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Button,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem,
  InputLabel, FormControl, TextField
} from "@mui/material";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CitasPanel() {
  const [citas, setCitas] = useState([]);
  const [filter, setFilter] = useState("fecha");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [editCita, setEditCita] = useState(null);
  const router = useRouter();

  const fetchCitas = async () => {
    let query = supabase.from("citas").select("*");

    if (estadoFilter) query = query.eq("estado", estadoFilter);
    if (filter === "fecha") query = query.order("fecha", { ascending: true });
    else if (filter === "estado") query = query.order("estado", { ascending: true });

    const { data, error } = await query;
    if (error) console.error("Error al obtener citas:", error);
    else setCitas(data);
  };

  useEffect(() => {
    fetchCitas();
  }, [filter, estadoFilter]);

  // 🛎️ Función para crear notificaciones
     const crearNotificacion = async (user_id, message) => {
      const { error } = await supabase
        .from("notifications")
        .insert([{ user_id, message, read: false }]);
      if (error) {
        console.error("Error al crear la notificación:", error);
      } else {
        console.log("Notificación insertada correctamente:", { user_id, message });
      }
    };


  const handleUpdateCita = async (id, fecha, hora) => {
  const { error } = await supabase
    .from("citas")
    .update({ fecha, hora })
    .eq("id", id);

  if (error) {
    console.error("Error al actualizar la cita:", error);
    alert("Hubo un problema al actualizar la cita.");
  } else {
    const { data: citaActualizada } = await supabase
      .from("citas")
      .select("usuario_id, nombre")
      .eq("id", id)
      .single();

    if (citaActualizada?.usuario_id) {
      await crearNotificacion(
        citaActualizada.usuario_id,
        `Tu cita ha sido reprogramada para el ${fecha} a las ${hora}.`
      );
    }

    fetchCitas();
    setEditCita(null);
    alert("Cita actualizada correctamente.");
  }
};


  const handleDeleteCita = async (id) => {
  const { data: citaEliminada } = await supabase
    .from("citas")
    .select("usuario_id, fecha, hora")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("citas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar la cita:", error);
    alert("Hubo un problema al eliminar la cita.");
  } else {
    if (citaEliminada?.usuario_id) {
      await crearNotificacion(
        citaEliminada.usuario_id,
        `Tu cita del ${citaEliminada.fecha} a las ${citaEliminada.hora} ha sido cancelada.`
      );
    }

    fetchCitas();
    alert("Cita eliminada correctamente.");
  }
};


  const handleMarkCompleted = async (id) => {
    try {
      const { data: cita, error: fetchError } = await supabase
        .from("citas")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error al obtener la cita:", fetchError);
        alert("Hubo un problema al obtener la cita.");
        return;
      }

      const { error: insertError } = await supabase
        .from("citas_completadas")
        .insert([{
          nombre: cita.nombre,
          telefono: cita.telefono,
          servicio: cita.servicio,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: "Completada"
        }]);

      if (insertError) {
        console.error("Error al insertar:", insertError);
        alert("Hubo un problema al mover la cita.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("citas")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error al eliminar la cita:", deleteError);
        alert("Hubo un problema al eliminar la cita.");
        return;
      }

      fetchCitas();
      alert("Cita marcada como completada y movida correctamente.");
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Hubo un problema al procesar la cita.");
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/administrador")}
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        >
          Atrás
        </Button>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Lista de Citas
          </Typography>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "white" }}>
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                label="Filtrar por Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Completada">Completada</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "white" }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Ordenar por"
              >
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="estado">Estado</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Teléfono</strong></TableCell>
                  <TableCell><strong>Matrícula</strong></TableCell>
                  <TableCell><strong>Servicio</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Hora</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>{cita.nombre}</TableCell>
                    <TableCell>{cita.telefono}</TableCell>
                    <TableCell>{cita.matricula}</TableCell>
                    <TableCell>{cita.servicio}</TableCell>
                    <TableCell>
                      {editCita?.id === cita.id ? (
                        <TextField
                          type="date"
                          value={editCita.fecha}
                          onChange={(e) => setEditCita({ ...editCita, fecha: e.target.value })}
                        />
                      ) : cita.fecha}
                    </TableCell>
                    <TableCell>
                      {editCita?.id === cita.id ? (
                        <TextField
                          type="time"
                          value={editCita.hora}
                          onChange={(e) => setEditCita({ ...editCita, hora: e.target.value })}
                        />
                      ) : cita.hora}
                    </TableCell>
                    <TableCell>{cita.estado}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {cita.estado === "Pendiente" && !editCita && (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "black", color: "white" }}
                            onClick={() => handleMarkCompleted(cita.id)}
                          >
                            Marcar como Completada
                          </Button>
                        )}
                        {editCita?.id === cita.id ? (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "black", color: "white" }}
                            onClick={() => handleUpdateCita(cita.id, editCita.fecha, editCita.hora)}
                          >
                            Guardar
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "black", color: "white" }}
                            onClick={() => setEditCita(cita)}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "red", color: "white" }}
                          onClick={() => handleDeleteCita(cita.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}


