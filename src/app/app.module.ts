import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AccordionComponent } from './layouts/accordion/accordion.component';
import { MainComponent } from './layouts/main/main.component';
import { SearchComponent } from './search/search.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));

@NgModule({
  declarations: [],
  exports: [MainComponent, AccordionComponent, SearchComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    MainComponent,
    AccordionComponent,
    SearchComponent,
  ],
  providers: [],
})
export class AppModule {}
