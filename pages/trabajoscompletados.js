import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Config Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function TrabajosCompletados() {
  const [trabajos, setTrabajos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
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

  const trabajosFiltrados =
    filtro === "Todos"
      ? trabajos
      : trabajos.filter((t) => t.estado_pago === filtro);

  return (
    <div style={{ backgroundColor: "black", color: "white", minHeight: "100vh", padding: "20px" }}>
      {/* Header con botón atrás y logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/administrador")}
          style={{
            backgroundColor: "white",
            color: "black",
          }}
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

          {/* Filtro */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <Typography variant="body1" style={{ marginBottom: "8px" }}>Filtrar por estado de pago:</Typography>
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

          {/* Lista de trabajos */}
          {trabajosFiltrados.length === 0 ? (
            <Typography style={{ textAlign: "center" }}>No hay trabajos que coincidan con el filtro.</Typography>
          ) : (
            trabajosFiltrados.map((job) => (
              <Card key={job.id} style={{ marginBottom: "20px", backgroundColor: "white", color: "black" }}>
                <CardContent>
                  <Typography variant="h6">{job.nombre}</Typography>
                  <Typography>Teléfono: {job.telefono}</Typography>
                  <Typography>Servicio: {job.servicio}</Typography>
                  <Typography>Fecha: {job.fecha}</Typography>
                  <Typography>Hora: {job.hora}</Typography>
                  <Typography>Estado: {job.estado}</Typography>
                  <Typography>
                    <strong>Estado de pago:</strong>{" "}
                    <span style={{ color: job.estado_pago === "Pagado" ? "green" : "red" }}>
                      {job.estado_pago}
                    </span>
                  </Typography>

                  {job.estado_pago === "Pendiente" && (
                    <Button
                      variant="contained"
                      style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
                      onClick={() => marcarComoPagado(job.id)}
                    >
                      Marcar como pagado
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

