import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { UserdashboardComponent } from './User/userdashboard/userdashboard.component';
import { EventmanagerdashboardComponent } from './Eventmanager/eventmanagerdashboard/eventmanagerdashboard.component';
import { UserProfileComponent } from './User/userprofile/userprofile.component';
import { EmprofileComponent } from './Eventmanager/emprofile/emprofile.component';
import { EventcreationComponent } from './Eventmanager/eventcreation/eventcreation.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { EventDetailsComponent } from './User/event-details/event-details.component';
import { TicketBookingComponent } from './User/ticket-booking/ticket-booking.component';
import { ETicketComponent } from './User/e-ticket/e-ticket.component';
import { SavedEventsComponent } from './User/saved-events/saved-events.component';
import { PreviousBookingsComponent } from './User/previous-bookings/previous-bookings.component';
import { ManageEventsComponent } from './Eventmanager/manage-events/manage-events.component';
import { EditeventComponent } from './Eventmanager/editevent/editevent.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RevenueVisualizationComponent } from './admin/revenue-visualization/revenue-visualization.component';
import { TicketSalesComponent } from './Eventmanager/ticket-sales/ticket-sales.component';
import { ManageAccountsComponent } from './admin/manage-accounts/manage-accounts.component';
import { TicketCatcherComponent } from './ticket-catcher/ticket-catcher.component';
import { MemoryMatchingComponent } from './memory-matching/memory-matching.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'home', component: HomeComponent },
  {path:'about',component:AboutComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'adminlogin', component: AdminloginComponent },
  { path: 'userdashboard', component: UserdashboardComponent },
  { path: 'admindashboard', component: AdmindashboardComponent },
  { path:'admindashboard/revenue-visualization',component:RevenueVisualizationComponent},
  { path: 'eventmanagerdashboard', component: EventmanagerdashboardComponent },
  //{ path: 'eventmanagerdashboard/:eid/eventcreation', component: EventcreationComponent },
  { path: 'userdashboard/userprofile', component: UserProfileComponent },
  { path: 'userdashboard/:userId/feedback', component: FeedbackComponent },
  { path: 'userdashboard/savedEvents', component: SavedEventsComponent },
  { path: 'userdashboard/previousBookings', component: PreviousBookingsComponent },
  { path: 'userdashboard/eventdetails/:eventid/ticketbooking',component: TicketBookingComponent},
  {
    path: 'userdashboard/eventdetails/:eventid/ticketbooking/eticket',component: ETicketComponent,
  },
  { path: 'eventmanagerdashboard/manageEvents', component: ManageEventsComponent },
  { path: 'eventmanagerdashboard/manageEvents/:eventid/editEvent', component: EditeventComponent },
  { path: 'eventmanagerdashboard/ticket-sales', component: TicketSalesComponent },
  { path: 'admindashboard/manage-accounts', component: ManageAccountsComponent },
  { path: 'userdashboard/ticket-catcher', component: TicketCatcherComponent },
  { path:'userdashboard/memory-matcher', component:MemoryMatchingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule], 
})
export class AppRoutingModule { }
