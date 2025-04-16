import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";

// Configuración de Supabase (esto se declara solo una vez en el archivo)
const supabaseUrl = "https://lslvykkxyqtkcyrxxzey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHZ5a2t4eXF0a2N5cnh4emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTAwODQsImV4cCI6MjA2MDIyNjA4NH0.JnVxWZWB4Lbod01G23PSNzq6bd6N-DCXXxZeLci8Oc8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CitasPanel() {
  const [citas, setCitas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCitas = async () => {
      // Obtener el usuario logueado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error al obtener el usuario logueado:", userError);
        alert("No se pudo obtener el usuario logueado.");
        return;
      }

      const userId = userData.user.id;

      // Obtener las citas del usuario
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("usuario_id", userId); // Filtra las citas por el ID del usuario

      if (error) {
        console.error("Error al obtener las citas:", error);
      } else {
        setCitas(data); // Establecer las citas en el estado
      }
    };

    fetchCitas();
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
                    <TableCell><strong>Acciones</strong></TableCell> {/* Nueva columna para botones */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {citas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{cita.fecha}</TableCell>
                      <TableCell>{cita.hora}</TableCell>
                      <TableCell>{cita.servicio}</TableCell>
                      <TableCell>{cita.estado}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteCita(cita.id)} // Llamar a la función con el id correspondiente
                        >
                          Eliminar
                        </Button>
                      </TableCell>
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

