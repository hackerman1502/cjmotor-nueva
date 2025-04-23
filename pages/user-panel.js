import { useState, useEffect } from "react";
import { Button, IconButton, Menu, MenuItem, Badge, Card, CardContent, Grid, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/router";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "130px",
    height: "auto",
  },
  title: {
    fontSize: "18px",
    fontWeight: "300",
    marginTop: "10px",
    letterSpacing: "1px",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "16px",
    fontWeight: "400",
    marginTop: "10px",
    color: "#ccc",
    textAlign: "center",
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
  notifications: {
    position: "absolute",
    top: "20px",
    right: "90px",
    color: "white",
  },
};

export default function UserPanel() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState(""); // Para almacenar el nombre del usuario
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        setUserId(user.id);

        // Obtener el nombre del usuario desde la tabla 'perfiles'
        const { data: perfilData, error: perfilError } = await supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", user.id)
          .single(); // Solo esperamos un perfil

        if (perfilData) {
          setUserName(perfilData.nombre); // Guardamos el nombre en el estado
        }

        // Obtener notificaciones
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) {
          setNotificaciones(data);
        }
      }
    };

    fetchUserAndNotifications();
  }, []);

  const handleOpenNotifications = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAsReadAndDelete = async (notificationId) => {
    // Marcar la notificación como leída
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    // Eliminar la notificación de la base de datos
    await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    // Actualizar el estado de las notificaciones localmente
    setNotificaciones((prevNotificaciones) =>
      prevNotificaciones.filter((n) => n.id !== notificationId)
    );
  };

  return (
    <div style={styles.container}>
      {/* Notificaciones */}
      <IconButton style={styles.notifications} onClick={handleOpenNotifications}>
        <Badge badgeContent={notificaciones.length} color="error">
          <NotificationsIcon style={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseNotifications}
        PaperProps={{ style: { backgroundColor: "#222", color: "white" } }}
      >
        {notificaciones.length === 0 ? (
          <MenuItem disabled>No hay notificaciones</MenuItem>
        ) : (
          notificaciones.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleMarkAsReadAndDelete(n.id)} // Cuando el usuario haga clic, se marca como leída y se elimina
            >
              {n.message}
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Log out */}
      <Button variant="contained" style={styles.logoutButton} onClick={handleLogout}>
        Log out
      </Button>

      {/* Cabecera */}
      <div style={styles.header}>
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJ MOTOR"
          width={130}
          height={130}
          style={styles.logo}
        />
        <p style={styles.title}>Bienvenido al panel de usuario</p>
        {userName ? (
          <p style={styles.welcomeText}>Hola, {userName}</p>
        ) : (
          <p style={styles.welcomeText}>Cargando...</p>
        )}
      </div>

      {/* Tarjeta con botones */}
      <Card
        sx={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(255,255,255,0.1)",
          padding: "20px",
          maxWidth: 600,
          width: "100%",
          margin: "0 auto",
          marginTop: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white", mb: 2, textAlign: "center" }}>
            Acciones rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => router.push("/historial-reparaciones")}
              >
                Historial
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" onClick={() => router.push("/perfil")}>
                Perfil
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" onClick={() => router.push("/")}>
                Solicitar cita
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button fullWidth variant="contained" onClick={() => router.push("/mis-citas")}>
                Mis citas
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}


