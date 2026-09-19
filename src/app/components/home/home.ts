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

  //services = this.billService.services;

  showSuccessModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  showErrorModal = signal<boolean>(false);

  addServiceFlag = signal<boolean>(true);
  getServiceFlag = signal<boolean>(false);

  searchName = signal<string>('');
  searchEmail = signal<string>('');
  isSearching = signal<boolean>(false);

  // Access service signals directly
  services = this.billService.services;
  loading = this.billService.loading;

  ngOnInit(): void {
    //this.billService.getAll().subscribe();
  }

  searchService(){
    const name = this.searchName();
    const email = this.searchEmail();
    //if(this.isSearching()) return;
   // this.isSearching.set(true);
    if(name  != '' && email != ''){

      console.log(name , email);

      this.billService.search(name, email).subscribe({
        next: () => {
 
          console.log("search");
        },
        error: () => {
       
          console.log('error while searching the billservice');
        }
      });

    }else{
        this.showErrorModal.set(true);
        
    }

  }
  resetSearch(): void {
    this.searchName.set('');
    this.searchEmail.set('');
    //this.billService.getAll().subscribe();
  }
 
  showGetServ() {
    this.addServiceFlag.set(false);
    this.getServiceFlag.set(true);
  }
  
  showAddServ() {
    this.addServiceFlag.set(true);
    this.getServiceFlag.set(false);
  }

  addService() {
    /*console.log('add service  name : ', this.name() ,' servicename: ', this.servicename(),
    'number: ', this.cost(), 'duedate: ',this.duedate(), 'type: ', this.type(), 'email: ',this.email(), 'status: ', this.status());
    */
    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);

    if (this.name() === '' || this.servicename() === '' || this.cost() === 0 || this.duedate() === '' || this.type() === '' || this.email() === ''
      || this.status() === '') {
      /*  alert('fill the fields'+ this.name() + " "+ this.servicename() +" "+ this.cost() + " "+ this.duedate() +  " "+ this.type() +  " "+ this.email()+  
       " "+ this.status()); */
       this.showErrorModal.set(true);
    } else {
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
          this.isSubmitting.set(false);
          this.showSuccessModal.set(true);
          this.resetForm();

        },
        error: () => {
          this.showErrorModal.set(true);
          this.isSubmitting.set(false);
          console.log('error while creating the billservice');
        }
      });
    }
  }

  closeModal(): void {
    this.showSuccessModal.set(false);
  }
  closeErrorModal(){
    this.showErrorModal.set(false);
    this.isSubmitting.set(false);
  }
  private resetForm(): void {
    this.name.set('');
    this.servicename.set('');
    this.cost.set(0);
    this.duedate.set('');
    this.status.set('');
    this.email.set('');
  }
}
