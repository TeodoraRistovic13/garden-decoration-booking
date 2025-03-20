import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxCaptchaModule } from 'ngx-captcha';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrikazProfilaComponent } from './prikaz-profila/prikaz-profila.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { FirmeVlasnikComponent } from './firme-vlasnik/firme-vlasnik.component';
import { FirmaDetaljiComponent } from './firma-detalji/firma-detalji.component';
import { IzmenaProfilaComponent } from './izmena-profila/izmena-profila.component';
import { ZakazivanjeFormaComponent } from './zakazivanje-forma/zakazivanje-forma.component';
import { ZakazivanjaVlasnikComponent } from './zakazivanja-vlasnik/zakazivanja-vlasnik.component';
import { KomentarModalComponent } from './komentar-modal/komentar-modal.component';
import { OdrzavanjeVlasnikComponent } from './odrzavanje-vlasnik/odrzavanje-vlasnik.component';
import { ZakazivanjaDekoraterComponent } from './zakazivanja-dekorater/zakazivanja-dekorater.component';
import { OdrzavanjaDekoraterComponent } from './odrzavanja-dekorater/odrzavanja-dekorater.component';
import { StatistikaDekoraterComponent } from './statistika-dekorater/statistika-dekorater.component';
import { ZakazivanjeDetaljiComponent } from './zakazivanje-detalji/zakazivanje-detalji.component';
import { AdminStranicaComponent } from './admin-stranica/admin-stranica.component';
import { DodavanjeFirmeComponent } from './dodavanje-firme/dodavanje-firme.component';
import { DodavanjeDekorateraComponent } from './dodavanje-dekoratera/dodavanje-dekoratera.component';
import { AdminIzmenaProfilaComponent } from './admin-izmena-profila/admin-izmena-profila.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { KomentarOdbijenicaModalComponent } from './komentar-odbijenica-modal/komentar-odbijenica-modal.component';
import { FooterComponent } from './footer/footer.component';
import { NeautorizovanPristupComponent } from './neautorizovan-pristup/neautorizovan-pristup.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PocetnaComponent,
    PrikazProfilaComponent,
    LoginAdminComponent,
    PromenaLozinkeComponent,
    FirmeVlasnikComponent,
    FirmaDetaljiComponent,
    IzmenaProfilaComponent,
    ZakazivanjeFormaComponent,
    ZakazivanjaVlasnikComponent,
    KomentarModalComponent,
    OdrzavanjeVlasnikComponent,
    ZakazivanjaDekoraterComponent,
    OdrzavanjaDekoraterComponent,
    StatistikaDekoraterComponent,
    ZakazivanjeDetaljiComponent,
    AdminStranicaComponent,
    DodavanjeFirmeComponent,
    DodavanjeDekorateraComponent,
    AdminIzmenaProfilaComponent,
    KomentarOdbijenicaModalComponent,
    FooterComponent,
    NeautorizovanPristupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    NgxChartsModule,
    MatSnackBarModule,
    NgxCaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
