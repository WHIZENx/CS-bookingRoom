import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AngularFireMessagingModule } from "@angular/fire/compat/messaging";

import { DataTablesModule } from "angular-datatables";

import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";

import { RouterModule } from "@angular/router";

import { environment } from "../environments/environment";

import { FirebaseService } from "./firebase.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";

import { HomeComponent } from "./home/home.component";
import { BookingRoomComponent } from "./booking-room/booking-room.component";
import { UserComponent } from "./user/user.component";
import { UserBookingComponent } from "./user-booking/user-booking.component";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./in-memory-db.service";
import { UserService } from "./user.service";
import { UserdbService } from "./userdb.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserComponent,
    BookingRoomComponent,
    UserBookingComponent
  ],
  imports: [
    DataTablesModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false
    }),
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    RouterModule.forRoot([
      { path: "", component: LoginComponent },
      { path: "home", component: HomeComponent },
      { path: "booking", component: BookingRoomComponent },
      { path: "user-booking", component: UserBookingComponent }
    ])
  ],
  providers: [
    FirebaseService,
    AngularFirestore,
    InMemoryDataService,
    UserService,
    UserdbService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
