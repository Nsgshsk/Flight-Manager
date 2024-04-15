export interface Flight {
  id: number;
  departure_airport: string;
  arrival_airport: string;
  departure_datetime: Date;
  arrival_datetime: Date;
  plane: string | number;
  pilot_name: string;
  economy_seats: number;
  business_seats: number;
  first_seats: number;
}
