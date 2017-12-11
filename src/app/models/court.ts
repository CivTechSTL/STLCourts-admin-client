import {Judge} from './judge';

export class Court {
  id: string;
  name: string;
  phone: string;
  website: string;
  extension: string;
  address: string;
  paymentSystem: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  judges: Judge[];
  citationExpiresAfterDays: number;
}
