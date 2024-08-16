import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { RouterLink } from '@angular/router';
import { UserCredentials } from '../../auth.service';

export interface Dropdown {
  name: string;
  routeLink: string;
  state?: any;
}

export interface DropdownConfig {
  config: Dropdown[]
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, RouterLink],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css'
})
export class DropdownMenuComponent {
  showMenu = false;

  @Input()
  dropdownConfig!: DropdownConfig;

  @Input() user!: UserCredentials;

  @Output() onLogout = new EventEmitter();


  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  clickOutside() {
    if(this.showMenu) {
      this.showMenu = false;      
    }
  }

  logout() {
    this.onLogout.emit();
  }
}
