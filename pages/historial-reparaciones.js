import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useUser } from "../context/UserContext"; // Asegúrate de que esta ruta es correcta
import { supabase } from "../lib/supabaseClient";

export default function HistorialReparaciones() {
  const [reparaciones, setReparaciones] = useState([]);
  const { user } = useUser(); // Obtiene el usuario desde el contexto
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Si el usuario no está logueado, redirige al login
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchCitasCompletadas = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("citas_completadas")
        .select("*")
        .eq("usuario_id", user.id);

      if (error) {
        console.error("Error al obtener las citas completadas:", error);
      } else {
        setReparaciones(data);
      }
    };

    if (user) {
      fetchCitasCompletadas();
    }
  }, [user]);

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
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

      {user && (
        <Typography variant="h6" style={{ textAlign: "center", marginBottom: "20px" }}>
          Bienvenido, {user.email}
        </Typography>
      )}

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
