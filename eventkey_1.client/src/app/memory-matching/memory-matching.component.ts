import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}
@Component({
  selector: 'app-memory-matching',
  standalone: false,
  
  templateUrl: './memory-matching.component.html',
  styleUrl: './memory-matching.component.css'
})
export class MemoryMatchingComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  matchedCards: number = 0;
  gameOver: boolean = false;

  // The possible values on the cards
  cardValues: string[] = ['🍎', '🍌', '🍒', '🍍', '🍓', '🍑', '🍋', '🍉'];

  constructor(private location:Location) { }

  ngOnInit(): void {
    this.initializeGame();
  }

  // Initialize the game
  initializeGame(): void {
    const cardsArray: Card[] = [];

    // Duplicate the values to create pairs of cards
    for (const value of this.cardValues) {
      cardsArray.push({ id: Math.random(), value, flipped: false, matched: false });
      cardsArray.push({ id: Math.random(), value, flipped: false, matched: false });
    }

    // Shuffle the cards
    this.cards = this.shuffle(cardsArray);
    this.matchedCards = 0;
    this.gameOver = false;
  }

  // Shuffle the array of cards
  shuffle(cards: Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements
    }
    return cards;
  }

  // Flip the card
  flipCard(card: Card): void {
    if (this.flippedCards.length === 2 || card.flipped || card.matched || this.gameOver) {
      return;
    }

    card.flipped = true;
    this.flippedCards.push(card);

    // If two cards are flipped, check if they match
    if (this.flippedCards.length === 2) {
      setTimeout(() => {
        this.checkMatch();
      }, 1000); // Delay for a bit before checking
    }
  }

  // Check if the flipped cards match
  checkMatch(): void {
    const [firstCard, secondCard] = this.flippedCards;

    if (firstCard.value === secondCard.value) {
      firstCard.matched = true;
      secondCard.matched = true;
      this.matchedCards += 2;
    } else {
      firstCard.flipped = false;
      secondCard.flipped = false;
    }

    this.flippedCards = [];

    // Check if the game is over
    if (this.matchedCards === this.cards.length) {
      this.gameOver = true;
    }
  }

  // Reset the game
  resetGame(): void {
    this.initializeGame();
  }
  goBack() {
    this.location.back();
  }
}
