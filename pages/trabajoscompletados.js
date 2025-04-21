import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import Image from "next/image";

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end", // Para alinear el logo a la derecha
    alignItems: "center",
    marginBottom: "30px",
    position: "relative",
  },
  logo: {
    width: "130px",
    height: "auto",
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
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("citas_completadas")
        .select("*")
        .eq("estado", "completada");

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

  return (
    <div style={styles.container}>
      {/* Botón Log out en la esquina superior derecha */}
      <Button variant="contained" style={styles.logoutButton} onClick={handleLogout}>
        Log out
      </Button>

      <div style={styles.header}>
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJ MOTOR"
          width={130}
          height={130}
          style={styles.logo}
        />
      </div>

      <h1 style={styles.title}>Gestión de Trabajos Completados</h1>

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
              <TableRow key={job.id}>
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
    </div>
  );
}
