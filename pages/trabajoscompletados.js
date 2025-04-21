import { useState, useEffect } from "react";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function TrabajosCompletados() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("citas_completadas")
        .select("*");

      if (!error) {
        setJobs(data);
      } else {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  const handlePaymentStatusChange = async (jobId, isPaid) => {
    const { error } = await supabase
      .from("citas_completadas")
      .update({ estado_pago: isPaid ? "pagado" : "pendiente" })
      .eq("id", jobId);

    if (!error) {
      setJobs(jobs.map((job) =>
        job.id === jobId ? { ...job, estado_pago: isPaid ? "pagado" : "pendiente" } : job
      ));
    } else {
      alert("Error al actualizar el estado.");
    }
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter((job) => job.estado_pago === filter);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseDialog = () => {
    setSelectedJob(null);
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      <Button
        variant="contained"
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "white",
          color: "black",
          fontSize: "0.75rem",
          padding: "6px 12px",
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: "500",
        }}
      >
        Log out
      </Button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <img src="/logo-cjmotor.png" alt="Logo CJ MOTOR" style={{ width: "130px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black", padding: "20px", borderRadius: "8px" }}>
        <CardContent>
          <h1 style={{ fontSize: "24px", textAlign: "center", marginBottom: "20px" }}>Trabajos Completados</h1>

          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="filtro-label">Filtrar por estado de pago</InputLabel>
            <Select
              labelId="filtro-label"
              value={filter}
              label="Filtrar por estado de pago"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pagado">Pagados</MenuItem>
              <MenuItem value="pendiente">Pendientes</MenuItem>
            </Select>
          </FormControl>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Cliente</strong></TableCell>
                  <TableCell><strong>Servicio</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Hora</strong></TableCell>
                  <TableCell><strong>Estado de Pago</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} onClick={() => handleJobClick(job)}>
                    <TableCell>{job.nombre}</TableCell>
                    <TableCell>{job.servicio}</TableCell>
                    <TableCell>{job.fecha}</TableCell>
                    <TableCell>{job.hora}</TableCell>
                    <TableCell>
                      {job.estado_pago === "pagado" ? "Pagado" : "Pendiente"}
                    </TableCell>
                    <TableCell>
                      {job.estado_pago === "pendiente" && (
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que se abra el dialog al hacer clic
                            handlePaymentStatusChange(job.id, true);
                          }}
                          style={{ backgroundColor: "#4caf50", color: "white" }}
                        >
                          Marcar como Pagado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedJob)} onClose={handleCloseDialog}>
        <DialogTitle>Detalles del Trabajo</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
              <Typography><strong>Nombre:</strong> {selectedJob.nombre}</Typography>
              <Typography><strong>Teléfono:</strong> {selectedJob.telefono}</Typography>
              <Typography><strong>Servicio:</strong> {selectedJob.servicio}</Typography>
              <Typography><strong>Fecha:</strong> {selectedJob.fecha}</Typography>
              <Typography><strong>Hora:</strong> {selectedJob.hora}</Typography>
              <Typography><strong>Estado de Pago:</strong> {selectedJob.estado_pago}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

