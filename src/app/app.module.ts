import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

// Configuration object for initializing socket.io with the server URL and options.
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


/**
 * The main module of the application.
 */
@NgModule({
  // Declarations array contains the components, directives, and pipes that belong to this NgModule.
  declarations: [AppComponent],
  
  // Imports array specifies the other modules that this NgModule needs.
  imports: [
    BrowserModule, // Provides services that are essential to launch and run a browser app.
    IonicModule.forRoot(), // Initializes the Ionic framework.
    AppRoutingModule, // App routing module for defining routes.
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG), // Initializes Firebase with the provided configuration.
    AngularFireAuthModule, // Imports AngularFire authentication module.
    AngularFirestoreModule, // Imports AngularFire Firestore module for database operations.
    ReactiveFormsModule, // Imports module for reactive forms.
    HttpClientModule, // Imports module to perform HTTP requests.
    RouterModule, // Provides routing functionalities.
    SocketIoModule.forRoot(config), // Configures and initializes socket.io with the specified config.
  ],

  // Providers array specifies the services that this NgModule contributes to the global collection of services.
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],

  // The root component that Angular creates and inserts into the index.html host web page.
  bootstrap: [AppComponent],
})
export class AppModule { }
