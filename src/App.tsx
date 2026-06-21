import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DailyFact from './components/DailyFact';
import HackGenerator from './components/HackGenerator';
import RecyclingSorter from './components/RecyclingSorter';
import BackgroundStickers from './components/BackgroundStickers';
import { Hammer, Recycle, Zap, Sparkles, Search, Trophy } from 'lucide-react';

type Tab = 'hacks' | 'sorter' | 'facts';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('hacks');

  return (
    <div className="min-h-screen bg-[#FFDE00] pb-20 relative overflow-x-hidden">
      <BackgroundStickers />
      {/* Marquee Header */}
      <div className="animate-rainbow text-white py-3 overflow-hidden whitespace-nowrap border-b-4 border-black shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
        <div className="flex animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
              <Recycle className="w-5 h-5" />
              5-Minute Eco Hacks
              <Zap className="w-5 h-5 fill-yellow-300" />
              Recycle Everything
              <Sparkles className="w-5 h-5" />
            </span>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-12 space-y-12">
        {/* Hero Section */}
        <header className="space-y-4">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative inline-block"
          >
            <h1 className="text-7xl sm:text-9xl font-cursive leading-[1.2] tracking-normal rainbow-text drop-shadow-[4px_4px_0px_#000] py-4">
              EcoHack
            </h1>
            <div className="absolute -right-8 -bottom-4 animate-rainbow brutal-border px-6 py-2 rotate-6 font-black uppercase text-lg text-white shadow-xl">
              5-Min Crafts!
            </div>
          </motion.div>
        </header>

        {/* Three Options Navigation */}
        <div className="grid grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('hacks')}
            className={`brutal-btn flex flex-col items-center gap-2 py-6 transition-all ${activeTab === 'hacks' ? 'animate-rainbow text-white scale-105' : 'bg-white'}`}
          >
            <Hammer className="w-8 h-8" />
            <span className="text-xs sm:text-sm font-black">DIY HACKS</span>
          </button>
          <button 
            onClick={() => setActiveTab('sorter')}
            className={`brutal-btn flex flex-col items-center gap-2 py-6 transition-all ${activeTab === 'sorter' ? 'animate-rainbow text-white scale-105' : 'bg-white'}`}
          >
            <Search className="w-8 h-8" />
            <span className="text-xs sm:text-sm font-black">SORTER</span>
          </button>
          <button 
            onClick={() => setActiveTab('facts')}
            className={`brutal-btn flex flex-col items-center gap-2 py-6 transition-all ${activeTab === 'facts' ? 'animate-rainbow text-white scale-105' : 'bg-white'}`}
          >
            <Trophy className="w-8 h-8" />
            <span className="text-xs sm:text-sm font-black">DAILY QUIZ</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'hacks' && (
              <motion.div
                key="hacks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <HackGenerator />
              </motion.div>
            )}
            {activeTab === 'sorter' && (
              <motion.div
                key="sorter"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <RecyclingSorter />
              </motion.div>
            )}
            {activeTab === 'facts' && (
              <motion.div
                key="facts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto"
              >
                <DailyFact />
                <div className="mt-8 brutal-card bg-white">
                  <h3 className="font-black text-xl uppercase mb-4">Why Facts?</h3>
                  <p className="font-bold">Understanding our world is the first step to saving it. Every fact here is a reminder of how incredible our human world is!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t-4 border-black flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-cursive text-4xl rainbow-text drop-shadow-[2px_2px_0px_#000]">
            <Recycle className="w-8 h-8 text-black" />
            EcoHack
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-50">
            Powered by Gemini AI • 2026 Human World Edition
          </div>
        </footer>
      </main>
    </div>
  );
}
