import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Wind, 
  Thermometer, 
  Droplets, 
  Trash2, 
  ArrowRight, 
  Recycle,
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  Activity,
  Sprout
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { AppView, SensorData, WasteType, WasteLog, AIAnalysis } from './types';
import { analyzeCompostStatus } from './services/geminiService';
import { SensorCard } from './components/SensorCard';
import { Navigation } from './components/Navigation';

// --- Components defined inline for file efficiency, normally separated ---

const Onboarding = ({ onComplete }: { onComplete: () => void }) => (
  <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
    <div className="z-10 flex flex-col items-center text-center max-w-md">
      <div className="bg-emerald-500/20 p-6 rounded-full mb-8 animate-pulse">
        <Leaf size={64} className="text-emerald-300" />
      </div>
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Waste-to-SoAiI</h1>
      <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
        Ubah sampah organik menjadi pupuk adaptif iklim dengan kecerdasan buatan dan teknologi IoT.
      </p>
      <button 
        onClick={onComplete}
        className="group bg-white text-emerald-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-emerald-50 transition-all flex items-center gap-2"
      >
        Mulai Sekarang
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// --- Mock Data Generators ---
const generateSensorData = (): SensorData => ({
  temperature: 42 + Math.random() * 5,
  humidity: 55 + Math.random() * 10,
  phLevel: 6.5 + Math.random() * 0.5 - 0.25,
  methane: 150 + Math.random() * 20,
  timestamp: Date.now()
});

const mockHistoryData = Array.from({ length: 7 }, (_, i) => ({
  day: `H-${6-i}`,
  suhu: 35 + i * 2 + Math.random() * 2,
  kelembaban: 60 - i + Math.random() * 5
}));

const wasteDistribution = [
  { name: 'Sayuran', value: 45, color: '#10B981' },
  { name: 'Buah', value: 30, color: '#F59E0B' },
  { name: 'Daun', value: 15, color: '#8B5CF6' },
  { name: 'Lainnya', value: 10, color: '#64748B' },
];

export default function App() {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [sensorData, setSensorData] = useState<SensorData>(generateSensorData());
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Simulate Sensor Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(generateSensorData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initial AI Check
  useEffect(() => {
    if (view === AppView.DASHBOARD && !aiAnalysis) {
      handleAIAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeCompostStatus(sensorData, wasteLogs);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleAddWaste = (type: WasteType, weight: number) => {
    const newLog: WasteLog = {
      id: Date.now().toString(),
      type,
      weight,
      date: new Date().toLocaleDateString('id-ID')
    };
    setWasteLogs([newLog, ...wasteLogs]);
    setNotification("Data sampah berhasil dicatat!");
    setTimeout(() => setNotification(null), 3000);
    setView(AppView.DASHBOARD);
  };

  if (view === AppView.ONBOARDING) {
    return <Onboarding onComplete={() => setView(AppView.DASHBOARD)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800 font-sans">
      
      {/* Header */}
      <header className="bg-white px-6 py-4 sticky top-0 z-40 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Leaf className="text-emerald-600" size={20} />
          </div>
          <h1 className="font-bold text-xl text-emerald-900">SoAiI</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full text-xs font-medium text-blue-700">
            <CloudSun size={14} />
            <span>28°C Cerah</span>
          </div>
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0 border border-white"></div>
            <img 
              src="https://picsum.photos/100/100" 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-slate-200"
            />
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-emerald-800 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="p-6 max-w-lg mx-auto">
        
        {/* DASHBOARD VIEW */}
        {view === AppView.DASHBOARD && (
          <div className="space-y-6">
            
            {/* Hero AI Status */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-emerald-100 text-sm font-medium mb-1">Status Kompos</h2>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold">
                      {isAnalyzing ? "Menganalisis..." : aiAnalysis?.status || "Menunggu Data"}
                    </h3>
                    {!isAnalyzing && aiAnalysis?.status === 'Optimal' && <CheckCircle2 className="text-emerald-300" />}
                    {!isAnalyzing && aiAnalysis?.status === 'Warning' && <AlertTriangle className="text-amber-300" />}
                  </div>
                </div>
                <div onClick={handleAIAnalysis} className="bg-white/20 p-2 rounded-xl cursor-pointer hover:bg-white/30 transition-colors">
                  <Recycle className={`text-white ${isAnalyzing ? 'animate-spin' : ''}`} />
                </div>
              </div>
              
              <p className="text-emerald-50 text-sm leading-relaxed bg-black/10 p-3 rounded-xl backdrop-blur-sm">
                 {aiAnalysis?.summary || "Sistem sedang mengumpulkan data sensor untuk analisis awal..."}
              </p>

              <div className="mt-4 flex gap-3 text-xs font-medium">
                <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Thermometer size={12} />
                  {sensorData.temperature.toFixed(1)}°C
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Droplets size={12} />
                  {sensorData.humidity.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div>
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" />
                Monitoring Real-time
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <SensorCard 
                  title="Suhu" 
                  value={parseFloat(sensorData.temperature.toFixed(1))} 
                  unit="°C" 
                  icon={Thermometer} 
                  color="orange"
                  min={40}
                  max={60}
                  description="Ideal untuk fase termofilik"
                />
                <SensorCard 
                  title="Kelembaban" 
                  value={parseFloat(sensorData.humidity.toFixed(1))} 
                  unit="%" 
                  icon={Droplets} 
                  color="blue"
                  min={40}
                  max={60}
                  description="Jaga agar tetap lembab"
                />
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Progres Fermentasi</h3>
                <span className="text-xs text-slate-400">7 Hari Terakhir</span>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockHistoryData}>
                    <defs>
                      <linearGradient id="colorSuhu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      itemStyle={{color: '#065f46', fontSize: '12px', fontWeight: 'bold'}}
                    />
                    <Area type="monotone" dataKey="suhu" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuhu)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* MONITORING VIEW */}
        {view === AppView.MONITORING && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">IoT Sensors</h2>
                <p className="text-slate-500 text-sm">Terhubung ke Smart Bin #001</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md animate-pulse">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Live
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <SensorCard 
                  title="Temperatur Inti" 
                  value={parseFloat(sensorData.temperature.toFixed(1))} 
                  unit="°C" 
                  icon={Thermometer} 
                  color="orange"
                  min={40}
                  max={60}
                  description="Suhu tinggi menandakan aktivitas mikroba yang sehat."
                />
                <SensorCard 
                  title="Kelembaban Material" 
                  value={parseFloat(sensorData.humidity.toFixed(1))} 
                  unit="%" 
                  icon={Droplets} 
                  color="blue"
                  min={50}
                  max={70}
                  description="Jika <40%, tambahkan air. Jika >70%, tambahkan materi coklat."
                />
                 <SensorCard 
                  title="pH Level" 
                  value={parseFloat(sensorData.phLevel.toFixed(1))} 
                  unit="pH" 
                  icon={Leaf} 
                  color="purple"
                  min={6.0}
                  max={7.5}
                  description="pH netral mempercepat penguraian."
                />
                 <SensorCard 
                  title="Emisi Metana" 
                  value={Math.round(sensorData.methane)} 
                  unit="ppm" 
                  icon={Wind} 
                  color="emerald"
                  min={0}
                  max={200}
                  description="Indikator gas rumah kaca. Jaga serendah mungkin."
                />
            </div>
          </div>
        )}

        {/* INPUT VIEW */}
        {view === AppView.INPUT && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Input Sampah</h2>
              <p className="text-slate-500 text-sm">Catat sampah organik harianmu.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">Jenis Sampah</label>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[WasteType.VEGETABLE, WasteType.FRUIT, WasteType.LEAVES, WasteType.EGG_SHELL, WasteType.PAPER, WasteType.OTHER].map((type) => (
                  <button 
                    key={type}
                    onClick={() => {
                      // Simulating selection visually, usually managed by state
                      const btn = document.getElementById(`btn-${type}`);
                      if(btn) btn.classList.toggle('ring-2');
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all focus:ring-2 ring-emerald-500 focus:outline-none"
                  >
                    <div className="bg-slate-100 p-2 rounded-full mb-2">
                      <Trash2 size={20} className="text-slate-600" />
                    </div>
                    <span className="text-xs text-center font-medium text-slate-600">{type}</span>
                  </button>
                ))}
              </div>

              <label className="block text-sm font-medium text-slate-700 mb-3">Berat Estimasi (kg)</label>
              <div className="flex items-center gap-4 mb-8">
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1" 
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  id="weightInput"
                  defaultValue={1.5}
                  onChange={(e) => {
                     const val = document.getElementById('weightDisplay');
                     if(val) val.innerText = e.target.value + ' kg';
                  }}
                />
                <span id="weightDisplay" className="text-xl font-bold text-emerald-600 min-w-[3rem]">1.5 kg</span>
              </div>

              <button 
                onClick={() => handleAddWaste(WasteType.VEGETABLE, 1.5)}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Simpan Data
              </button>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl flex gap-3 border border-emerald-100">
              <div className="bg-white p-2 rounded-full h-fit">
                <Leaf size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Tip Eco-Friendly</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Potong sampah menjadi bagian kecil (2-5cm) untuk mempercepat proses fermentasi hingga 2x lipat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI OPTIMIZER VIEW */}
        {view === AppView.AI_OPTIMIZER && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">AI Advisor</h2>
                <p className="text-slate-500 text-sm">Analisis Cerdas & Adaptif Iklim</p>
              </div>
              <button 
                 onClick={handleAIAnalysis}
                 disabled={isAnalyzing}
                 className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100"
              >
                {isAnalyzing ? "Updating..." : "Refresh"}
              </button>
            </div>

            {/* Climate Context Card */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5 rounded-2xl text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <CloudSun size={20} />
                <span className="text-sm font-medium">Konteks Iklim Lokal</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Cuaca Panas & Lembab</h3>
              <p className="text-blue-50 text-xs opacity-90">
                Suhu lingkungan tinggi dapat mempercepat penguapan. AI menyesuaikan rekomendasi penyiraman.
              </p>
            </div>

            {/* AI Results */}
            {aiAnalysis ? (
              <div className="space-y-4">
                {/* Main Action Plan */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" />
                    Rekomendasi Tindakan
                  </h3>
                  <ul className="space-y-3">
                    {aiAnalysis.actionItems.map((item, idx) => (
                      <li key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                        <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prediction */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Estimasi Panen</p>
                    <p className="text-lg font-bold text-emerald-600">{aiAnalysis.estimatedCompletion}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 mb-1">Kualitas Prediksi</p>
                    <p className="text-lg font-bold text-emerald-600">Premium (A+)</p>
                  </div>
                </div>

                {/* Climate Adaptation Note */}
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                   <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
                     <AlertTriangle size={16} />
                     Adaptasi Perubahan Iklim
                   </h4>
                   <p className="text-xs text-orange-700 leading-relaxed">
                     {aiAnalysis.climateNote}
                   </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 border-dashed">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 text-sm">Tekan Refresh untuk analisis terbaru.</p>
              </div>
            )}
            
            {/* Composition Chart */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Komposisi Bahan</h3>
              <div className="h-48 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {wasteDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="space-y-2">
                    {wasteDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                        <span className="text-slate-600">{item.name}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation currentView={view} setView={setView} />
    </div>
  );
}