import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export default function EnquiryModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const messagesEndRef = useRef(null);
  
  const phoneNumber = "919008204464";

  // Scroll to bottom when step changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, isOpen]);

  if (!isOpen) return null;

  const handleQ1 = (answer) => {
    setQ1(answer);
    setStep(2);
  };

  const handleQ2 = (e) => {
    e.preventDefault();
    if (!q2.trim()) return;
    
    const message = encodeURIComponent(`Hello Route Cabs! I would like to enquire about: ${q1}. Additional details: ${q2}`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onClose();
    
    // Reset state after closing
    setTimeout(() => {
      setStep(1);
      setQ1('');
      setQ2('');
    }, 500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setQ1('');
      setQ2('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-[9999] animate-fade-in">
      <div className="bg-[#E5DDD5] w-full sm:max-w-sm h-[80vh] sm:h-[550px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl transform transition-all relative border border-slate-200">
        
        {/* Header */}
        <div className="px-4 py-3 bg-[#075E54] text-white flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide leading-tight">Route Cabs Support</h3>
              <p className="text-[10px] text-green-100 font-medium">Online</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Chat Background Pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none" 
          style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundSize: '400px' }}
        ></div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col z-10 scroll-smooth">
          
          {/* Bot Msg 1 */}
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-[15px] leading-relaxed relative">
              Hello! 👋 Welcome to Route Cabs. How can we help you today?
              <span className="absolute -left-2 top-0 w-4 h-4 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></span>
            </div>
          </div>

          {/* User Options for Q1 */}
          {step === 1 && (
            <div className="flex flex-col gap-2 items-end animate-fade-in mt-4">
              <button 
                onClick={() => handleQ1("Book a Cab")}
                className="bg-[#dcf8c6] text-slate-800 px-5 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-[15px] font-medium hover:bg-[#c9ebd3] transition-colors relative cursor-pointer"
              >
                Book a Cab
                <span className="absolute -right-2 top-0 w-4 h-4 bg-[#dcf8c6]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}></span>
              </button>
              <button 
                onClick={() => handleQ1("Attach Taxi / Driver Registration")}
                className="bg-[#dcf8c6] text-slate-800 px-5 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-[15px] font-medium hover:bg-[#c9ebd3] transition-colors relative cursor-pointer"
              >
                Attach Taxi
                <span className="absolute -right-2 top-0 w-4 h-4 bg-[#dcf8c6]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}></span>
              </button>
            </div>
          )}

          {/* User answered Q1 */}
          {step >= 2 && (
            <div className="flex justify-end animate-fade-in">
              <div className="bg-[#dcf8c6] text-slate-800 px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-[15px] relative">
                {q1}
                <span className="absolute -right-2 top-0 w-4 h-4 bg-[#dcf8c6]" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 0)' }}></span>
              </div>
            </div>
          )}

          {/* Bot Msg 2 */}
          {step >= 2 && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-[15px] leading-relaxed relative mt-4">
                Great! Could you please share your name and location?
                <span className="absolute -left-2 top-0 w-4 h-4 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="pb-2" />
        </div>

        {/* Input Area */}
        <div className="px-3 py-3 bg-[#f0f0f0] flex gap-2 items-center z-10 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
          {step === 1 ? (
             <div className="text-center w-full text-[13px] text-slate-500 py-2">Please tap an option above to continue</div>
          ) : (
            <form onSubmit={handleQ2} className="flex-1 flex gap-2">
              <input 
                autoFocus
                type="text" 
                value={q2} 
                onChange={e => setQ2(e.target.value)} 
                className="flex-1 px-4 py-3 rounded-full border-0 focus:ring-0 focus:outline-none text-[15px] shadow-sm bg-white text-slate-800" 
                placeholder="Enter your name & location..." 
              />
              <button 
                type="submit" 
                className={`${q2.trim() ? 'bg-[#00a884] hover:bg-[#008f6f]' : 'bg-slate-300 pointer-events-none'} text-white w-12 h-12 rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center shrink-0`}
                disabled={!q2.trim()}
              >
                <Send size={20} className="ml-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
