'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import {useToast} from "@/hooks/use-toast";
import {Flashcard} from "@/components/Flashcard";

interface FlashcardType {
  id: string
  question: string
  answer: string
  lastAnswered: number | null
  blockedUntil: number | null
}

interface Deck {
  id: string
  name: string
  cards: FlashcardType[]
}

interface Rating {
  deckId: string
  cardId: string
  rating: 'perfect' | 'good' | 'bad' | 'none'
}

interface GlobalStats {
  totalCards: number
  perfect: number
  good: number
  bad: number
  none: number
}

const BLOCK_TIMES = {
  perfect: 24 * 60 * 60 * 1000, // 1 día
  good: 60 * 60 * 1000, // 1 hora
  bad: 60 * 1000, // 1 minuto
  none: 0 // Sin bloqueo
}

export default function JuegoRapido() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [currentDeck, setCurrentDeck] = useState<string>('')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [gameOver, setGameOver] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedDecks = localStorage.getItem('flashcardDecks')
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
      if (JSON.parse(storedDecks).length > 0) {
        setCurrentDeck(JSON.parse(storedDecks)[0].id)
      }
    }

    const storedRatings = localStorage.getItem('flashcardRatings')
    if (storedRatings) {
      setRatings(JSON.parse(storedRatings))
    }
  }, [])

  const updateGlobalStats = (rating: 'perfect' | 'good' | 'bad' | 'none') => {
    const storedStats = localStorage.getItem('globalStats')
    const stats: GlobalStats = storedStats ? JSON.parse(storedStats) : {
      totalCards: 0,
      perfect: 0,
      good: 0,
      bad: 0,
      none: 0
    }

    stats.totalCards++
    stats[rating]++

    localStorage.setItem('globalStats', JSON.stringify(stats))
  }

  const handleRate = (rating: 'perfect' | 'good' | 'bad' | 'none') => {
    if (!currentDeck) return

    const currentDeckCards = decks.find(deck => deck.id === currentDeck)?.cards || []
    if (currentDeckCards.length === 0) return

    const currentCard = currentDeckCards[currentCardIndex]
    const newRating: Rating = {
      deckId: currentDeck,
      cardId: currentCard.id,
      rating: rating
    }
    const updatedRatings = [...ratings, newRating]
    setRatings(updatedRatings)
    localStorage.setItem('flashcardRatings', JSON.stringify(updatedRatings))

    updateGlobalStats(rating)

    // Actualizar el tiempo de bloqueo de la tarjeta
    const blockTime = BLOCK_TIMES[rating]
    const updatedDecks = decks.map(deck => {
      if (deck.id === currentDeck) {
        const updatedCards = deck.cards.map(card => {
          if (card.id === currentCard.id) {
            return {
              ...card,
              lastAnswered: Date.now(),
              blockedUntil: Date.now() + blockTime
            }
          }
          return card
        })
        return { ...deck, cards: updatedCards }
      }
      return deck
    })
    setDecks(updatedDecks)
    localStorage.setItem('flashcardDecks', JSON.stringify(updatedDecks))

    toast({
      title: "Respuesta guardada",
      description: `Has calificado esta tarjeta como: ${rating}`,
      duration: 2000,
    })

    moveToNextCard()
  }

  const moveToNextCard = () => {
    const currentDeckCards = decks.find(deck => deck.id === currentDeck)?.cards || []
    let nextCardIndex = currentCardIndex + 1
    while (nextCardIndex < currentDeckCards.length) {
      const nextCard = currentDeckCards[nextCardIndex]
      if (!nextCard.blockedUntil || nextCard.blockedUntil <= Date.now()) {
        setCurrentCardIndex(nextCardIndex)
        return
      }
      nextCardIndex++
    }
    // Si no hay más tarjetas disponibles, el juego ha terminado
    setGameOver(true)
    toast({
      title: "¡Juego terminado!",
      description: "Has completado todas las tarjetas disponibles del mazo.",
      duration: 3000,
    })
  }

  const resetGame = () => {
    localStorage.removeItem('flashcardRatings')
    setRatings([])
    setCurrentCardIndex(0)
    setGameOver(false)
  }

  const handleDeckChange = (deckId: string) => {
    setCurrentDeck(deckId)
    setCurrentCardIndex(0)
    setGameOver(false)
  }

  if (gameOver) {
    const currentDeckCards = decks.find(deck => deck.id === currentDeck)?.cards || []
    const deckRatings = ratings.filter(rating => rating.deckId === currentDeck)

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">Resumen del Juego</h1>
        <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-2xl text-card-foreground">
          <h2 className="text-2xl font-semibold mb-4">Tus respuestas:</h2>
          {currentDeckCards.map((card) => {
            const rating = deckRatings.find(r => r.cardId === card.id)
            return (
              <div key={card.id} className="mb-4 p-4 border rounded">
                <p className="font-bold">Pregunta: {card.question}</p>
                <p>Respuesta: {card.answer}</p>
                <p className="mt-2">Tu calificación: <span className={`font-semibold ${
                  rating?.rating === 'perfect' ? 'text-green-600' :
                  rating?.rating === 'good' ? 'text-blue-600' :
                  rating?.rating === 'bad' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{rating?.rating || 'No respondida'}</span></p>
                {card.blockedUntil && card.blockedUntil > Date.now() && (
                  <p className="mt-1 text-yellow-600">Bloqueada hasta: {new Date(card.blockedUntil).toLocaleString()}</p>
                )}
              </div>
            )
          })}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Estadísticas:</h3>
            <p>Total de tarjetas: {deckRatings.length}</p>
            <p>Perfecto: {deckRatings.filter(r => r.rating === 'perfect').length}</p>
            <p>Bien: {deckRatings.filter(r => r.rating === 'good').length}</p>
            <p>Mal: {deckRatings.filter(r => r.rating === 'bad').length}</p>
            <p>Nada: {deckRatings.filter(r => r.rating === 'none').length}</p>
          </div>
          <div className="mt-6 space-x-4">
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
            <Button
              variant="outline"
              onClick={resetGame}
            >
              Reiniciar Juego
            </Button>
            <Link href="/estadisticas">
              <Button variant="secondary">Ver Estadísticas Globales</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">No hay mazos disponibles</h1>
        <p className="text-lg mb-4">Por favor, añade algunos mazos y tarjetas en la página de configuración.</p>
        <Link href="/configuracion">
          <Button>Ir a Configuración</Button>
        </Link>
      </div>
    )
  }

  const currentDeckCards = decks.find(deck => deck.id === currentDeck)?.cards || []
  const availableCards = currentDeckCards.filter(card => !card.blockedUntil || card.blockedUntil <= Date.now())

  if (availableCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">No hay tarjetas disponibles</h1>
        <p className="text-lg mb-4">Todas las tarjetas están bloqueadas en este momento. Por favor, vuelve más tarde.</p>
        <Link href="/">
          <Button>Volver al Inicio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Juego Rápido</h1>
      <div className="w-full max-w-md mb-6">
        <Select value={currentDeck} onValueChange={handleDeckChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un mazo" />
          </SelectTrigger>
          <SelectContent>
            {decks.map((deck) => (
              <SelectItem key={deck.id} value={deck.id}>{deck.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Flashcard
        question={availableCards[currentCardIndex].question}
        answer={availableCards[currentCardIndex].answer}
        onRate={handleRate}
      />
      <p className="mt-4 text-muted-foreground">
        Tarjeta {currentCardIndex + 1} de {availableCards.length} disponibles
      </p>
    </div>
  )
}

