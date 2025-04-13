import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'horarios.json');

  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);
    const citas = jsonData.citas || [];

    const header = "Nombre,Teléfono,Fecha,Hora,Servicio,Comentario\n";
    const rows = citas.map(cita =>
      `${cita.nombre},${cita.telefono},${cita.fecha},${cita.hora},${cita.servicio},${cita.comentario?.replace(/,/g, ' ')}`
    );
    const csv = header + rows.join("\n");

    const date = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=citas-${date}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error al exportar CSV:", error);
    res.status(500).json({ error: 'Error al generar el CSV' });
  }
}