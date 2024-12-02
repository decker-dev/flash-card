import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-8 text-primary">App de Flashcards</h1>
      <div className="flex flex-col space-y-2">
        <Link href="/juego-rapido">
          <Button className="w-64">Jugar</Button>
        </Link>
        <Link href="/configuracion">
          <Button variant="outline" className="w-64">Configuración</Button>
        </Link>
        <Link href="/estadisticas">
          <Button variant="outline" className="w-64">Estadísticas Globales</Button>
        </Link>
      </div>
    </div>
  )
}

