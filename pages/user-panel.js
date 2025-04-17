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
    backgroundColor: "#444",
    color: "white",
    fontSize: "0.75rem",
    padding: "6px 12px",
    borderRadius: "6px",
    textTransform: "none",
  },
};

export default function UserPanel() {
  const router = useRouter();

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


