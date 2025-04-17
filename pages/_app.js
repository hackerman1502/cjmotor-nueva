import { UserProvider } from "../context/UserContext"; // Esta ruta debe coincidir
import "../styles/globals.css"; // Si no tienes este archivo, comenta esta línea

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
