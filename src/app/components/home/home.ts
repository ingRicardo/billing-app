import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../services/bill-service';
import { BillServiceItem } from '../../models/bill-service.model';


@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true
})
export class Home {
  private readonly billService = inject(BillService);

// Writable signal holding the input name value
  name = signal<string>('');
  servicename = signal<string>('');
  cost = signal<number>(0);
  duedate = signal<string>('');
  type = signal<string>('');
  email = signal<string>('');
  status = signal<string>('');

  services = this.billService.services;
  ngOnInit(): void {
    //this.billService.getAll().subscribe();
  }

  addService() {
    /*console.log('add service  name : ', this.name() ,' servicename: ', this.servicename(),
    'number: ', this.cost(), 'duedate: ',this.duedate(), 'type: ', this.type(), 'email: ',this.email(), 'status: ', this.status());
    */
    const newService: BillServiceItem = {
      name: this.name(),
      serviceName: this.servicename(),
      cost: this.cost(),
      dueDate: this.duedate(),
      type: this.type(),
      email: this.email(),
      status: this.status(),
      idempotencyKey: crypto.randomUUID()
    };
    console.log("newService ", newService);
    this.billService.create(newService).subscribe({
          next: () => {
            // Clear form fields after successful submission
            alert('success');
            this.name.set('');
            this.servicename.set('');
            this.cost.set(0);
            this.duedate.set('');

          },
          error: ()=>{
            console.log('error while creating the billservice');
          }
        });
  }

}
