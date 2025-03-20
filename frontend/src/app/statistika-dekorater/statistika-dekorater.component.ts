import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/user';
import { ZakazivanjeService } from '../services/zakazivanje.service';
import { LegendPosition } from '@swimlane/ngx-charts';
import { FirmaService } from '../services/firma.service';
import { Firma } from '../models/firma';


@Component({
  selector: 'app-statistika-dekorater',
  templateUrl: './statistika-dekorater.component.html',
  styleUrls: ['./statistika-dekorater.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class StatistikaDekoraterComponent implements OnInit {

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){

      this.ulogovan = JSON.parse(korisnik);

    }
    this.zakazivanjeServis.dohvBrojPoslovaPoMesecimaZaDekoratera(this.ulogovan.kor_ime).subscribe((rezultati: any[]) => {
      if (rezultati != null) {
        rezultati = this.dodajMeseceKojiFale(rezultati);
        this.barChartData = rezultati.map(rez => ({
          name: this.dohvImeMeseca(rez.month), // Pretvori broj meseca u ime meseca
          value: Math.floor(rez.count)
        }));
      }
    });

    this.firmaServis.dohvFirmuPoIdiju(this.ulogovan.id_firme).subscribe((firma : Firma)=>{

      if(firma != null){
        this.zakazivanjeServis.dohvRasporeduPoslaUFirmi(firma.naziv).subscribe((rezultati: any[])=>{
          if (rezultati != null) {
            this.pieChartData = rezultati.map(rez => ({
              name: rez.dekorater, // Pretvori broj meseca u ime meseca
              value: Math.floor(rez.count)
            }));
          }
        })

      }
    })



    this.zakazivanjeServis.dohvProsecanBrPoslovimaPoDanimaUPoslDveGodine().subscribe((rezultati: any[])=>{
      if (rezultati != null) {
        rezultati = this.dodajDaneKojiFale(rezultati);
        this.histogramData = rezultati.map(rez => ({
          name: this.dohvImeDana(rez.dan), // Pretvori broj meseca u ime meseca
          value: rez.broj
        }));
      }
    })



  }

  constructor(private ruter: Router, private zakazivanjeServis: ZakazivanjeService, private firmaServis : FirmaService) { }



  ulogovan : Korisnik = new Korisnik();
  barChartData : any[] = [];
  pieChartData : any[] = [];
  histogramData : any[] = [];

  below = LegendPosition.Below;


  xAxisLabel = 'Country';

  izlogujSe() {

    localStorage.removeItem('ulogovan');
    this.ruter.navigate(["/login"])

  }

  dohvImeMeseca(monthNumber: number): string {
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];
    return months[monthNumber - 1]; // Meseci su 1-indeksirani
  }
  dohvImeDana(dayOfWeek: number): string {
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
    return days[dayOfWeek - 1]; // MongoDB vraća dane od 1 (Nedelja) do 7 (Subota)
  }


  formatYAxis(value: number): string {
    return Math.floor(value).toString(); // Formatira vrednost kao celobrojnu
  }

  dodajMeseceKojiFale(podaci:any[]): any[]{

    let meseci = Array.from({ length: 12 }, (_, i) => i + 1);
    let godine = new Set(podaci.map(item => item.year));

    let dopunjeniPodaci:any[] = [];

    godine.forEach(godina => {
      meseci.forEach(mesec => {
        let postojeciPodaci = podaci.find(item => item.year === godina && item.month === mesec);
        if (postojeciPodaci) {
          dopunjeniPodaci.push(postojeciPodaci);
        } else {
          dopunjeniPodaci.push({ month: mesec, year: godina, count: 0 });
        }
      });
    });

    return dopunjeniPodaci;

  };

  dodajDaneKojiFale(podaci:any[]): any[]{

    const dani = [2, 3, 4, 5, 6, 7, 1];
    let dataMap = new Map(dani.map(day => [day, 0]));

    podaci.forEach(podatak => {
      dataMap.set(podatak.dayOfWeek, podatak.averageCount);
    });

    let dopunjeniPodaci : any[] = [];
    dopunjeniPodaci = Array.from(dataMap, ([day, count]) => ({
      dan: day,
      broj: count
    }));
    return dopunjeniPodaci;
  }


}
