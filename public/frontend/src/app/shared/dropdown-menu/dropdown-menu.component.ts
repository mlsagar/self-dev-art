import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { RouterLink } from '@angular/router';

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


  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  clickOutside() {
    if(this.showMenu) {
      this.showMenu = false;      
    }
  }
}
