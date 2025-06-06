import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,  // Importamos TextField para el filtro de búsqueda
} from "@mui/material";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TrabajosCompletados() {
  const [trabajos, setTrabajos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");  // Para la búsqueda por nombre/telefono
  const router = useRouter();

  const fetchTrabajos = async () => {
    const { data, error } = await supabase
      .from("citas_completadas")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error al obtener trabajos:", error);
    } else {
      setTrabajos(data);
    }
  };

  const marcarComoPagado = async (id) => {
    const { error } = await supabase
      .from("citas_completadas")
      .update({ estado_pago: "Pagado" })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar estado de pago:", error);
      alert("Hubo un error al actualizar");
    } else {
      alert("Estado actualizado a 'Pagado'");
      fetchTrabajos();
    }
  };

  useEffect(() => {
    fetchTrabajos();
  }, []);

  // Filtrar por estado de pago
  const trabajosFiltradosPorEstado =
    filtro === "Todos"
      ? trabajos
      : trabajos.filter((t) => t.estado_pago === filtro);

  // Filtrar por nombre o teléfono
  const trabajosFiltrados =
    busqueda === ""
      ? trabajosFiltradosPorEstado
      : trabajosFiltradosPorEstado.filter(
          (trabajo) =>
            `${trabajo.nombre ?? ""} ${trabajo.telefono ?? ""}`
              .toLowerCase()
              .includes(busqueda.toLowerCase())
        );

  return (
    <div style={{ backgroundColor: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      {/* Header con botón atrás y logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/administrador")}
          style={{ backgroundColor: "white", color: "black" }}
        >
          Atrás
        </Button>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px", height: "auto" }} />
      </div>

      {/* Caja blanca con contenido */}
      <Card style={{ backgroundColor: "white", color: "black" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Trabajos Completados
          </Typography>

          {/* Filtro por estado de pago y búsqueda en una fila */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Typography variant="body1">Filtrar por estado de pago:</Typography>
              <Select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ width: "200px" }}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Pagado">Pagado</MenuItem>
              </Select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <TextField
                label="Buscar por nombre o teléfono"
                variant="outlined"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: "250px" }}
              />
            </div>
          </div>

          {/* Tabla de trabajos */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trabajosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No hay trabajos que coincidan con el filtro.
                    </TableCell>
                  </TableRow>
                ) : (
                  trabajosFiltrados.map((trabajo) => (
                    <TableRow key={trabajo.id}>
                      <TableCell>{trabajo.nombre}</TableCell>
                      <TableCell>{trabajo.telefono}</TableCell>
                      <TableCell>{trabajo.servicio}</TableCell>
                      <TableCell>{trabajo.fecha}</TableCell>
                      <TableCell>{trabajo.hora}</TableCell>
                      <TableCell>{trabajo.estado}</TableCell>
                      <TableCell style={{ color: trabajo.estado_pago === "Pagado" ? "green" : "red" }}>
                        {trabajo.estado_pago}
                      </TableCell>
                      <TableCell>
                        {trabajo.estado_pago === "Pendiente" && (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "green", color: "white" }}
                            onClick={() => marcarComoPagado(trabajo.id)}
                          >
                            Marcar como pagado
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}

