import { Usluga } from './../models/usluga';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Firma } from '../models/firma';
import { Korisnik } from '../models/user';
import { Zakazivanje } from '../models/zakazivanje';
import { FirmaService } from '../services/firma.service';
import { StatusZakazivanja } from '../utils/status_zakazivanja';
import { Boje } from '../utils/kanvas_boje';
import { AVG_POVRSINA_STOLA, AVG_POVRSINA_STOLICE } from '../utils/prosecne_dimenzije_namestaja';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ElemBaste, KrugELem, PravougaonikElem } from '../models/element_baste';
import { BAZEN_H, BAZEN_W, FONTANA_R, STO_R, STOLICA_H, STOLICA_W, ZELENILO_H, ZELENILO_W } from '../utils/kanvas_dimenzije';


@Component({
  selector: 'app-zakazivanje-forma',
  templateUrl: './zakazivanje-forma.component.html',
  styleUrls: ['./zakazivanje-forma.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZakazivanjeFormaComponent implements OnInit, AfterViewInit {


  ngOnInit(): void {

    let firma = localStorage.getItem('firma');
    if(firma !=null) {
      this.firma = JSON.parse(firma);
    }

    let korisnik = localStorage.getItem('ulogovan');
    if(korisnik != null){
      this.ulogovan = JSON.parse(korisnik);
    }

    //dohvatanje termina u zavisnosti od radnog vremena
    this.slobodniTermini = this.generisiSlobodneTermine();

    //namestanje checkboxova za usluge u formi
    //mora dinamicki da se postavi form control jer se usluge menjaju u zavisnosti od firme
    this.usluge = this.firma.usluge;
    //namestanje za privatnu bastu
    const uslugePrivFormArray = this.formaKucnaBasta.get('usluge') as FormArray;
    this.usluge.forEach(() => uslugePrivFormArray.push(new FormControl(false)));
    //dodavanje za prestoransku bastu
    const uslugeRestoFormArray = this.formaRestoran.get('usluge') as FormArray;
    this.usluge.forEach(() => uslugeRestoFormArray.push(new FormControl(false)));

  }

  ngAfterViewInit(): void {
    this.inicijalizujKanvas();
  }

  constructor(private ruter: Router, private fb: FormBuilder, private firmaServis : FirmaService, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {}

  //podaci
  usluge  : Usluga[] = []
  isLinear = false;
  times: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  slobodniTermini: string[] = []
  tipBaste : string = "1";
  firma : Firma = new Firma();
  ulogovan : Korisnik = new Korisnik();
  novoZakazivanje : Zakazivanje = new Zakazivanje();

  prviKorakForma = this.fb.group({
    datum: ['', Validators.required],
    vreme: ['', Validators.required],
    povrsina: ['', [Validators.required, Validators.min(1)]],
    tipBaste: ['', Validators.required]
  });

  formaKucnaBasta = this.fb.group({
    bazen: ['', Validators.required],
    zelenilo: ['', Validators.required],
    namestaj: ['', Validators.required],
    opis: [''],
    usluge: this.fb.array([])
  });

  formaRestoran = this.fb.group({
    naziv: [''],
    adresa: [''],
    fontana: [null, Validators.required],
    zelenilo: [null, Validators.required],
    brojStolova: [null, Validators.required],
    brojStolica: [null, Validators.required],
    opis: [''],
    usluge: this.fb.array([])  // Dodajemo FormArray za usluge
  });


  openSnackBar(tekst : string) {
    this.snackBar.open(tekst, 'Zatvori', {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }


  izlogujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['/login']);

  }

  kreirajDatumNaOsnovuTimeStringa(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  }

  generisiSlobodneTermine(){

    const pocetakDate = this.kreirajDatumNaOsnovuTimeStringa(this.firma.radno_vreme_od);
    const krajDate = this.kreirajDatumNaOsnovuTimeStringa(this.firma.radno_vreme_do);

    const slobodniTermini: string[] = [];
    const tekuciSat = new Date(pocetakDate);

    tekuciSat.setMinutes(0);
    tekuciSat.setSeconds(0);

    while (tekuciSat < krajDate) {
        slobodniTermini.push(this.formatTime(tekuciSat));
        tekuciSat.setHours(tekuciSat.getHours() + 1);
    }

    return slobodniTermini;
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  godisnjiFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    const currentDate = new Date(date).setHours(0,0,0,0);
    const startDate = new Date(this.firma.datum_pocetka_godisnjeg).setHours(0, 0, 0, 0);
    const endDate = new Date(this.firma.datum_kraja_godisnjeg).setHours(0, 0, 0, 0);
    return currentDate < startDate || currentDate > endDate;
  };

  onStepChange(event: StepperSelectionEvent) {

    if (event.selectedIndex === 1) {
      const datumPocetka = new Date(this.firma.datum_pocetka_godisnjeg).toLocaleDateString('sr-RS');
      const datumKraja = new Date(this.firma.datum_kraja_godisnjeg).toLocaleDateString('sr-RS');
      this.openSnackBar(`U periodu (${datumPocetka} - ${datumKraja}) je firma na kolektivnom godišnjem odmoru i nije moguće napraviti zakazivanje.`);
    }
  }

  proveraKvadratura(){

    let uk_povrsina = Number(this.prviKorakForma.get('povrsina')?.value) || 0;
    if(this.tipBaste=='1'){

      let bazen = Number(this.formaKucnaBasta.get('bazen')?.value) || 0;
      let zelenilo = Number(this.formaKucnaBasta.get('zelenilo')?.value) || 0;
      let namestaj = Number(this.formaKucnaBasta.get('namestaj')?.value) || 0;

      if(bazen + zelenilo + namestaj <= uk_povrsina ) return true;
      else {
        console.log('Kvadrature se ne poklapaju!')
        return false;
      }

    }else{

      let fontana = Number(this.formaRestoran.get('fontana')?.value) || 0;
      let zelenilo = Number(this.formaRestoran.get('zelenilo')?.value) || 0;
      let stolovi = Number(this.formaRestoran.get('brojStolova')?.value) || 0;
      let stolice = Number(this.formaRestoran.get('brojStolica')?.value) || 0;


      let pov_stolice_sto = stolovi*AVG_POVRSINA_STOLA + stolice*AVG_POVRSINA_STOLICE;

      if(fontana + zelenilo + pov_stolice_sto <= uk_povrsina) return true;
      else {
        return false;
      }
    }
  }

  proveraDaMoguceZakazivanje(){

    if (this.prviKorakForma.valid && ((this.tipBaste=='1' && this.formaKucnaBasta) || (this.tipBaste=='2' && this.formaRestoran.valid))) {
      if (this.proveraKvadratura() == false){
        this.openSnackBar(`Kvadrature se ne poklapaju! Uzmite u obrzir da svaka stolica zauzima: ${AVG_POVRSINA_STOLICE}, svaki sto ${AVG_POVRSINA_STOLA}!`)
        return;
      }

      if(this.elementiBaste.length ==0){
        this.openSnackBar("Morate da ucitate ili nacrtate raspored baste!")
        return;
      }
      //provera slobodan bar jedan majstor
      let datum = this.prviKorakForma.get('datum')?.value;
      let vreme = this.prviKorakForma.get('vreme')?.value;

      if(vreme != null && datum != null){

        let [sati, minuti] = vreme.split(':').map(Number);
        const datumVreme = new Date(datum);
        datumVreme.setHours(sati, minuti);

        this.firmaServis.dohvSlobodneDekoratere(this.firma.id, datumVreme).subscribe(res=>{
          if(res['users']== null){
            this.openSnackBar("Nems slobodnih dekoratera u tom terminu!")
            return;
          }else{
            this.dodajZahtev();
          }
        })
      }
    }else{
      this.openSnackBar("Forma nije validna! Proverite da li ste popunili sve podatke.")
    }
  }

  dodajZahtev() {

    if (this.prviKorakForma.valid && ((this.tipBaste=='1' && this.formaKucnaBasta) || (this.tipBaste=='2' && this.formaRestoran.valid))) {

      if (this.proveraKvadratura() == false){
        this.openSnackBar(`Kvadrature se ne poklapaju! Uzmite u obrzir da svaka stolica zauzima: ${AVG_POVRSINA_STOLICE}, svaki sto ${AVG_POVRSINA_STOLA}!`)
        return;
      }

      this.novoZakazivanje.kor_ime_vlasnika = this.ulogovan.kor_ime;
      this.novoZakazivanje.firma_naziv = this.firma.naziv;

      let datum = this.prviKorakForma.get('datum')?.value;
      let vreme = this.prviKorakForma.get('vreme')?.value;


      if(vreme != null && datum != null){

        let [sati, minuti] = vreme.split(':').map(Number);
        const datumVreme = new Date(datum);
        datumVreme.setHours(sati, minuti);
        this.novoZakazivanje.datum_izrade = datumVreme;
      }

      let datum_zakazivanja = new Date();
      this.novoZakazivanje.datum_zakazivanja = datum_zakazivanja;

      let uk_povrsina = this.prviKorakForma.get('povrsina')?.value;
      this.novoZakazivanje.uk_povrsina = Number(uk_povrsina) || 0;

      this.novoZakazivanje.tip_baste = this.tipBaste; // 1 - priv, 2 - restoran

      if(this.tipBaste=='1'){

        let bazen = this.formaKucnaBasta.get('bazen')?.value;
        let zelenilo = this.formaKucnaBasta.get('zelenilo')?.value;
        let namestaj = this.formaKucnaBasta.get('namestaj')?.value;
        let opis = this.formaKucnaBasta.get('opis')?.value;

        this.novoZakazivanje.uk_bazen = Number(bazen) || 0;
        this.novoZakazivanje.uk_zelenilo = Number(zelenilo) || 0;
        this.novoZakazivanje.uk_namestaj = Number(namestaj) || 0;  //nz dal ovde treba odvojeno stolice/lezaljke...
        this.novoZakazivanje.kratak_opis = opis || '';

        if(this.formaKucnaBasta.value.usluge != null){
          const izabraneUsluge = this.formaKucnaBasta.value.usluge
            .map((v, i) => (v ? this.usluge[i] : null))
            .filter(v => v !== null);

          this.novoZakazivanje.usluge = [];

          izabraneUsluge.forEach(u=>{
            if (u != null){
              this.novoZakazivanje.usluge.push(u);
            }
          })
        }

      }else{

        let naziv = this.formaRestoran.get('naziv')?.value;
        let adresa = this.formaRestoran.get('adresa')?.value;
        if(naziv != null){
          this.novoZakazivanje.naziv_restorana = naziv;
        }
        if(adresa != null){
          this.novoZakazivanje.adresa_restorana = adresa;
        }

        let fontana = this.formaRestoran.get('fontana')?.value;
        let zelenilo = this.formaRestoran.get('zelenilo')?.value;
        let stolovi = this.formaRestoran.get('brojStolova')?.value;
        let stolice = this.formaRestoran.get('brojStolica')?.value;
        let opis = this.formaRestoran.get('opis')?.value;

        this.novoZakazivanje.uk_fontana = Number(fontana) || 0;
        this.novoZakazivanje.uk_zelenilo = Number(zelenilo) || 0;
        this.novoZakazivanje.br_stolova = Number(stolovi) || 0;
        this.novoZakazivanje.br_stolica = Number(stolice) || 0; //nz dal ovo treba u jedan da ide..ovo br stoloca/stolica..
        this.novoZakazivanje.kratak_opis = opis || '';

        if(this.formaRestoran.value.usluge != null){
          const izabraneUsluge = this.formaRestoran.value.usluge
            .map((v, i) => (v ? this.usluge[i] : null))
            .filter(v => v !== null);

          izabraneUsluge.forEach(u=>{
            if (u != null){
              this.novoZakazivanje.usluge.push(u);
            }
          })
        }

      }

      this.novoZakazivanje.raspored_baste = this.elementiBaste;
      this.novoZakazivanje.status = StatusZakazivanja.Kreirano;

      this.novoZakazivanje.broj_vodenih_povrsina = this.novoZakazivanje
        .raspored_baste
        .filter(elem => elem.type=="bazen" || elem.type =="fontana").length;

      this.firmaServis.dodajZakazivanje(this.novoZakazivanje).subscribe((resp:any)=>{

        this.openSnackBar(resp['message'])
      })

    } else {
      this.openSnackBar("Forma nije validna! Proverite da li ste popunili sve podatke.")
    }
  }

  onSelectionChange(event: MatSelectChange) {
    this.tipBaste = event.value;
  }

  get validanPrviKorak() {
    return this.prviKorakForma.valid;
  }

  get validanDrugiKorakRest(){
    return this.formaRestoran.valid;
  }

  get validanDrugiKorakPriv(){
    return this.formaKucnaBasta.valid;
  }


  /*------------------- raspored  baste -------------------------------*/

  elementiBaste: any[] = [];
  canvas : any;
  canvasH : number = 0;
  canvasW : number = 0;
  ctx : any;

  onClickCheck(){
    this.cdr.detectChanges();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.elementiBaste = JSON.parse(e.target.result).elements;
          this.nacrtajBastu();
          this.novoZakazivanje.raspored_baste = this.elementiBaste;
          // Ručno pokrećemo proveru promena da bi se omogucio prelazak na sl step..
          // ne mozes da predjes na sl korak dok ne dodas raspored..
          this.cdr.detectChanges();
        } catch (error) {
          this.openSnackBar(`Nije dobar JSON fajl....Error: ${error}`);
        }
      };
      reader.readAsText(file);
    }
  }

  inicijalizujKanvas(){
    this.canvas = document.getElementById('mojCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    const scale = 2;
    this.canvas.width = this.canvas.clientWidth * scale;
    this.canvas.height = this.canvas.clientHeight * scale;
    if(this.ctx){
      this.ctx.scale(scale, scale);
    }

  }

  nacrtajBastu(): void {

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.elementiBaste.forEach(element => {
      this.ctx.fillStyle = element.color;
      if (element.type === 'zelenilo' || element.type === 'bazen' || element.type === 'stolica' || element.type == 'lezaljka') {
        this.nacrtajPravougaonik(element.x, element.y, element.width, element.height, element.type);
      } else if (element.type === 'fontana' || element.type === 'sto') {
        this.nacrtajKrug(element.x, element.y, element.radius, element.type);
      }
    });
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

  izabraniOblik : string =""

  nacrtaniOblici : ElemBaste[] = [];

  onCanvasClick(event: MouseEvent) {

    if (this.izabraniOblik=='') return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    switch (this.izabraniOblik) {
      case 'zelenilo':
        let zelenilo = new PravougaonikElem(x-ZELENILO_W/2, y-ZELENILO_H/2, ZELENILO_W, ZELENILO_H, 'zelenilo');
        if(this.isOverlapping(zelenilo)){
          this.openSnackBar('Oblici ne smeju da se preklapaju!')
          return;
        }
        this.nacrtajPravougaonik(zelenilo.x, zelenilo.y, zelenilo.width, zelenilo.height, zelenilo.type);
        this.nacrtaniOblici.push(zelenilo);
        let elem = { "type": 'zelenilo', "x": zelenilo.x, "y": zelenilo.y, "width": zelenilo.width, "height": zelenilo.height };


        this.elementiBaste.push(elem);
        break;

      case 'bazenH':
      case 'bazenV':
        let bazen;
        if(this.izabraniOblik=='bazenH'){
          bazen = new PravougaonikElem(x-BAZEN_W/2, y-BAZEN_H/2, BAZEN_W, BAZEN_H, 'bazen');
        }else{
          bazen = new PravougaonikElem(x-BAZEN_H/2, y-BAZEN_W/2, BAZEN_H, BAZEN_W , 'bazen');
        }

        if(this.isOverlapping(bazen)){
          this.openSnackBar('Oblici ne smeju da se preklapaju!')
          return;
        }
        this.nacrtajPravougaonik(bazen.x, bazen.y, bazen.width, bazen.height, bazen.type);
        this.elementiBaste.push({ "type": bazen.type, "x": bazen.x, "y": bazen.y, "width": bazen.width, "height": bazen.height });
        this.nacrtaniOblici.push(bazen);
        break;

      case 'stolicaH':
      case 'stolicaV':
        let stolica;
        if(this.izabraniOblik=='stolicaH'){
          stolica = new PravougaonikElem(x-STOLICA_W/2, y-STOLICA_H/2, STOLICA_W, STOLICA_H, 'stolica')
        }else{
          stolica = new PravougaonikElem(x-STOLICA_H/2, y-STOLICA_W/2, STOLICA_H, STOLICA_W, 'stolica')
        }

        if(this.isOverlapping(stolica)){
          this.openSnackBar('Oblici ne smeju da se preklapaju!')
          return;
        }
        this.nacrtajPravougaonik(stolica.x, stolica.y, stolica.width, stolica.height, stolica.type);
        this.elementiBaste.push({ "type": stolica.type, "x": stolica.x, "y": stolica.y, "width": stolica.width, "height": stolica.height });
        this.nacrtaniOblici.push(stolica);
        break;

      case 'fontana':
        let fontana = new KrugELem(x, y, FONTANA_R, 'fontana');
        if(this.isOverlapping(fontana)){
          this.openSnackBar('Oblici ne smeju da se preklapaju!')
          return;
        }
        this.nacrtajKrug(fontana.x, fontana.y, fontana.radius, fontana.type);
        this.elementiBaste.push({ "type": fontana.type, "x": fontana.x, "y": fontana.y, "radius": fontana.radius });
        this.nacrtaniOblici.push(fontana);
        break;
      case 'sto':
        let sto = new KrugELem(x, y, STO_R, 'sto');
        if(this.isOverlapping(sto)){
          this.openSnackBar('Oblici ne smeju da se preklapaju!')
          return;
        }
        this.nacrtajKrug(sto.x, sto.y, sto.radius, sto.type);
        this.elementiBaste.push({ "type": sto.type, "x": sto.x, "y": sto.y, "radius": sto.radius });
        this.nacrtaniOblici.push(sto);
        break;
      default:
        break;
    }
  }

  isOverlapping(e: ElemBaste): boolean {

    let preklapanje : boolean = false;
    for (let i = 0; i < this.nacrtaniOblici.length; i++) {
      const elem = this.nacrtaniOblici[i];

      if (elem.isOverlaping(e) || e.isOverlaping(elem)) {
        preklapanje = true;
        break;  // Prekida petlju čim se pronađe preklapanje
      }
    }
    return preklapanje;
  }

  ocistiKanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.elementiBaste.length = 0; //brisem sve elem iz niza..
    this.nacrtaniOblici.length = 0;
  }

  ukloniPoslednjeg(){

    this.elementiBaste.pop()
    let elem = this.nacrtaniOblici.pop()
    this.ctx.fillStyle = '#FFFFFF'; // Boja pozadine
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1; // Debljina ivice
    if(elem && elem instanceof KrugELem){
      this.ctx.beginPath();
      this.ctx.arc(elem.x, elem.y, elem.radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    }else if(elem && elem instanceof PravougaonikElem){
      this.ctx.clearRect(elem.x, elem.y, elem.width, elem.height);
      this.ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
    }
  }


}
