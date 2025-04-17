import { UserProvider } from "../context/UserContext"; // importamos el provider
//import "../styles/globals.css"; // si no tienes este archivo, lo comentamos

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
