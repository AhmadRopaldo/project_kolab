import { GoogleGenAI } from "@google/genai";
import { SensorData, WasteLog, AIAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompostStatus = async (
  sensorData: SensorData,
  recentLogs: WasteLog[],
  weatherCondition: string = "Panas dan Lembab"
): Promise<AIAnalysis> => {
  
  const prompt = `
    Anda adalah ahli sistem IoT "Waste-to-SoAiI" (Smart Organic AI Integrator). 
    Tugas Anda adalah menganalisis kondisi pengomposan pupuk organik berdasarkan data sensor dan log sampah.
    
    Data Sensor Saat Ini:
    - Suhu: ${sensorData.temperature}°C (Optimal: 40-60°C untuk termofilik)
    - Kelembaban: ${sensorData.humidity}% (Optimal: 40-60%)
    - pH: ${sensorData.phLevel} (Optimal: 6.0-7.5)
    - Gas Metana: ${sensorData.methane} ppm
    
    Kondisi Cuaca/Iklim Luar: ${weatherCondition}
    
    Sampah Terakhir Masuk: ${recentLogs.length > 0 ? recentLogs[0].type + ' (' + recentLogs[0].weight + 'kg)' : 'Belum ada data'}
    
    Berikan analisis JSON dengan format berikut (JANGAN gunakan markdown block, hanya raw JSON):
    {
      "status": "Optimal" | "Warning" | "Critical",
      "summary": "Ringkasan kondisi singkat (maks 20 kata) dalam Bahasa Indonesia.",
      "actionItems": ["Langkah 1", "Langkah 2", "Langkah 3"],
      "climateNote": "Saran spesifik adaptasi perubahan iklim berdasarkan cuaca saat ini.",
      "estimatedCompletion": "Estimasi waktu panen (misal: 2 minggu lagi)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Fallback mock data if API fails or key is missing
    return {
      status: 'Warning',
      summary: 'Gagal terhubung ke AI, menggunakan analisis lokal dasar.',
      actionItems: ['Periksa koneksi internet', 'Cek kelembaban manual', 'Aduk kompos'],
      climateNote: 'Data iklim tidak tersedia.',
      estimatedCompletion: 'Tidak diketahui'
    };
  }
};