// components/Loader.js
import Image from "next/image";

export default function Loader() {
  return (
    <div style={styles.overlay}>
      <div style={styles.loader}>
        <Image src="/loading.gif" alt="Cargando..." width={120} height={120} />
        <p style={styles.text}>Cargando...</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  text: {
    marginTop: "10px",
    fontSize: "18px",
  },
};
