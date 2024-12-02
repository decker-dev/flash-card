import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">App de Flashcards</h1>
      <div className="space-y-4">
        <Link href="/juego-rapido">
          <Button className="w-48">Juego Rápido</Button>
        </Link>
        <Link href="/configuracion">
          <Button variant="outline" className="w-48">Configuración</Button>
        </Link>
      </div>
    </div>
  )
}

