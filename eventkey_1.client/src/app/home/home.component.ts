import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Import RouterModule for standalone routing

@Component({
  selector: 'app-home',
  standalone: false, 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  title = 'Home Page';
}
