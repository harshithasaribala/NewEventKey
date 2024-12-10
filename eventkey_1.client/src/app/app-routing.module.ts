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

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'home', component: HomeComponent },
  {path:'about',component:AboutComponent},
  { path: 'login', component: LoginComponent },
  {
    path: 'userdashboard', component: UserdashboardComponent, children: [
      { path: 'profile', component: UserProfileComponent } ]},
  {
    path: 'eventmanagerdashboard', component: EventmanagerdashboardComponent, children: [
      { path: 'emprofile', component: EmprofileComponent },
      { path:'eventcreation',component:EventcreationComponent}]
},
  { path: 'signup', component: SignupComponent },
  { path: 'adminlogin', component: AdminloginComponent },
  {path:'userprofile',component:UserProfileComponent},
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule], 
})
export class AppRoutingModule { }
