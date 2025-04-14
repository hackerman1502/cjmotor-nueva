import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { cita } = req.body;

    // Validación básica
    if (!cita.nombre || !cita.telefono || !cita.fecha || !cita.hora || !cita.servicio) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Insertar en la tabla "citas" de Supabase
    const { data, error } = await supabase.from("citas").insert([cita]);

    if (error) {
      console.error("Error al guardar en Supabase:", error);
      return res.status(500).json({ message: "Error al guardar la cita", error });
    }

    return res.status(200).json({ message: "Cita guardada correctamente", data });
  }

  return res.status(405).json({ message: "Método no permitido" });
}

