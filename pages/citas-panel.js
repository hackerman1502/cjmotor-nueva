import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Supabase config
const supabaseUrl = "https://lslvykkxyqtkcyrxxzey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHZ5a2t4eXF0a2N5cnh4emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTAwODQsImV4cCI6MjA2MDIyNjA4NH0.JnVxWZWB4Lbod01G23PSNzq6bd6N-DCXXxZeLci8Oc8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CitasPanel() {
  const [citas, setCitas] = useState([]);
  const [filter, setFilter] = useState("fecha");
  const [estadoFilter, setEstadoFilter] = useState("");
  const router = useRouter();

  const fetchCitas = async () => {
    let query = supabase.from("citas").select("*");

    if (estadoFilter) {
      query = query.eq("estado", estadoFilter);
    }

    if (filter === "fecha") {
      query = query.order("fecha", { ascending: true });
    } else if (filter === "estado") {
      query = query.order("estado", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener citas:", error);
    } else {
      setCitas(data);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, [filter, estadoFilter]);

  const handleUpdate = async (id, nuevaFecha, nuevaHora) => {
    try {
      const { error } = await supabase
        .from("citas")
        .update({ fecha: nuevaFecha, hora: nuevaHora })
        .eq("id", id);

      if (error) {
        console.error("Error al actualizar cita:", error);
        alert("Hubo un error al guardar los cambios.");
      } else {
        alert("Cita actualizada correctamente.");
        fetchCitas();
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Algo fue mal al actualizar la cita.");
    }
  };

const handleMarkCompleted = async (id) => {
  try {
    // Obtener el usuario logueado
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("No se pudo obtener el usuario logueado:", userError);
      alert("No estás logueado.");
      return;
    }

    console.log("Usuario logueado:", userData.user);  // Verificar que estamos obteniendo el usuario correctamente

    // Obtener la cita para procesarla
    const { data: cita, error: fetchError } = await supabase
      .from("citas")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error al obtener la cita:", fetchError);
      return;
    }

    console.log("Cita encontrada:", cita);  // Verificar que la cita se obtiene correctamente

    // Insertar la cita en la tabla citas_completadas con el usuario_id
    const { error: insertError } = await supabase
      .from("citas_completadas")
      .insert([
        {
          nombre: cita.nombre,
          telefono: cita.telefono,
          servicio: cita.servicio,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: "Completada",
          usuario_id: userData.user.id,  // Asegurándonos de que el usuario_id se inserte
        },
      ]);

    if (insertError) {
      console.error("Error al insertar en citas_completadas:", insertError);
      alert("Hubo un error al insertar la cita completada.");
      return;
    }

    console.log("Cita completada insertada correctamente");  // Verificar que la cita fue insertada

    // Eliminar la cita de la tabla citas
    const { error: deleteError } = await supabase
      .from("citas")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar la cita:", deleteError);
      return;
    }

    console.log("Cita eliminada correctamente");  // Verificar que la cita fue eliminada

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
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", marginRight: "10px" }}
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
                  <TableCell><strong>Servicio</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Hora</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>{cita.nombre}</TableCell>
                    <TableCell>{cita.telefono}</TableCell>
                    <TableCell>{cita.servicio}</TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={cita.fecha}
                        onChange={(e) => {
                          const nuevasCitas = citas.map((c) =>
                            c.id === cita.id ? { ...c, fecha: e.target.value } : c
                          );
                          setCitas(nuevasCitas);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="time"
                        value={cita.hora}
                        onChange={(e) => {
                          const nuevasCitas = citas.map((c) =>
                            c.id === cita.id ? { ...c, hora: e.target.value } : c
                          );
                          setCitas(nuevasCitas);
                        }}
                      />
                    </TableCell>
                    <TableCell>{cita.estado}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "black", color: "white" }}
                          onClick={() => handleUpdate(cita.id, cita.fecha, cita.hora)}
                        >
                          Guardar
                        </Button>
                        {cita.estado === "Pendiente" && (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "black", color: "white" }}
                            onClick={() => handleMarkCompleted(cita.id)}
                          >
                            Completada
                          </Button>
                        )}
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
