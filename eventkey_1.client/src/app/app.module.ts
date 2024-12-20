import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { UserdashboardComponent } from './User/userdashboard/userdashboard.component';
import { EventmanagerdashboardComponent } from './Eventmanager/eventmanagerdashboard/eventmanagerdashboard.component';
import { UserProfileComponent } from './User/userprofile/userprofile.component';
import { EmprofileComponent } from './Eventmanager/emprofile/emprofile.component';
import { EventcreationComponent } from './Eventmanager/eventcreation/eventcreation.component';
import { EditeventComponent} from './Eventmanager/editevent/editevent.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { EventDetailsComponent } from './User/event-details/event-details.component';
import { TicketBookingComponent } from './User/ticket-booking/ticket-booking.component';
import { ETicketComponent } from './User/e-ticket/e-ticket.component';
import { SavedEventsComponent } from './User/saved-events/saved-events.component';
import { PreviousBookingsComponent } from './User/previous-bookings/previous-bookings.component';
import { ManageEventsComponent } from './Eventmanager/manage-events/manage-events.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RevenueVisualizationComponent } from './admin/revenue-visualization/revenue-visualization.component';
import { ManageAccountsComponent } from './admin/manage-accounts/manage-accounts.component';
import { TicketSalesComponent } from './Eventmanager/ticket-sales/ticket-sales.component';
import { SessionService } from './services/session.service';
import { ViewFeedbackComponent } from './admin/view-feedback/view-feedback.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    AdminloginComponent,
    UserdashboardComponent,
    EventmanagerdashboardComponent,
    UserProfileComponent,
    EmprofileComponent,
    EventcreationComponent,
    EditeventComponent,
    AdmindashboardComponent,
    EventDetailsComponent,
    TicketBookingComponent,
    ETicketComponent,
    SavedEventsComponent,
    PreviousBookingsComponent, ManageEventsComponent, FeedbackComponent, RevenueVisualizationComponent, ManageAccountsComponent, TicketSalesComponent, ViewFeedbackComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, AppRoutingModule, RouterModule, RouterLink, ReactiveFormsModule, GooglePayButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
//bootstrapApplication(AppComponent);
