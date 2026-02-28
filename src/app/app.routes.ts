import { Routes } from '@angular/router';
import { AboutComponent } from '@app/about/about.component';
import { ContactsComponent } from '@app/contacts/contacts.component';
import { FormComponent } from '@app/form/form.component';
import { HomeComponent } from '@app/home/home.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { ServicesComponent } from '@app/services-page/services.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    component: HomeComponent,
    title: 'DGStudio | Home',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us | DGStudio',
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    title: 'Contact | DGStudio',
  },
  {
    path: 'services',
    component: ServicesComponent,
    title: 'Our Services | DGStudio',
  },
  {
    path: 'form',
    component: FormComponent,
    title: 'Registration | DGStudio',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: '404 - Not Found',
  },
];
