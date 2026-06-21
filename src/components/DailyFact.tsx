import { useEffect, useState } from 'react';
import { getDailyFact, QuizData } from '../services/geminiService';
import { Globe, RefreshCw, Calendar, Sparkles, CheckCircle, AlertCircle, Trophy, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function DailyFact() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionScore, setSessionScore] = useState<number>(() => {
    const saved = localStorage.getItem('eco_quiz_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showExplanation, setShowExplanation] = useState(false);

  const [date] = useState(new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }));

  const fetchFactAndQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    try {
      const data = await getDailyFact();
      setQuizData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactAndQuiz();
  }, []);

  const handleOptionClick = (option: string) => {
    if (isCorrect) return; // Prevent clicking after correct answer is found
    setSelectedOption(option);
    
    if (quizData && option === quizData.correctAnswer) {
      setIsCorrect(true);
      setShowExplanation(true);
      const newScore = sessionScore + 1;
      setSessionScore(newScore);
      localStorage.setItem('eco_quiz_score', newScore.toString());
      
      // Trigger dynamic confetti burst!
      triggerConfetti();
    } else {
      setIsCorrect(false);
    }
  };

  const triggerConfetti = () => {
    // 1st burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF00FF', '#00FFFF', '#00FF00', '#FFDE00', '#FF8F00', '#FF0000']
    });

    // 2nd delayed burst for extra excitement
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF00FF', '#00FFFF', '#00FF00']
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFDE00', '#FF8F00', '#FF0000']
      });
    }, 400);
  };

  const handleResetScore = () => {
    setSessionScore(0);
    localStorage.setItem('eco_quiz_score', '0');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* SCORE BOARD / TROPHY HEADER */}
      <div className="brutal-card bg-[#00FFFF] flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-300 p-2 brutal-border rounded-lg rotate-3">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">Your Score</span>
            <span className="text-xl font-black">{sessionScore} {sessionScore === 1 ? 'Quiz' : 'Quizzes'} Solved!</span>
          </div>
        </div>
        {sessionScore > 0 && (
          <button 
            onClick={handleResetScore}
            className="text-[10px] font-black uppercase underline hover:text-red-500 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* DAILY FACT BOX */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-card animate-rainbow text-white relative overflow-hidden"
      >
        <div className="absolute top-2 right-2 opacity-20">
          <Globe className="w-32 h-32 rotate-12 pointer-events-none" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-white drop-shadow-md" />
                <span className="text-sm font-black uppercase tracking-widest drop-shadow-md">Human World Fact</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase opacity-80">
                <Calendar className="w-3 h-3" />
                {date}
              </div>
            </div>
            <button 
              onClick={fetchFactAndQuiz}
              disabled={loading}
              className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
              title="Fetch new fact & quiz!"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-6 animate-pulse bg-white/30 rounded w-full" />
              <div className="h-6 animate-pulse bg-white/30 rounded w-3/4" />
            </div>
          ) : quizData ? (
            <p className="text-2xl sm:text-3xl font-black leading-tight italic drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              "{quizData.fact}"
            </p>
          ) : (
            <p className="text-xl font-bold">Failed to load fact. Click refresh to try again!</p>
          )}

          <div className="mt-8 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-tighter">Did you know?</span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* DAILY ECO-QUIZ BOX */}
      <AnimatePresence mode="wait">
        {!loading && quizData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ delay: 0.1 }}
            className="brutal-card bg-white border-black relative overflow-hidden"
          >
            {/* Rainbow border strip */}
            <div className="absolute top-0 left-0 w-full h-2 animate-rainbow" />

            <div className="flex items-center gap-2 mb-4 mt-1">
              <HelpCircle className="w-6 h-6 text-[#FF00FF]" />
              <h3 className="text-lg font-black uppercase text-black tracking-wide">
                Daily Eco-Quiz Challenge!
              </h3>
            </div>

            <p className="text-lg font-black text-black mb-6">
              {quizData.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {quizData.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isThisCorrect = option === quizData.correctAnswer;
                
                let btnStyle = "bg-white text-black hover:bg-gray-100";
                if (isSelected) {
                  if (isCorrect) {
                    btnStyle = "bg-[#00FF00] text-black scale-[1.02] border-black shadow-[4px_4px_0px_#000]";
                  } else {
                    btnStyle = "bg-red-500 text-white animate-shake border-black shadow-[4px_4px_0px_#000]";
                  }
                } else if (isCorrect && isThisCorrect) {
                  btnStyle = "bg-[#00FF00]/80 text-black";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={isCorrect === true}
                    className={`w-full text-left p-4 font-bold rounded-xl border-3 border-black text-sm sm:text-base justify-between flex items-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${btnStyle} ${!isCorrect ? 'active:translate-y-1 active:shadow-none' : ''} cursor-pointer`}
                  >
                    <span>{option}</span>
                    <div className="shrink-0 ml-2">
                      {isSelected && isCorrect && <CheckCircle className="w-5 h-5 text-black" />}
                      {isSelected && isCorrect === false && <AlertCircle className="w-5 h-5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanations & Alerts */}
            <AnimatePresence>
              {isCorrect === false && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-100 border-2 border-red-500 text-red-800 rounded-lg text-xs font-black uppercase text-center mb-4"
                >
                  ❌ Incorrect guess! Don't worry, read the fact and try another answer!
                </motion.div>
              )}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-green-100 border-3 border-green-500 text-green-900 rounded-xl relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 text-green-600 opacity-20">
                    <Sparkles className="w-12 h-12 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold uppercase text-sm mb-1 text-green-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-green-700 animate-bounce" />
                    Correct Answer! Awesome Job!
                  </h4>
                  <p className="text-sm font-bold text-green-950">
                    {quizData.explanation}
                  </p>

                  <button 
                    onClick={fetchFactAndQuiz}
                    className="mt-4 px-4 py-2 text-xs font-black uppercase bg-black text-white rounded brutal-border active:translate-y-[2px] active:shadow-none cursor-pointer hover:bg-green-700 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Next Fact & Quiz Challenge
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
