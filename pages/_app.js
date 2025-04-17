// pages/_app.js
import { UserProvider } from "../context/UserContext"; // Asegúrate de que la ruta sea correcta

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>  {/* Envuelve la aplicación con el UserProvider */}
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
