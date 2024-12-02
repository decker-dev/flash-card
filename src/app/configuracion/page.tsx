'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useToast} from "@/hooks/use-toast";

interface Flashcard {
  id: string
  question: string
  answer: string
  lastAnswered: number | null
  blockedUntil: number | null
}

interface Deck {
  id: string
  name: string
  cards: Flashcard[]
}

export default function Configuracion() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [currentDeck, setCurrentDeck] = useState<string>('')
  const [newDeckName, setNewDeckName] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedDecks = localStorage.getItem('flashcardDecks')
    if (storedDecks) {
      setDecks(JSON.parse(storedDecks))
      if (JSON.parse(storedDecks).length > 0) {
        setCurrentDeck(JSON.parse(storedDecks)[0].id)
      }
    }
  }, [])

  const saveDecks = (updatedDecks: Deck[]) => {
    setDecks(updatedDecks)
    localStorage.setItem('flashcardDecks', JSON.stringify(updatedDecks))
  }

  const addDeck = () => {
    if (newDeckName) {
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: newDeckName,
        cards: []
      }
      const updatedDecks = [...decks, newDeck]
      saveDecks(updatedDecks)
      setNewDeckName('')
      setCurrentDeck(newDeck.id)
      toast({
        title: "Mazo añadido",
        description: "El nuevo mazo se ha añadido correctamente.",
        duration: 3000,
      })
    }
  }

  const addFlashcard = () => {
    if (newQuestion && newAnswer && currentDeck) {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        question: newQuestion,
        answer: newAnswer,
        lastAnswered: null,
        blockedUntil: null
      }
      const updatedDecks = decks.map(deck =>
        deck.id === currentDeck
          ? { ...deck, cards: [...deck.cards, newCard] }
          : deck
      )
      saveDecks(updatedDecks)
      setNewQuestion('')
      setNewAnswer('')
      toast({
        title: "Flashcard añadida",
        description: "La nueva flashcard se ha añadido correctamente.",
        duration: 3000,
      })
    }
  }

  const updateFlashcard = () => {
    if (editingCard && editingCard.question && editingCard.answer && currentDeck) {
      const updatedDecks = decks.map(deck =>
        deck.id === currentDeck
          ? {
              ...deck,
              cards: deck.cards.map(card =>
                card.id === editingCard.id ? editingCard : card
              )
            }
          : deck
      )
      saveDecks(updatedDecks)
      setEditingCard(null)
      toast({
        title: "Flashcard actualizada",
        description: "La flashcard se ha actualizado correctamente.",
        duration: 3000,
      })
    }
  }

  const deleteFlashcard = (id: string) => {
    const updatedDecks = decks.map(deck =>
      deck.id === currentDeck
        ? { ...deck, cards: deck.cards.filter(card => card.id !== id) }
        : deck
    )
    saveDecks(updatedDecks)
    toast({
      title: "Flashcard eliminada",
      description: "La flashcard se ha eliminado correctamente.",
      duration: 3000,
    })
  }

  const currentDeckCards = decks.find(deck => deck.id === currentDeck)?.cards || []

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Configuración de Flashcards</h1>

      <Card className="w-full max-w-2xl mb-6">
        <CardHeader>
          <CardTitle>Añadir Nuevo Mazo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Nombre del mazo"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
            />
            <Button onClick={addDeck}>Añadir Mazo</Button>
          </div>
        </CardContent>
      </Card>

      {decks.length > 0 && (
        <Card className="w-full max-w-2xl mb-6">
          <CardHeader>
            <CardTitle>Seleccionar Mazo</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={currentDeck} onValueChange={setCurrentDeck}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un mazo" />
              </SelectTrigger>
              <SelectContent>
                {decks.map((deck) => (
                  <SelectItem key={deck.id} value={deck.id}>{deck.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {currentDeck && (
        <>
          <Card className="w-full max-w-2xl mb-6">
            <CardHeader>
              <CardTitle>Añadir Nueva Flashcard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <Input
                  placeholder="Pregunta"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Input
                  placeholder="Respuesta"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
                <Button onClick={addFlashcard}>Añadir Flashcard</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Tarjetas Existentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pregunta</TableHead>
                    <TableHead>Respuesta</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDeckCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>{card.question}</TableCell>
                      <TableCell>{card.answer}</TableCell>
                      <TableCell>
                        {card.blockedUntil && card.blockedUntil > Date.now()
                          ? `Bloqueada hasta ${new Date(card.blockedUntil).toLocaleString()}`
                          : 'Disponible'}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="mr-2" onClick={() => setEditingCard(card)}>
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Flashcard</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="question" className="text-right">
                                  Pregunta
                                </Label>
                                <Input
                                  id="question"
                                  value={editingCard?.question}
                                  onChange={(e) => setEditingCard({ ...editingCard!, question: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="answer" className="text-right">
                                  Respuesta
                                </Label>
                                <Input
                                  id="answer"
                                  value={editingCard?.answer}
                                  onChange={(e) => setEditingCard({ ...editingCard!, answer: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <Button onClick={updateFlashcard}>Guardar Cambios</Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={() => deleteFlashcard(card.id)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <div className="mt-6 space-x-4">
        <Link href="/">
          <Button variant="outline">Volver al Inicio</Button>
        </Link>
        <Link href="/estadisticas">
          <Button variant="secondary">Ver Estadísticas</Button>
        </Link>
      </div>
    </div>
  )
}

