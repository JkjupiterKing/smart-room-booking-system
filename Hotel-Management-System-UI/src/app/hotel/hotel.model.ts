import { Location } from '../location/location.model';

export interface Hotel {
  id?: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  location: Location;
  longitude?: number;
  latitude?: number;
}
