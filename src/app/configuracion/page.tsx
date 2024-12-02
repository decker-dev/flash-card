import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Configuracion() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Configuración</h1>
      <p className="text-lg mb-6">Esta página está en construcción.</p>
      <Link href="/">
        <Button>Volver al Inicio</Button>
      </Link>
    </div>
  )
}

