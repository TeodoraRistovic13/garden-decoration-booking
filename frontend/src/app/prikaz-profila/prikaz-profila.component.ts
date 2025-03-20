import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Korisnik } from '../models/user';
import { UserService } from '../services/user.service';
import { HttpClient, HttpEventType} from '@angular/common/http'
import { Router } from '@angular/router';
import { FirmaService } from '../services/firma.service';
import { Firma } from '../models/firma';

@Component({
  selector: 'app-prikaz-profila',
  templateUrl: './prikaz-profila.component.html',
  styleUrls: ['./prikaz-profila.component.css']
})
export class PrikazProfilaComponent {

  ngOnInit(): void {

    let korisnik = localStorage.getItem("ulogovan");
    if (korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.tipKartice = this.proveriTipKartice(this.ulogovan.br_kred_kartice);

    this.firmaServis.dohvFirmuPoIdiju(this.ulogovan.id_firme).subscribe((f:Firma)=>{
      this.firma = f;
    })

  }
  constructor(private userServis: UserService, private ruter: Router, private firmaServis: FirmaService) { }

  ulogovan : Korisnik = new Korisnik()
  tipKartice : string = ""
  slikaUrl = "http://localhost:4000/uploads/";
  firma : Firma = new Firma();

  izlogujSe(){

    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']); //vracamo se na pocetnu stranicu

  }

  azurirajProfil(){
    this.ruter.navigate(['izmena-profila'])
  }


  proveriTipKartice(number: string): string {


    if (/^3(00|01|02|03|6|8)\d{12}$/.test(number)) {
      return 'diners';
    } else if (/^5[1-5]\d{14}$/.test(number)) {
      return 'mastercard';
    } else if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(number)) {
      return 'visa';
    } else {
      return 'none';
    }
  }

  dohvNazivFirme(){

    return '@' +  this.firma.naziv;

  }



}
