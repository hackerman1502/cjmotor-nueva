import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
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
  Button,
} from "@mui/material";
import { useRouter } from "next/router";

// Supabase config
const supabase = createClient(
  "https://lslvykkxyqtkcyrxxzey.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHZ5a2t4eXF0a2N5cnh4emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTAwODQsImV4cCI6MjA2MDIyNjA4NH0.JnVxWZWB4Lbod01G23PSNzq6bd6N-DCXXxZeLci8Oc8"
);

export default function HistorialReparaciones() {
  const [reparaciones, setReparaciones] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReparaciones = async () => {
      // Obtener el usuario logueado
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("No se pudo obtener el usuario logueado:", userError);
        alert("No estás logueado.");
        router.push("/login");
        return;
      }

      // Obtener las reparaciones (citas completadas) para el usuario logueado
      const { data, error } = await supabase
        .from("citas_completadas")
        .select("*")
        .eq("usuario_id", userData.user.id); // Filtrar por el usuario logueado

      if (error) {
        console.error("Error al obtener reparaciones:", error);
      } else {
        setReparaciones(data); // Establecer las reparaciones recuperadas en el estado
      }
    };

    fetchReparaciones();
  }, []);

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

      {/* Caja blanca con historial de reparaciones */}
      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Historial de Reparaciones
          </Typography>

          {reparaciones.length === 0 ? (
            <Typography variant="body1" style={{ textAlign: "center" }}>
              No tienes reparaciones completadas.
            </Typography>
          ) : (
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reparaciones.map((reparacion) => (
                    <TableRow key={reparacion.id}>
                      <TableCell>{reparacion.nombre}</TableCell>
                      <TableCell>{reparacion.telefono}</TableCell>
                      <TableCell>{reparacion.servicio}</TableCell>
                      <TableCell>{reparacion.fecha}</TableCell>
                      <TableCell>{reparacion.hora}</TableCell>
                      <TableCell>{reparacion.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

