export interface Motorcycle {
  id: string;
  name: string;
  subtitle: string;
  engine: string;
  power: string;
  torque: string;
  maxSpeed: string;
  fuelConsumption: string;
  weight: string;
  maxLoad: string;
  dimensions: string;
  wheelbase: string;
  brakeType: string;
  fuelCapacity: string;
  starter: string;
  tires: string;
  containerQty: string;
  bore: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
}

export interface ContactInfo {
  phone: string;
  address: string;
  hours: string;
  email: string;
}