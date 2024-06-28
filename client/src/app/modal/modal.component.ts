import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  onCloseModal(): void {
    this.closeModal.emit();
  }
}