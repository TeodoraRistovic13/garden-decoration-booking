import { FirmaService } from './../services/firma.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { GeocodingService } from '../services/geocoding.service';
import { Korisnik } from '../models/user';
import { Firma } from '../models/firma';
import { Router } from '@angular/router';
import { Recenzija } from '../models/recenzija';
import { Zakazivanje } from '../models/zakazivanje';
import { StatusZakazivanja } from '../utils/status_zakazivanja';

@Component({
  selector: 'app-firma-detalji',
  templateUrl: './firma-detalji.component.html',
  styleUrls: ['./firma-detalji.component.css']
})
export class FirmaDetaljiComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {

    let firma = localStorage.getItem("firma");
    if(firma != null){
      this.firma = JSON.parse(firma);
    }
    let korisnik = localStorage.getItem("ulogovan");
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    this.firmaServis.dohvZakazivanjaZaFirmu(this.firma.naziv).subscribe((poslovi: Zakazivanje[])=>{
      this.poslovi = poslovi;
      this.recenzije = this.poslovi.filter(p=>p.recenzija.komentar!='').flatMap(p=>p.recenzija);
      this.poslovi = this.poslovi.filter(p=> p.status==StatusZakazivanja.Zavrseno);
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(private geocodingServis: GeocodingService, private ruter: Router, private firmaServis: FirmaService) { }

  firma : Firma = new Firma();
  ulogovan : Korisnik = new Korisnik();
  poslovi : Zakazivanje[] = [];
  recenzije : Recenzija[] = [];
  private map : any;

  private initMap(): void {

    this.map = L.map('map', {
      center: [44.0165, 21.0059],
      zoom: 8
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.geocodingServis.geocodeAddress(this.firma.adresa).then((coords:any) => {
      const [lat, lng] = coords;
      const marker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`${this.firma.naziv}<br>${this.firma.adresa}`)
        .openPopup();
      this.map.setView([lat, lng], 15); // Center map on the marker
    }).catch(err => {
      console.error('Error during geocoding:', err);
    });
  }

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);
  }

  donjiCeoDeo(realanBroj: number){
    return Math.floor(realanBroj);
  }

  predjiNaZakazivanje() {
    localStorage.setItem('firma', JSON.stringify(this.firma));
    this.ruter.navigate(['/zakazivanje-forma']);
  }

}
