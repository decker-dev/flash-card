'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GlobalStats {
  totalCards: number
  perfect: number
  good: number
  bad: number
  none: number
}

export default function Estadisticas() {
  const [stats, setStats] = useState<GlobalStats>({
    totalCards: 0,
    perfect: 0,
    good: 0,
    bad: 0,
    none: 0
  })

  useEffect(() => {
    const storedStats = localStorage.getItem('globalStats')
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Estadísticas Globales</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Resumen de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Total de tarjetas respondidas: {stats.totalCards}</p>
            <p>Perfecto: {stats.perfect} ({((stats.perfect / stats.totalCards) * 100).toFixed(2)}%)</p>
            <p>Bien: {stats.good} ({((stats.good / stats.totalCards) * 100).toFixed(2)}%)</p>
            <p>Mal: {stats.bad} ({((stats.bad / stats.totalCards) * 100).toFixed(2)}%)</p>
            <p>Nada: {stats.none} ({((stats.none / stats.totalCards) * 100).toFixed(2)}%)</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 space-x-4">
        <Link href="/">
          <Button variant="outline">Volver al Inicio</Button>
        </Link>
        <Link href="/juego-rapido">
          <Button>Jugar de Nuevo</Button>
        </Link>
      </div>
    </div>
  )
}

