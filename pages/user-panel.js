import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";

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
};

export default function UserPanel() {
  const router = useRouter();

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

      <Button
        variant="contained"
        style={styles.button}
        onClick={() => router.push("/historial-reparaciones")}
      >
        Historial reparaciones
      </Button>

      <Button
  variant="contained"
  style={styles.button}
  onClick={() => router.push("/")}
>
  Solicitar cita
</Button>
    </div>
  );
}

