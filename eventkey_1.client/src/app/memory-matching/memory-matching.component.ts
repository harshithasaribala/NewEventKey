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
  standalone:false,
  templateUrl: './memory-matching.component.html',
  styleUrls: ['./memory-matching.component.css']
})
export class MemoryMatchingComponent implements OnInit {
  cards: any[] = [];
  flippedCards: any[] = [];
  matchedCards: any[] = [];
  moves: number = 0;
  gameCompleted: boolean = false;
  cardValues: string[] = [
    '🎟️ VIP Ticket',
    '🎫 General Admission',
    '🎟️ Backstage Pass',
    '🎫 Early Access',
    '🎟️ Priority Seating',
    '🎫 Exclusive Offer',
    '🎟️ Special Guest',
    '🎫 Event Access',
  ];

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.resetGame();
  }

  resetGame() {
    this.cards = [];
    this.matchedCards = [];
    this.moves = 0;
    this.gameCompleted = false;

    // Duplicate the card values to create pairs
    const allCards = [...this.cardValues, ...this.cardValues];
    // Shuffle the cards
    this.cards = this.shuffle(allCards);
    this.flippedCards = [];
  }

  shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  flipCard(index: number) {
    if (this.flippedCards.length < 2 && !this.flippedCards.includes(index) && !this.matchedCards.includes(index)) {
      this.flippedCards.push(index);

      // Check for match
      if (this.flippedCards.length === 2) {
        this.moves++;
        const [firstCardIndex, secondCardIndex] = this.flippedCards;
        if (this.cards[firstCardIndex] === this.cards[secondCardIndex]) {
          this.matchedCards.push(firstCardIndex, secondCardIndex);
          this.flippedCards = [];

          // Check if the game is completed
          if (this.matchedCards.length === this.cards.length) {
            this.gameCompleted = true;
          }
        } else {
          setTimeout(() => {
            this.flippedCards = [];
          }, 1000);
        }
      }
    }
  }

  isFlipped(index: number): boolean {
    return this.flippedCards.includes(index) || this.matchedCards.includes(index);
  }

  goBack() {
    this.location.back();
  }
}
