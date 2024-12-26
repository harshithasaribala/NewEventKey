import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
interface Ticket {
  x: number;
  y: number;
  falling: boolean;
}
@Component({
  selector: 'app-ticket-catcher',
  standalone: false,
  
  templateUrl: './ticket-catcher.component.html',
  styleUrl: './ticket-catcher.component.css'
})
export class TicketCatcherComponent implements OnInit {
  tickets: Ticket[] = [];
  score = 0;
  basketX = 200;
  gameOver = false;

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.startGame();
  }

  @HostListener('mousemove', ['$event'])
  moveBasket(event: MouseEvent) {
    this.basketX = event.clientX - 50;  // Basket moves with the mouse
  }

  startGame() {
    this.score = 0;
    this.gameOver = false;
    this.tickets = [];
    this.spawnTickets();
  }

  spawnTickets() {
    setInterval(() => {
      if (this.gameOver) return;

      const x = Math.floor(Math.random() * 400);  // Random position for each ticket
      this.tickets.push({ x: x, y: 0, falling: true });

      // Move the tickets down
      this.moveTickets();
    }, 1000);
  }

  moveTickets() {
    setInterval(() => {
      if (this.gameOver) return;

      this.tickets.forEach(ticket => {
        ticket.y += 5;  // Speed of falling ticket
        if (ticket.y >= 400) {
          this.checkCatch(ticket);
        }
      });

      // Remove tickets that are off-screen
      this.tickets = this.tickets.filter(ticket => ticket.y < 400);
    }, 50);
  }

  checkCatch(ticket: any) {
    if (ticket.x >= this.basketX && ticket.x <= this.basketX + 100) {
      this.score++;
    } else {
      this.gameOver = true;
    }
  }
  goback() {
    this.location.back();
  }
}
