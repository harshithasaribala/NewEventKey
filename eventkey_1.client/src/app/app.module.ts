import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
    EmprofileComponent, EventcreationComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule,
    AppRoutingModule, RouterModule, RouterLink,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
//bootstrapApplication(AppComponent);
