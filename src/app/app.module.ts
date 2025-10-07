import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';  // ← ДОБАВИЛИ

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([])  // ← ДОБАВИЛИ
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }