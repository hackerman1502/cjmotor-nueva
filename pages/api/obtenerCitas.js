// pages/api/obtenerCitas.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const citasPath = path.join(process.cwd(), 'public', 'horarios.json');

  try {
    const rawData = fs.readFileSync(citasPath, 'utf-8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las citas", error });
  }
}