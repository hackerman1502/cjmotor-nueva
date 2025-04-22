import { useState, useEffect } from "react";
import { Button, IconButton, Menu, MenuItem, Badge } from "@mui/material";
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
  button: {
    backgroundColor: "white",
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

    // Marcar las notificaciones como leídas cuando el usuario las vea
    if (userId && notificaciones.length > 0) {
      const unreadNotifications = notificaciones.filter((n) => !n.read);
      if (unreadNotifications.length > 0) {
        const unreadIds = unreadNotifications.map((n) => n.id);

        // Marcar las notificaciones como leídas
        await supabase
          .from("notifications")
          .update({ read: true })
          .in("id", unreadIds);

        // Actualizar las notificaciones locales
        setNotificaciones((prevNotificaciones) =>
          prevNotificaciones.map((n) =>
            unreadIds.includes(n.id) ? { ...n, read: true } : n
          )
        );
      }
    }
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  return (
    <div style={styles.container}>
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
            <MenuItem key={n.id} onClick={handleCloseNotifications}>
              {n.message}
            </MenuItem>
          ))
        )}
      </Menu>

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
        <p style={styles.title}>Bienvenido al panel de usuario</p>
        {userEmail && (
          <p style={styles.welcomeText}>
            Hola {userEmail === "admin@cjmotor.com" ? "Administrador" : userEmail}
          </p>
        )}
      </div>

      <Button variant="contained" style={styles.button} onClick={() => router.push("/historial-reparaciones")}>
        Historial reparaciones
      </Button>

      <Button variant="contained" style={styles.button} onClick={() => router.push("/perfil")}>
        Perfil
      </Button>

      <Button variant="contained" style={styles.button} onClick={() => router.push("/")}>
        Solicitar cita
      </Button>

      <Button variant="contained" style={styles.button} onClick={() => router.push("/mis-citas")}>
        Mis Citas
      </Button>
    </div>
  );
}
