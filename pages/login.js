// index.js (página principal de la web)
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Bienvenido a CJMOTOR</h1>
      <p>Gestión de citas para tu taller de confianza.</p>
      <Link href="/login">Acceder</Link>
    </div>
  );
}
