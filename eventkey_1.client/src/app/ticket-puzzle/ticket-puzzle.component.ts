import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
interface PuzzlePiece {
  id: number;
  image: string;
  position: number; // Correct position for the piece
  placed: boolean; // Whether the piece is placed correctly
}
@Component({
  selector: 'app-ticket-puzzle',
  standalone: false,
  
  templateUrl: './ticket-puzzle.component.html',
  styleUrl: './ticket-puzzle.component.css'
})
export class TicketPuzzleComponent implements OnInit {
  puzzlePieces: PuzzlePiece[] = [];
  puzzleComplete: boolean = false;

  // Example of a VIP ticket image
  ticketImageUrl = 'assets/Ticket.jpg';
  pieceCount = 9; // Number of pieces in the puzzle (3x3 grid)

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.initializePuzzle();
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  initializePuzzle(): void {
    this.puzzlePieces = [];
    for (let i = 0; i < this.pieceCount; i++) {
      this.puzzlePieces.push({
        id: i,
        image: `${this.ticketImageUrl}?piece=${i}`,
        position: i, // The correct position is the same as the index
        placed: false
      });
    }

    // Shuffle pieces to make the puzzle jumbled
    this.shufflePieces();
  }

  // Shuffle the puzzle pieces for a random starting state
  shufflePieces(): void {
    this.puzzlePieces.sort(() => Math.random() - 0.5);
  }

  // Handle the drop event for placing the pieces
  onPieceDropped(piece: PuzzlePiece, newPosition: number): void {
    // If the piece is placed in the correct position
    if (newPosition === piece.position) {
      piece.placed = true;
      this.checkPuzzleCompletion();
    }
  }

  // Check if the puzzle is complete
  checkPuzzleCompletion(): void {
    this.puzzleComplete = this.puzzlePieces.every(piece => piece.placed);
  }

  // Reset the puzzle if the user wants to try again
  resetPuzzle(): void {
    this.puzzleComplete = false;
    this.initializePuzzle();
  }
  goBack() {
    this.location.back();
  }
}
