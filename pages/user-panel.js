import { Button } from "@mui/material";
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
    marginTop: "10px",
    letterSpacing: "1px",
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
  logout: {
    marginTop: "30px",
    backgroundColor: "#e53935",
    color: "white",
    fontWeight: "500",
  },
};

export default function UserPanel() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();  // Cierra la sesión de Supabase
    router.push("/login");          // Redirige al login
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJ MOTOR"
          width={130}
          height={130}
          style={styles.logo}
        />
        <p style={styles.title}>Bienvenido al panel de usuario</p>
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

      {/* Botón para cerrar sesión */}
      <Button variant="contained" style={{ ...styles.button, ...styles.logout }} onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}


