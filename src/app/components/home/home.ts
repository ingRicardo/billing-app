import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {

// Writable signal holding the input name value
  name = signal<string>('');
  servicename = signal<string>('');
  cost = signal<number>(0);
  duedate = signal<string>('');
  type = signal<string>('');
  email = signal<string>('');
  status = signal<string>('');
  addService() {
    console.log('add service  name : ', this.name() ,' servicename: ', this.servicename(),
    'number: ', this.cost(), 'duedate: ',this.duedate(), 'type: ', this.type(), 'email: ',this.email(), 'status: ', this.status());
  }

}
