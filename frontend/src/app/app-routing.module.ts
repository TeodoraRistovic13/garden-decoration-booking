import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { OdrzavanjeVlasnikComponent } from './odrzavanje-vlasnik/odrzavanje-vlasnik.component';
import { ZakazivanjaDekoraterComponent } from './zakazivanja-dekorater/zakazivanja-dekorater.component';
import { OdrzavanjaDekoraterComponent } from './odrzavanja-dekorater/odrzavanja-dekorater.component';
import { StatistikaDekoraterComponent } from './statistika-dekorater/statistika-dekorater.component';
import { ZakazivanjeDetaljiComponent } from './zakazivanje-detalji/zakazivanje-detalji.component';
import { AdminStranicaComponent } from './admin-stranica/admin-stranica.component';
import { DodavanjeFirmeComponent } from './dodavanje-firme/dodavanje-firme.component';
import { DodavanjeDekorateraComponent } from './dodavanje-dekoratera/dodavanje-dekoratera.component';
import { AdminIzmenaProfilaComponent } from './admin-izmena-profila/admin-izmena-profila.component';
import { authGuard } from './auth.guard';
import { NeautorizovanPristupComponent } from './neautorizovan-pristup/neautorizovan-pristup.component';
import { TipKorisnika } from './utils/tipoviKorisnika';

const routes: Routes = [
  {path: "", component:PocetnaComponent}, // Opcionalno, očekivana uloga korisnika},
  {path: "login", component:LoginComponent},
  {path: "login-admin", component:LoginAdminComponent},
  {path: "register", component:RegisterComponent},
  {path: "prikaz-profila", component:PrikazProfilaComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik+","+TipKorisnika.Dekorater}},
  {path: "promena-lozinke", component:PromenaLozinkeComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik+","+TipKorisnika.Dekorater+','+TipKorisnika.Admin}},
  {path: "firme-vlasnik", component:FirmeVlasnikComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik}},
  {path: "firma-detalji", component:FirmaDetaljiComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik }},
  {path: "izmena-profila", component:IzmenaProfilaComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik+","+TipKorisnika.Dekorater}},
  {path: "zakazivanje-forma", component:ZakazivanjeFormaComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik}},
  {path: "zakazivanja-vlasnik", component:ZakazivanjaVlasnikComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik}},
  {path: "odrzavanje-vlasnik", component:OdrzavanjeVlasnikComponent,  canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik }},
  {path: "zakazivanja-dekorater", component:ZakazivanjaDekoraterComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Dekorater}},
  {path: "odrzavanja-dekorater", component:OdrzavanjaDekoraterComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Dekorater}},
  {path: "statistika-dekorater", component:StatistikaDekoraterComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Dekorater}},
  {path: "zakazivanje-detalji", component:ZakazivanjeDetaljiComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Vlasnik+","+TipKorisnika.Dekorater}},
  {path: "admin-stranica", component:AdminStranicaComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Admin}},
  {path: "admin-izmena-profila", component:AdminIzmenaProfilaComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Admin}},
  {path: "dodavanje-firme", component:DodavanjeFirmeComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Admin}},
  {path: "dodavanje-dekoratera", component:DodavanjeDekorateraComponent, canActivate: [authGuard], data: { expectedRole: TipKorisnika.Admin}},
  {path: "neautorizovan-pristup", component:NeautorizovanPristupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
