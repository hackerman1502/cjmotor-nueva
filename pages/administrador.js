import { Button } from "@mui/material";
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
    fontFamily: "'Poppins', sans-serif",
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
  notificationIcon: {
    position: "absolute",
    top: "20px",
    right: "90px",
    backgroundColor: "white",
    color: "black",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "0.9rem",
    cursor: "pointer",
    zIndex: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px",
  },
};

export default function AdminPanel() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotis, setMostrarNotis] = useState(false);

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
    const interval = setInterval(fetchNotificaciones, 10000); // cada 10 segundos
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div style={styles.container}>
      {/* 🔔 Campanita de notificaciones */}
      <div style={styles.notificationIcon} onClick={() => setMostrarNotis(!mostrarNotis)}>
        🔔
        {notificaciones.length > 0 && (
          <span style={styles.notificationBadge}>{notificaciones.length}</span>
        )}
      </div>

      {/* 🔓 Botón Log out */}
      <Button variant="contained" style={styles.logoutButton} onClick={handleLogout}>
        Log out
      </Button>

      {mostrarNotis && (
        <div style={{
          position: "absolute",
          top: "60px",
          right: "20px",
          backgroundColor: "#222",
          padding: "15px",
          borderRadius: "8px",
          color: "white",
          width: "280px",
          zIndex: 1,
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Notificaciones</p>
          {notificaciones.length === 0 ? (
            <p>No hay notificaciones nuevas.</p>
          ) : (
            notificaciones.map((noti) => (
              <p key={noti.id} style={{ marginBottom: "8px", fontSize: "0.9rem" }}>
                📩 {noti.message}
              </p>
            ))
          )}
        </div>
      )}

      {/* Header con logo y bienvenida */}
      <div style={styles.header}>
        <img src="/logo-cjmotor.png" alt="Logo CJ MOTOR" style={styles.logo} />
        <p style={styles.title}>Panel de Administración</p>
        {adminEmail && (
          <p style={styles.welcomeText}>
            Hola {adminEmail === "admin@cjmotor.com" ? "Administrador" : adminEmail}
          </p>
        )}
      </div>

      {/* Botones del panel */}
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
        <Button variant="contained" style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "8px",
          fontWeight: "500",
        }} onClick={handleGoHome}>
          Volver a login
        </Button>
      </div>
    </div>
  );
}


