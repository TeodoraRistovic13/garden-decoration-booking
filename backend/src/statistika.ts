import ZakazivanjeModel from './models/zakazivanje';

export const getJobsByMonthForDec = (kor_ime_dekoratera: string) => {
  return ZakazivanjeModel.aggregate([
    {
      $match: {
        kor_ime_dekoratera: kor_ime_dekoratera,
        datum_izrade: {
          $gte: new Date('2024-01-01T00:00:00Z'), // Možeš prilagoditi početni datum
          $lt: new Date('2025-01-01T00:00:00Z')   // Možeš prilagoditi krajnji datum
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$datum_izrade" },
          month: { $month: "$datum_izrade" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        count: 1
      }
    }
  ]).exec();
};



export const getJobsDistributionInCompany = (firmaNaziv: string) => {
  return ZakazivanjeModel.aggregate([
    {
      $match: {
        firma_naziv: firmaNaziv,  // Filtriranje po firmi
        kor_ime_dekoratera: { $ne: "" }
      }
    },
    {
      $group: {
        _id: "$kor_ime_dekoratera",  // Grupisanje po dekorateru
        count: { $sum: 1 }           // Brojanje poslova
      }
    },
    {
      $sort: { count: -1 }  // Sortiranje po broju poslova (opciono)
    },
    {
      $project: {
        _id: 0,
        dekorater: "$_id",
        count: 1
      }
    }
  ]).exec();
}


export const getAverageJobsByDayOfWeek = () => {
  return ZakazivanjeModel.aggregate([
    // Filtriraj poslove u poslednja 24 meseca
    {
      $match: {
        datum_izrade: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 24)), // Pre 24 meseca
          $lt: new Date() // Do sada
        }
      }
    },
    // Dodaj polje koje predstavlja dan u nedelji
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: "$datum_izrade" }
      }
    },
    // Grupisi podatke po danima u nedelji i mesecima
    {
      $group: {
        _id: {
          dayOfWeek: "$dayOfWeek",
          month: { $month: "$datum_izrade" }
        },
        count: { $sum: 1 } // Broj poslova za svaki dan u nedelji i mesec
      }
    },
    // Grupisi podatke po danima u nedelji i izračunaj prosečan broj poslova
    {
      $group: {
        _id: "$_id.dayOfWeek",
        averageCount: { $avg: "$count" } // Prosečan broj poslova
      }
    },
    // Sortiraj po danu u nedelji
    {
      $sort: { _id: 1 }
    },
    // Formatiraj rezultate
    {
      $project: {
        _id: 0,
        dayOfWeek: "$_id",
        averageCount: 1
      }
    }
  ]).exec();
};



const trenutniDatum = new Date();
const pre24Sata = new Date(trenutniDatum.getTime() - (24 * 60 * 60 * 1000));
const pre7Dana = new Date(trenutniDatum.getTime() - (7 * 24 * 60 * 60 * 1000));
const pre30Dana = new Date(trenutniDatum.getTime() - (30 * 24 * 60 * 60 * 1000));

export const getNumberOfNewJobs = () => {
  return ZakazivanjeModel.aggregate([
    {
      $facet: {
        "24Sata": [
          { $match: { datum_zavrsetka: { $gte: pre24Sata, $lte: trenutniDatum } } },
          { $count: "brojZakazivanja" }
        ],
        "7Dana": [
          { $match: { datum_zavrsetka: { $gte: pre7Dana, $lte: trenutniDatum } } },
          { $count: "brojZakazivanja" }
        ],
        "30Dana": [
          { $match: { datum_zavrsetka: { $gte: pre30Dana, $lte: trenutniDatum } } },
          { $count: "brojZakazivanja" }
        ]
      }
    },
    {
      $project: {
        Broj24Sata: { $ifNull: [{ $arrayElemAt: ["$24Sata.brojZakazivanja", 0] }, 0] },
        Broj7Dana: { $ifNull: [{ $arrayElemAt: ["$7Dana.brojZakazivanja", 0] }, 0] },
        Broj30Dana: { $ifNull: [{ $arrayElemAt: ["$30Dana.brojZakazivanja", 0] }, 0] }
      }
    }
  ]).exec();
};

