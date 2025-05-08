import { Button, IconButton, Menu, MenuItem, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    zIndex: 1, // Nos aseguramos de que el contenido esté encima del fondo
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
    margin: "10px 0",
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
    zIndex: 2,
  },
  notifications: {
    position: "absolute",
    top: "20px",
    right: "90px",
    color: "white",
    zIndex: 3,
  },
};

export default function AdminPanel() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/login");
  };

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setAdminEmail(user.email);
  };

  const fetchCitas = async () => {
    const { data, error } = await supabase.from("citas").select("*");
    if (!error) setCitas(data);
  };

  const fetchNotificaciones = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("read", false)
      .order("created_at", { ascending: false });

    if (!error) setNotificaciones(data);
  };

  useEffect(() => {
    fetchUser();
    fetchCitas();
    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleMarkAsReadAndDelete = async (notificationId) => {
    await supabase.from("notifications").update({ read: true }).eq("id", notificationId);
    await supabase.from("notifications").delete().eq("id", notificationId);
    setNotificaciones((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const exportarCSV = () => {
    if (!citas.length) {
      alert("No hay citas para exportar.");
      return;
    }

    const encabezado = ["Nombre", "Teléfono", "Fecha", "Hora", "Servicio", "Comentario"];
    const filas = citas.map((cita) => [
      cita.nombre,
      cita.telefono,
      cita.fecha,
      cita.hora,
      cita.servicio,
      cita.comentario?.replace(/\n/g, " ") || "",
    ]);

    const csvContent =
      [encabezado, ...filas]
        .map((fila) => fila.map((campo) => `"${campo}"`).join(","))
        .join("\n");

    const fechaActual = new Date().toISOString().split("T")[0];
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `citas-${fechaActual}.csv`);
    link.click();
  };

  // 🔥 Fondo con opacidad
  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('/fondo-taller.jpg')", // Asegúrate que esta imagen está en /public
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.15,
    zIndex: 0,
  };

  return (
    <div style={styles.container}>
      <div style={backgroundStyle}></div>

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
          <MenuItem disabled>No hay notificaciones nuevas</MenuItem>
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
        <img src="/logo-cjmotor.png" alt="Logo CJ MOTOR" style={styles.logo} />
        <p style={styles.title}>Panel de Administración</p>
        {adminEmail && (
          <p style={styles.welcomeText}>
            Hola {adminEmail === "admin@cjmotor.com" ? "Administrador" : adminEmail}
          </p>
        )}
      </div>

      <Button variant="contained" style={styles.button} onClick={() => router.push("/admin-panel")}>
        Calendario citas
      </Button>
      <Button variant="contained" style={styles.button} onClick={() => router.push("/citas-panel")}>
        Gestionar citas
      </Button>
      <Button variant="contained" style={styles.button} onClick={() => router.push("/trabajoscompletados")}>
        Trabajos Completados
      </Button>
      <Button variant="contained" style={styles.button} onClick={() => router.push("registro-cita-admin")}>
        Registro cita
      </Button>
      <Button variant="contained" style={styles.button} onClick={exportarCSV}>
        Exportar citas CSV
      </Button>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px" }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: "white",
            color: "black",
            borderRadius: "8px",
            fontWeight: "500",
          }}
          onClick={handleGoHome}
        >
          Volver a login
        </Button>
      </div>
    </div>
  );
}



