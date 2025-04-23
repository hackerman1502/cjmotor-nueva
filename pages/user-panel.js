import { useState, useEffect } from "react";
import { Button, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // NUEVO
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
  whatsapp: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "#25D366",
    backgroundColor: "#1a1a1a",
    borderRadius: "50%",
    padding: "6px",
  },
};

export default function UserPanel() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
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

        const { data: perfilData } = await supabase
          .from("perfiles")
          .select("nombre")
          .eq("id", user.id)
          .single();

        if (perfilData) {
          setUserName(perfilData.nombre);
        }

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

  const handleOpenNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAsReadAndDelete = async (notificationId) => {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    setNotificaciones((prev) =>
      prev.filter((n) => n.id !== notificationId)
    );
  };

  return (
    <div style={styles.container}>
      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/34666357796"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconButton style={styles.whatsapp}>
          <WhatsAppIcon />
        </IconButton>
      </a>

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
            <MenuItem key={n.id} onClick={() => handleMarkAsReadAndDelete(n.id)}>
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
        <p style={styles.welcomeText}>
          {userName ? `Hola, ${userName}` : "Cargando..."}
        </p>
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

