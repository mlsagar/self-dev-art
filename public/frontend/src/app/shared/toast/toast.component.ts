import { Component, OnInit } from '@angular/core';
import { MESSAGE_TYPE, ToastService } from './toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit{
  messageType = MESSAGE_TYPE;
  constructor(
    public toast: ToastService
  ) {}
  ngOnInit(): void {
    // this._toastService.toastMessage$.subscribe(console.log)    
  }

  dismiss() {
    this.toast.close();
  }
  
}
