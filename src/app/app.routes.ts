// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AboutComponent } from '@app/about/about.component';
import { ContactsComponent } from '@app/contacts/contacts.component';
import { FormComponent } from '@app/form/form.component';
import { HomeComponent } from '@app/home/home.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { ServicesComponent } from '@app/services-page/services.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'form', component: FormComponent },
  { path: '**', component: PageNotFoundComponent },
];
