import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Typography,
  InputLabel,
  Input,
  Button,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE"; // ⚠️ Reemplaza por una clave pública segura
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PerfilRegistro() {
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    matricula: "",
    coche: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getPerfil = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setPerfil((prev) => ({ ...prev, correo: user.email }));
      setLoading(false);
    };
    getPerfil();
  }, []);

  const handleChange = (campo, valor) => {
    setPerfil({ ...perfil, [campo]: valor });
  };

  const guardarPerfil = async () => {
    const camposVacios = Object.values(perfil).some(valor => valor.trim() === "");
    if (camposVacios) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("perfiles").upsert({
      id: user.id,
      ...perfil,
    });

    if (error) {
      alert("Error al guardar el perfil: " + error.message);
      console.error(error);
    } else {
      router.push("/user-panel"); // Redirigir al panel tras guardar
    }
  };

  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Completa tu perfil
          </Typography>

          {[
            { label: "Nombre", campo: "nombre" },
            { label: "Apellidos", campo: "apellidos" },
            { label: "Teléfono", campo: "telefono" },
            { label: "Correo", campo: "correo" },
            { label: "Matrícula", campo: "matricula" },
            { label: "Coche", campo: "coche" },
          ].map(({ label, campo }) => (
            <div key={campo} style={{ marginBottom: "15px" }}>
              <InputLabel>{label}</InputLabel>
              <Input
                value={perfil[campo]}
                onChange={(e) => handleChange(campo, e.target.value)}
                fullWidth
              />
            </div>
          ))}

          <Button variant="contained" onClick={guardarPerfil}>
            Guardar y continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

