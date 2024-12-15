import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-accounts',
  standalone: false,
  
  templateUrl: './manage-accounts.component.html',
  styleUrl: './manage-accounts.component.css'
})
export class ManageAccountsComponent implements OnInit {
  accounts: any[] = [];
  selectedUserType: string = 'User'; // Default to 'User'
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private adminService: AdminService,private location: Location) { }

  ngOnInit(): void {
    this.fetchAccounts();
  }

  // Fetch accounts based on selected user type
  fetchAccounts(): void {
    this.isLoading = true;
    this.adminService.getAccounts(this.selectedUserType).subscribe(
      (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch accounts.';
        this.isLoading = false;
      }
    );
  }

  // Delete account
  deleteAccount(id: string): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.adminService.deleteAccount(id, this.selectedUserType).subscribe(
        () => {
          alert('Account deleted successfully.');
          this.fetchAccounts();
        },
        (error) => {
          alert('Failed to delete account.');
        }
      );
    }
  }
  goBack(): void {
    this.location.back(); // Navigate to the previous route
  }
}
