'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FlashcardProps {
  question: string
  answer: string
  onRate: (rating: 'perfect' | 'good' | 'bad' | 'none') => void
}

export function Flashcard({ question, answer, onRate }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    setShowAnswer(false)
  }, [question])

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" id="flashcard-content">
            {showAnswer ? 'Respuesta' : 'Pregunta'}
          </h2>
          <p className="text-lg mb-4" aria-labelledby="flashcard-content">
            {showAnswer ? answer : question}
          </p>
          {!showAnswer && (
            <Button
              onClick={() => setShowAnswer(true)}
              aria-label="Ver respuesta"
            >
              Ver Respuesta
            </Button>
          )}
          {showAnswer && (
            <div className="grid grid-cols-2 gap-2 mt-4" role="group" aria-label="Califica tu respuesta">
              <Button onClick={() => onRate('perfect')} variant="outline" className="bg-green-100 hover:bg-green-200">Perfecto</Button>
              <Button onClick={() => onRate('good')} variant="outline" className="bg-blue-100 hover:bg-blue-200">Bien</Button>
              <Button onClick={() => onRate('bad')} variant="outline" className="bg-yellow-100 hover:bg-yellow-200">Mal</Button>
              <Button onClick={() => onRate('none')} variant="outline" className="bg-red-100 hover:bg-red-200">Nada</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

