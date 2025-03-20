export enum StatusZakazivanja {
  Kreirano = 'kreirano', //neobradjena
  Potvrdjeno = 'potvrdjeno', //obradjena prihvacen
  Odbijeno = 'odbijeno', //obradjena odbijena
  Otkazano = 'otkazano', //otkazana
  Zavrseno = 'zavrseno', //zavrsena
  Servisiranje = 'servisiranje',  //na servisiranju
  CekaMajstora = 'majstor'//poslat zahtev za servisiranje
};
