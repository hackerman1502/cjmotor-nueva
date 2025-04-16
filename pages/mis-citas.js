import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Supabase config
const supabase = createClient(
  "https://lslvykkxyqtkcyrxxzey.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHZ5a2t4eXF0a2N5cnh4emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTAwODQsImV4cCI6MjA2MDIyNjA4NH0.JnVxWZWB4Lbod01G23PSNzq6bd6N-DCXXxZeLci8Oc8"
);

export default function MisCitas() {
  const [citas, setCitas] = useState([]);
  const router = useRouter();

useEffect(() => {
  const fetchCitas = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      alert("Tienes que estar logueado para ver tus citas.");
      router.push("/login");
      return;
    }

    const userId = userData.user.id;
    console.log("ID del usuario logueado:", userId); // DEBUG

    const { data, error } = await supabase
      .from("citas")
      .select("*")
      .eq("usuario_id", userId);

    if (error) {
      console.error("Error al obtener citas:", error);
    } else {
      console.log("Citas recuperadas:", data); // DEBUG
      setCitas(data);
    }
  };

  fetchCitas();
}, []);

 const handleDeleteCita = async (id) => {
  // Confirmación antes de eliminar
  const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar esta cita?");
  if (!confirmDelete) return;

  try {
    // Intento de eliminación de la cita en la base de datos
    const { data, error } = await supabase
      .from('citas')
      .delete()
      .eq('id', id); // Se asegura de que la cita con el id especificado se elimine

    // Si hay un error en la eliminación, lo mostramos
    if (error) {
      console.error("Error al eliminar la cita:", error);
      alert("Hubo un error al eliminar la cita.");
    } else {
      // Si la cita fue eliminada correctamente, actualizamos el estado local
      console.log("Cita eliminada correctamente", data);
      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      alert("Cita eliminada correctamente.");
    }
  } catch (error) {
    console.error("Hubo un error al eliminar la cita:", error);
    alert("Hubo un error al eliminar la cita.");
  }
};


  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      {/* Header con botón atrás y logo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/user-panel")}
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc" }}
        >
          Atrás
        </Button>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px", height: "auto" }} />
      </div>

      {/* Caja blanca con citas */}
      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Mis Citas
          </Typography>

          {citas.length === 0 ? (
            <Typography variant="body1" style={{ textAlign: "center" }}>
              No tienes citas registradas.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Hora</strong></TableCell>
                    <TableCell><strong>Servicio</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{cita.fecha}</TableCell>
                      <TableCell>{cita.hora}</TableCell>
                      <TableCell>{cita.servicio}</TableCell>
                      <TableCell>{cita.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
            <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteCita(cita.id)}
                >
                  Eliminar
                </Button>
              </div>
        </CardContent>
      </Card>
    </div>
  );
}
