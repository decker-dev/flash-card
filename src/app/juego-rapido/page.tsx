'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {Flashcard} from "@/components/Flashcard";

// Mock data for flashcards
const mockFlashcards = [
  { question: "¿Cuál es la capital de Francia?", answer: "París" },
  { question: "¿En qué año comenzó la Segunda Guerra Mundial?", answer: "1939" },
  { question: "¿Quién pintó la Mona Lisa?", answer: "Leonardo da Vinci" },
  { question: "¿Cuál es el elemento químico más abundante en el universo?", answer: "Hidrógeno" },
]

export default function JuegoRapido() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [ratings, setRatings] = useState<string[]>([])

  const handleRate = (rating: 'perfect' | 'good' | 'bad' | 'none') => {
    setRatings([...ratings, rating])
    if (currentCardIndex < mockFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const isGameOver = currentCardIndex === mockFlashcards.length

  if (isGameOver) {
    const totalCards = mockFlashcards.length
    const perfectCount = ratings.filter(r => r === 'perfect').length
    const goodCount = ratings.filter(r => r === 'good').length
    const badCount = ratings.filter(r => r === 'bad').length
    const noneCount = ratings.filter(r => r === 'none').length

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Resumen del Juego</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg mb-2">Total de tarjetas: {totalCards}</p>
          <p className="text-lg mb-2">Perfecto: {perfectCount}</p>
          <p className="text-lg mb-2">Bien: {goodCount}</p>
          <p className="text-lg mb-2">Mal: {badCount}</p>
          <p className="text-lg mb-4">Nada: {noneCount}</p>
          <Link href="/">
            <Button>Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Juego Rápido</h1>
      <Flashcard
        question={mockFlashcards[currentCardIndex].question}
        answer={mockFlashcards[currentCardIndex].answer}
        onRate={handleRate}
      />
      <p className="mt-4 text-gray-600">
        Tarjeta {currentCardIndex + 1} de {mockFlashcards.length}
      </p>
    </div>
  )
}

