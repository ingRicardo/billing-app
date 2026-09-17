import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
export const routes: Routes = [
    { path: '', component: Home },
    { path: 'home', component: Home },
    { path: 'contact', component: Contact}
];
