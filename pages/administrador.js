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
  },
};

export default function AdminPanel() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setAdminEmail(user.email);
      }
    };

    const fetchCitas = async () => {
      const { data, error } = await supabase.from("citas").select("*");
      if (!error) setCitas(data);
    };

    fetchUser();
    fetchCitas();
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
      {/* 🔓 Botón Log out en la esquina superior derecha */}
      <Button
        variant="contained"
        style={styles.logoutButton}
        onClick={handleLogout}
      >
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

      <Button
        variant="contained"
        style={styles.button}
        onClick={() => router.push("/admin-panel")}
      >
        Calendario citas
      </Button>
      <Button
        variant="contained"
        style={styles.button}
        onClick={() => router.push("/citas-panel")}
      >
        Gestionar citas
      </Button>
          <Button
          variant="contained"
          style={styles.button}
          onClick={() => router.push("/trabajoscompletados")}
        >
          Trabajos Completados
        </Button>
      <Button
        variant="contained"
        style={styles.button}
        onClick={() => router.push("registro-cita-admin")}
      >
        Registro cita
      </Button>
      <Button
        variant="contained"
        style={styles.button}
        onClick={exportarCSV}
      >
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

