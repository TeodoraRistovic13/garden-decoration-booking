import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/user';

@Component({
  selector: 'app-neautorizovan-pristup',
  templateUrl: './neautorizovan-pristup.component.html',
  styleUrls: ['./neautorizovan-pristup.component.css']
})
export class NeautorizovanPristupComponent implements OnInit{

  ngOnInit(): void {
    let korisnik = localStorage.getItem("ulogovan");
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }
  }

  ulogovan : Korisnik = new Korisnik();

}
