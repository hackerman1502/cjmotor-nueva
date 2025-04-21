import { useState, useEffect } from "react";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Image from "next/image";

const styles = {
  container: {
    backgroundColor: "black",
    color: "white",
    padding: "20px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "130px",
    height: "auto",
  },
  card: {
    backgroundColor: "white",
    color: "black",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "300",
  },
  tableContainer: {
    maxWidth: "100%",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "white",
    color: "black",
    margin: "10px auto",
    width: "200px",
    borderRadius: "8px",
    fontWeight: "500",
  },
  filterButton: {
    backgroundColor: "#ff9900",
    color: "black",
    margin: "10px auto",
    width: "200px",
    borderRadius: "8px",
    fontWeight: "500",
  },
  logoutButton: {
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
  },
};

export default function TrabajosCompletados() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  // Función para obtener los trabajos completados desde Supabase
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

    if (error) {
      alert("Error al actualizar el estado del pago.");
      console.error(error);
    } else {
      alert(`La cita ha sido marcada como ${isPaid ? "pagada" : "pendiente de pago"}.`);
      // Refrescar los datos
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, estado_pago: isPaid ? "pagado" : "pendiente" } : job)));
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
    <div style={styles.container}>
      {/* Botón Log out en la esquina superior derecha */}
      <Button variant="contained" style={styles.logoutButton} onClick={handleLogout}>
        Log out
      </Button>

      <div style={styles.header}>
        <img src="/logo-cjmotor.png" alt="Logo CJ MOTOR" style={styles.logo} />
      </div>

      <Card style={styles.card}>
        <CardContent>
          <h1 style={styles.title}>Trabajos Completados</h1>

          <div>
            <Button
              variant="contained"
              style={styles.filterButton}
              onClick={() => setFilter("all")}
            >
              Ver Todos
            </Button>
            <Button
              variant="contained"
              style={styles.filterButton}
              onClick={() => setFilter("pagado")}
            >
              Ver Pagados
            </Button>
            <Button
              variant="contained"
              style={styles.filterButton}
              onClick={() => setFilter("pendiente")}
            >
              Ver Pendientes de Pago
            </Button>
          </div>

          <TableContainer style={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Estado de Pago</TableCell>
                  <TableCell>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} onClick={() => handleJobClick(job)}>
                    <TableCell>{job.nombre}</TableCell>
                    <TableCell>{job.servicio}</TableCell>
                    <TableCell>{job.fecha}</TableCell>
                    <TableCell>{job.hora}</TableCell>
                    <TableCell>{job.estado_pago === "pagado" ? "Pagado" : "Pendiente"}</TableCell>
                    <TableCell>
                      {job.estado_pago === "pendiente" && (
                        <Button
                          variant="contained"
                          style={styles.button}
                          onClick={() => handlePaymentStatusChange(job.id, true)}
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

      {/* Dialogo con detalles del trabajo completado */}
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
              <Typography><strong>Estado de Pago:</strong> {selectedJob.estado_pago === "pagado" ? "Pagado" : "Pendiente"}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
