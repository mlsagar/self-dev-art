import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {

  @Output()
  appClickOutside: EventEmitter<void> = new EventEmitter();

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: PointerEvent) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickInside: boolean = nativeElement.contains(event.target);
    if(!clickInside) {
      this.appClickOutside.emit();
    }
  }

  constructor(private elementRef: ElementRef) { }

}
