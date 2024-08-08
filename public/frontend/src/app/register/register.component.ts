import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup } from "@angular/forms";
import { UsersDataService } from '../users-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  

  constructor(
    private _usersDataService: UsersDataService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  register() { }

}
