import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  constructor() { }

  async geocodeAddress(address: string): Promise<[number, number]> {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return [parseFloat(result.lat), parseFloat(result.lon)];
    } else {
      throw new Error('No results found for the provided address');
    }
  }
}
