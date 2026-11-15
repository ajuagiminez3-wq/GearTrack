import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app.component';
import { Home } from './home/home.component';
import { GearList } from './gear-list/gear-list.component';
import { GearDetail } from './gear-detail/gear-detail.component';
import { GearForm } from './gear-form/gear-form.component';
import { GearDelete } from './gear-delete/gear-delete.component';
@NgModule({
  declarations: [App, Home, GearList, GearDetail, GearForm, GearDelete],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [provideHttpClient()],
  bootstrap: [App]
})
export class AppModule {}
