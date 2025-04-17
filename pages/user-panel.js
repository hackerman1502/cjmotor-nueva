import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";

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
    backgroundColor: "white",    // Fondo blanco
    color: "black",              // Letras negras
    fontSize: "0.75rem",
    padding: "6px 12px",
    borderRadius: "6px",
    textTransform: "none",
    fontWeight: "500",
  },
};

export default function UserPanel() {
  const [user, setUser] = useState(null);  // Estado para almacenar el usuario logueado
  const router = useRouter();

  // Obtener la sesión y el usuario logueado
  const getUser = async () => {
    const session = supabase.auth.session(); // Obtener la sesión activa
    if (session) {
      setUser(session.user); // Si hay sesión, asignamos el usuario al estado
    } else {
      setUser(null); // Si no hay sesión, lo dejamos en null
    }
  };

  useEffect(() => {
    getUser();  // Al cargar el componente, obtener el usuario
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      {/* 🔓 Botón Log out en la esquina superior derecha */}
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

        {/* Mostrar el nombre o email del usuario si está logueado */}
        {user ? (
          <p style={styles.title}>Usuario logueado: {user.email}</p>  {/* Mostrar el email del usuario */}
        ) : (
          <p style={styles.title}>No has iniciado sesión</p>
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

