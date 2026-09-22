import { Component, computed, inject, model, signal } from '@angular/core';
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
  frequency = signal<string>('');

  showCalcByDate = signal<boolean>(false);

  //services = this.billService.services;

  showSuccessModal = signal<boolean>(false);
  
  showErrorModal = signal<boolean>(false);

  addServiceFlag = signal<boolean>(true);
  getServiceFlag = signal<boolean>(false);

  showTotalCost = signal<boolean>(false);

  searchName = signal<string>('');
  searchEmail = signal<string>('');
  isSearching = signal<boolean>(false);
  futuredate = signal<string>('');
  selectedItem = signal<BillServiceItem | undefined>(undefined);

  // Access service signals directly
  services = this.billService.services;
  loading = this.billService.loading;
  isSubmitting = this.billService.isSubmitting;

  income = signal<number>(0);

  ngOnInit(): void {
    //this.billService.getAll().subscribe();
  }
 
  addIncome(){
    console.log("income "+this.income());
    console.log("bills ",this.bills());
    this.bills().forEach(bill => {
        if (bill.id === undefined) {
            return;
        }
    
        const id = bill.id;
        const updateService: BillServiceItem = {
          id: id,
          name: bill.name,
          serviceName: bill.serviceName,
          cost: bill.cost,
          dueDate: bill.dueDate,
          type: bill.type,
          email: bill.email,
          status: bill.status,
          frequency: bill.frequency,
          idempotencyKey: bill.idempotencyKey,
          income: this.income()
      };
      this.billService.update(id, updateService).subscribe({
        next: (result) => {
           console.log(`Successfully updated bill ID: ${id}`, result);
           this.showSuccessModal.set(true);
           this.income.set(0);
        },
        error: (err) => {
         
           console.error(`Error while updating bill ID: ${id}`, err);
           this.showErrorModal.set(true);
           this.income.set(0);
        }
      });
      console.log(bill.id+ " "+ bill.name);
    });
  }

  showCostByDate(item?: BillServiceItem){
    this.showCalcByDate.set(true);
    console.log(item?.id);
    this.selectedItem.set(item);
    this.futuredate.set('');
    this.singleCostByDate.set(0);
    this.isCostByDateCalc.set(false);
   // console.log(duedate + " futuredate "+ this.futuredate());
    
  }
  singleCostByDate = signal<number>(0);
  isCostByDateCalc = signal <boolean>(false);
  calculateCostByDate(item?: BillServiceItem){
   // console.log(item?.dueDate + " futuredate "+ this.futuredate() + " cost "+ item?.cost + " frequency "+ item?.frequency);

      if (!item?.dueDate || !item?.cost) {
            return;
      }
    
    const dueDate = item.dueDate;
    const futureDate = this.futuredate();
    const cost = item.cost

    if (dueDate != '' && futureDate !=''){
      this.isCostByDateCalc.set(true);
      const monthDifference = this.getMonthDifference(
                                        dueDate,
                                        futureDate
          );
      console.log(`monthDifference : ${monthDifference}`);
      console.log(`${dueDate} futuredate ${futureDate} cost ${cost} frequency ${item.frequency}`
      );
      switch (item.frequency) {
        case 'Weekly':{
          this.singleCostByDate.set(  Math.round (  ( this.calculateWeeksBetween(dueDate,futureDate) * cost) *100) /100);
          break;
        }
        case 'Monthly':{
          this.singleCostByDate.set( Math.round ( ((monthDifference)* cost) * 100 ) /100 );
          break;
        }
        case '2-Months':{
          this.singleCostByDate.set( Math.round ( ((monthDifference/2)* cost) * 100 ) /100 );
          break;
        }
        case '3-Months':{
          this.singleCostByDate.set(Math.round ( ((monthDifference/3)* cost) * 100 ) /100);
          break;
        }
        case '4-Months':{
          this.singleCostByDate.set(Math.round ( ((monthDifference/4)* cost) * 100 ) /100);
          break;
        }
    
        case '6-Months':{
          this.singleCostByDate.set(Math.round ( ((monthDifference/6)* cost) * 100 ) /100);
          break;
        }
          
        case 'Year':{
          this.singleCostByDate.set(Math.round ( ((monthDifference/12)* cost) * 100 ) /100);

          break;
        }
      }
  }

  }

  getMonthDifference(dateStr1: string, dateStr2: string): number {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);

    // Calculate months based on year and month differences
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();

    // Total months
    return (yearDiff * 12) + monthDiff;
  }

  calculateWeeksBetween(dateStr1: string, dateStr2: string): number {
    // 1. Convert string dates to Date objects
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    // 2. Get the absolute difference in milliseconds
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());

    // 3. Define milliseconds in a single week (1000ms * 60s * 60m * 24h * 7 days)
    const msInWeek = 1000 * 60 * 60 * 24 * 7;

    // 4. Return the result (use Math.floor, Math.ceil, or keep decimals based on your needs)
    return Math.floor(diffInMs / msInWeek); 
  }
  bills = signal<BillServiceItem[]>([]); 
  searchService(){
    const name = this.searchName();
    const email = this.searchEmail();
    //if(this.isSearching()) return;
    this.isSearching.set(true);
    if(name  != '' && email != ''){

      console.log(name , email);

      this.billService.search(name, email).subscribe({
        next: (results) => {
          //console.log("search successful", results);
          this.bills.set(results); // Store the list in your Signal
          console.log("search");
          this.showTotalCost.set(true);
        },
        error: () => {
          this.showTotalCost.set(false);
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


  totalCost = computed(() => {
    return this.services().reduce((sum, item) => sum + (item.cost || 0), 0);
  });

  addService() {
    /*console.log('add service  name : ', this.name() ,' servicename: ', this.servicename(),
    'number: ', this.cost(), 'duedate: ',this.duedate(), 'type: ', this.type(), 'email: ',this.email(), 'status: ', this.status());
    */
   const name = this.name();
   const serviceName = this.servicename();
   const cost = this.cost();
   const dueDate =  this.duedate();
   const type = this.type();
   const email = this.email();
   const status = this.status();
   const frequency = this.frequency();

    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);

    if (name === '' || serviceName === '' || cost === 0 || dueDate === '' || type === '' || email === ''
      || status === '' || frequency === '') {

       this.showErrorModal.set(true);
    } else {
      const newService: BillServiceItem = {
        name: name,
        serviceName: serviceName,
        cost: cost,
        dueDate: dueDate,
        type: type,
        email: email,
        status: status,
        frequency: frequency,
        idempotencyKey: crypto.randomUUID()
      };

      console.log("newService ", newService);
      this.billService.create(newService).subscribe({
        next: () => {
          this.isSubmitting.set(true);
          this.showSuccessModal.set(true);
          this.resetForm();

        },
        error: () => {
          this.showErrorModal.set(true);
          //this.isSubmitting.set(false);
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
    this.frequency.set('');
  }
}
