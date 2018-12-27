import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { NavbarComponent } from './components/navbar/navbar.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { QuestionsEffects } from './components/questions/questions.effects';
import { QuestionsService } from './components/questions/questions.service';
import { metaReducers, reducers } from './reducers';

@NgModule({
  declarations: [AppComponent, NavbarComponent, QuestionsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects, QuestionsEffects])
  ],
  providers: [QuestionsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
