import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Zakazivanje } from '../models/zakazivanje';
import { Korisnik } from '../models/user';
import { Boje } from '../utils/kanvas_boje';
import { Usluga } from '../models/usluga';
import { UserService } from '../services/user.service';
import { StatusZakazivanja } from '../utils/status_zakazivanja';

@Component({
  selector: 'app-zakazivanje-detalji',
  templateUrl: './zakazivanje-detalji.component.html',
  styleUrls: ['./zakazivanje-detalji.component.css']
})
export class ZakazivanjeDetaljiComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    let zakazivanje = localStorage.getItem('zakazivanje');
    if(zakazivanje != null){
      this.zakazivanje = JSON.parse(zakazivanje);
    }

    if(this.zakazivanje.tip_baste=='1'){
      this.tipBaste = 'Privatna basta'
    }else{
      this.tipBaste = 'Restoranska basta'
    }

    this.userServis.dohvKorisnika(this.zakazivanje.kor_ime_vlasnika).subscribe((resp:any)=>{
      if(resp['user']){
        this.vlasnik = resp['user'];
      }
      if(this.zakazivanje.kor_ime_dekoratera != ''){
        this.userServis.dohvKorisnika(this.zakazivanje.kor_ime_dekoratera).subscribe((resp:any)=>{
          if(resp['user']){
            this.dekorater = resp['user'];
          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    this.inicijalizujKanvas();
    this.nacrtajBastu();

  }

  constructor(private ruter: Router, private userServis: UserService) { }

  ulogovan : Korisnik = new Korisnik();
  zakazivanje : Zakazivanje = new Zakazivanje();
  tipBaste : string = ""
  canvas : any;
  canvasH : number = 0;
  canvasW : number = 0;
  ctx : any;
  slikaUrl = "http://localhost:4000/uploads/";
  vlasnik : Korisnik = new Korisnik();
  dekorater : Korisnik = new Korisnik();

  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(["/login"])

  }

  dohvTipBaste(tip: string){
    if(tip=='1'){
      return 'Privatna basta';
    }else{
      return 'Restoranska basta';
    }
  }

  //kanvas
  nacrtajBastu(): void {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.zakazivanje.raspored_baste.forEach(element => {
      this.ctx.fillStyle = element.color;
      if (element.type === 'zelenilo' || element.type === 'bazen' || element.type === 'stolica' || element.type == 'lezaljka') {
        this.nacrtajPravougaonik(element.x, element.y, element.width, element.height, element.type);
      } else if (element.type === 'fontana' || element.type === 'sto') {
        this.nacrtajKrug(element.x, element.y, element.radius, element.type);
      }
    });
  }

  inicijalizujKanvas(){

    this.canvas = document.getElementById('mojCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    const elementWithMaxX = this.zakazivanje.raspored_baste.reduce((prev, curr) => {
      return (curr.x > prev.x) ? curr : prev;
    });

    const elementWithMaxY = this.zakazivanje.raspored_baste.reduce((prev, curr) => {
      return (curr.y > prev.y) ? curr : prev;
    });

    if('radius' in elementWithMaxX){
      this.canvas.width = elementWithMaxX.x + elementWithMaxX.radius * 2;
    }else{
      this.canvas.width =  elementWithMaxX.x + elementWithMaxX.width;
    }

    if('radius' in elementWithMaxY){
      this.canvas.height = elementWithMaxY.y + elementWithMaxY.radius * 2;
    }else{
      this.canvas.height =  elementWithMaxY.y + elementWithMaxY.width;
    }

    this.canvas.height += 5;
    this.canvas.width += 5;

  }

  nacrtajPravougaonik(x: number, y:number, w: number, h: number, tip: string){

    if (tip=='bazen'){
      this.ctx.fillStyle = Boje.svetlaPlava;
      this.ctx.strokeStyle = Boje.tamnijaPlava;
    }else if(tip=='zelenilo'){
      this.ctx.fillStyle = Boje.svetlaZelena;
      this.ctx.strokeStyle = Boje.tamnaZelena;
    }else if(tip=='stolica' || tip =='lezaljka'){
      this.ctx.fillStyle = Boje.svetlaSiva;
      this.ctx.strokeStyle = Boje.tamnaSiva;
    }else{
      console.log(`Nepostojeci tip..${tip}`)
      return;
    }

    if(this.ctx){
      this.ctx.fillRect(x, y, w, h);
      this.ctx.lineWidth = 1; // Podesite debljinu linije
      this.ctx.strokeRect(x, y, w, h);
    }

  }

  nacrtajKrug(x: number, y:number, radius: number, tip: string){

    if (tip=='fontana'){
      this.ctx.fillStyle = Boje.svetlaPlava;
      this.ctx.strokeStyle = Boje.tamnijaPlava;
    }else if(tip=='sto'){
      this.ctx.fillStyle = Boje.tamnaBraon;
      this.ctx.strokeStyle = Boje.svetlaBraon;
    }else{
      console.log(`Nepostojeci tip..${tip}`)
      return;
    }

    if(this.ctx){

      this.ctx.beginPath();
      // (x, y) - koordinate centra kruga, radius - poluprečnik, startAngle i endAngle - uglovi u radijanima
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.lineWidth = 1; // Debljina ivice
      this.ctx.stroke(); // Nacrtaj ivicu

    }

  }

  uslugeString(u : Usluga[]){

    let podatak = ""
    if(u.length > 1){
      for(let i = 0; i < u.length-1; i++){
        podatak += u[i].naziv + ",\n"
      }
    }

    podatak += u[u.length-1].naziv;
    return podatak;

  }

  statusZavrseno(){
    if(this.zakazivanje.status==StatusZakazivanja.Kreirano ||
      this.zakazivanje.status== StatusZakazivanja.Odbijeno ||
      this.zakazivanje.status==StatusZakazivanja.Otkazano
    ) return false;

    //stanje je potvrdjeno, zavrseno, majstor, servisiranje
    return true;
  }

}
