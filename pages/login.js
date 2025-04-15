import Image from 'next/image';

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJMOTOR"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="text-white text-3xl font-bold mb-4">Bienvenido a CJMOTOR</h1>
        <p className="text-gray-400 mb-6">Inicia sesión para gestionar tus citas</p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
          Acceder
        </button>
      </div>
    </div>
  );
}
