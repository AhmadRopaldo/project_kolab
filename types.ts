export enum WasteType {
  VEGETABLE = 'Sayuran',
  FRUIT = 'Buah-buahan',
  LEAVES = 'Dedaunan Kering',
  PAPER = 'Kertas/Kardus',
  EGG_SHELL = 'Cangkang Telur',
  OTHER = 'Lainnya'
}

export interface SensorData {
  temperature: number; // Celsius
  humidity: number; // %
  phLevel: number; // 0-14
  methane: number; // ppm
  timestamp: number;
}

export interface WasteLog {
  id: string;
  type: WasteType;
  weight: number; // kg
  date: string;
  notes?: string;
}

export interface AIAnalysis {
  status: 'Optimal' | 'Warning' | 'Critical';
  summary: string;
  actionItems: string[];
  climateNote: string;
  estimatedCompletion: string;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  MONITORING = 'MONITORING',
  INPUT = 'INPUT',
  AI_OPTIMIZER = 'AI_OPTIMIZER'
}