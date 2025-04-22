// components/Loader.js
import Image from 'next/image';

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
    position: "fixed",  // Fija la posición sobre todo el contenido
    top: 0,
    left: 0,
    width: "100vw",  // Asegura que ocupe todo el ancho
    height: "100vh",  // Asegura que ocupe toda la altura
    backgroundColor: "rgba(0, 0, 0, 0.85)",  // Fondo negro con opacidad
    display: "flex",
    justifyContent: "center",  // Centra horizontalmente
    alignItems: "center",  // Centra verticalmente
    zIndex: 9999,  // Asegura que quede encima de otros contenidos
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

