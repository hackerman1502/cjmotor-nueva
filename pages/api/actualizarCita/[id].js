// pages/api/actualizarCita/[id].js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  const citasPath = path.join(process.cwd(), 'public', 'horarios.json');

  if (req.method === "PATCH") {
    try {
      const rawData = fs.readFileSync(citasPath, 'utf-8');
      const data = JSON.parse(rawData);

      const citaIndex = data.citas.findIndex((cita) => cita.id === id);
      if (citaIndex === -1) {
        return res.status(404).json({ message: "Cita no encontrada" });
      }

      // Actualizar el estado de la cita
      data.citas[citaIndex].estado = req.body.estado;

      fs.writeFileSync(citasPath, JSON.stringify(data, null, 2));

      res.status(200).json({ message: "Estado de cita actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la cita", error });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}