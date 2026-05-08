
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  features: string[];
  designPhilosophy: string;
  image: string;
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    make: 'Veridian',
    model: 'Aether',
    year: 2025,
    trim: 'Grand Touring',
    price: 125000,
    batteryRangeKm: 840,
    horsepower: 950,
    zeroToSixtySeconds: 2.1,
    features: ['Adaptive Air Suspension', 'Lidar Autonomy', 'Biometric Entry', 'Sustainability Weave Interior'],
    designPhilosophy: 'Ethereal aerodynamics meeting raw performance.',
    image: 'https://picsum.photos/seed/ev2/800/600',
  },
  {
    id: 'v2',
    make: 'Veridian',
    model: 'Lumina',
    year: 2024,
    trim: 'Pinnacle',
    price: 98000,
    batteryRangeKm: 650,
    horsepower: 680,
    zeroToSixtySeconds: 3.8,
    features: ['Panoramic Smart Glass', '7-Seat Modular Cabin', 'Off-road Active Mode', '4D Sound System'],
    designPhilosophy: 'Infinite light, boundless space.',
    image: 'https://picsum.photos/seed/ev3/800/600',
  },
  {
    id: 'v3',
    make: 'Noir',
    model: 'Spectre',
    year: 2025,
    trim: 'Black Edition',
    price: 210000,
    batteryRangeKm: 720,
    horsepower: 1200,
    zeroToSixtySeconds: 1.8,
    features: ['Tri-Motor Torque Vectoring', 'Carbon Monocoque', 'Active Aero Wings', 'Night Vision Assist'],
    designPhilosophy: 'Command the dark. Master the road.',
    image: 'https://picsum.photos/seed/ev4/800/600',
  },
  {
    id: 'v4',
    make: 'Veridian',
    model: 'Dawn',
    year: 2024,
    trim: 'Sport',
    price: 45000,
    batteryRangeKm: 350,
    horsepower: 180,
    zeroToSixtySeconds: 3.2,
    features: ['Quick Charge 3.0', 'ABS with Cornering Support', 'OLED Instrument Cluster', 'Regenerative Braking'],
    designPhilosophy: 'The future of two-wheeled performance.',
    image: 'https://picsum.photos/seed/ev5/800/600',
  },
  {
    id: 'v5',
    make: 'Swift',
    model: 'Scooty',
    year: 2024,
    trim: 'Urban',
    price: 12000,
    batteryRangeKm: 120,
    horsepower: 15,
    zeroToSixtySeconds: 8.5,
    features: ['Removable Battery', 'Under-seat Storage', 'Smart Phone Integration', 'LED Halo Ring'],
    designPhilosophy: 'Effortless urban mobility.',
    image: 'https://picsum.photos/seed/ev6/800/600',
  }
];
