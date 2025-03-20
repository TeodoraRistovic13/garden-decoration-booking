import KorisnikModel from './models/user';

export const getFreeDecorators = (id_firme: number, datum: Date) => {
    const datumB = new Date(datum.getTime() + 24 * 60 * 60 * 1000); // Datum B je jedan dan nakon datuma

    return KorisnikModel.aggregate([
        {
            $match: {
                id_firme: id_firme,
                tip: "dekorater"
            }
        },
        {
            $lookup: {
                from: "zakazivanja",
                localField: "kor_ime",
                foreignField: "kor_ime_dekoratera",
                as: "zakazivanja"
            }
        },
        {
            $addFields: {
                hasConflictingBookings: {
                    $anyElementTrue: {
                        $map: {
                            input: "$zakazivanja",
                            as: "zakazivanje",
                            in: {
                                $and: [
                                    { $eq: ["$$zakazivanje.status", 'potvrdjeno'] },
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    { $lt: [datum, "$$zakazivanje.datum_izrade"] },   // A < C
                                                    { $gt: [datumB, "$$zakazivanje.datum_izrade"] }  // B > C
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { $gt: [datum, "$$zakazivanje.datum_izrade"] },  // A > C
                                                    { $lt: [datumB, "$$zakazivanje.datum_zavrsetka"] } // B < D
                                                ]
                                            },
                                            {
                                                $and: [
                                                    { $lt: [datum, "$$zakazivanje.datum_zavrsetka"] }, // A < D
                                                    { $gt: [datumB, "$$zakazivanje.datum_zavrsetka"] } // B > D
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $match: {
                hasConflictingBookings: false
            }
        },
        {
            $project: {
                kor_ime: 1,
                ime: 1,
                prezime: 1
            }
        }
    ]);
};
