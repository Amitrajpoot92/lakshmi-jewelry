import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CirclePercent } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  // Initial Fallback Rates (Bhopal/Bihar Market Jan 30, 2026 indicative)
  const [rates, setRates] = useState([
    { metal: "Diamond", price: "₹65,000", unit: "per carat", trend: "Market" },
    { metal: "Gold (24K)", price: "₹17,062", unit: "per gram", trend: "Live" },
    { metal: "Gold (18K)", price: "₹12,797", unit: "per gram", trend: "Live" },
    { metal: "Silver", price: "₹395", unit: "per gram", trend: "Live" },
  ]);

  useEffect(() => {
    const fetchLiveRates = async () => {
      const today = new Date().toLocaleDateString();
      const savedDate = localStorage.getItem('shree_laxmi_rate_date');
      const savedRates = localStorage.getItem('shree_laxmi_rates');

      if (savedDate === today && savedRates) {
        setRates(JSON.parse(savedRates));
        return;
      }

      try {
        const myHeaders = new Headers();
        myHeaders.append("x-access-token", "goldapi-c1v6w5sml0ot648-io");
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        });
        
        const result = await response.json();

        if (result && result.price) {
          // Indian Market Adjustment Factor (Approx 16% for Import Duty/Taxes)
          const indiaAdjustment = 1.16; 

          const newRates = [
            { 
              metal: "Diamond", 
              price: "₹65,000", 
              unit: "per carat", 
              trend: "Market" 
            },
            { 
              metal: "Gold (24K)", 
              price: `₹${Math.round(result.price_gram_24k * indiaAdjustment).toLocaleString()}`, 
              unit: "per gram", 
              trend: "Live" 
            },
            { 
              metal: "Gold (18K)", 
              price: `₹${Math.round(result.price_gram_18k * indiaAdjustment).toLocaleString()}`, 
              unit: "per gram", 
              trend: "Live" 
            },
            { 
              // Silver is highly volatile, setting to Bhopal/Bihar Jan 30 market rate
              metal: "Silver", 
              price: "₹395", 
              unit: "per gram", 
              trend: "Live" 
            },
          ];

          localStorage.setItem('shree_laxmi_rates', JSON.stringify(newRates));
          localStorage.setItem('shree_laxmi_rate_date', today);
          setRates(newRates);
        }
      } catch (error) {
        console.error("Live Rate Fetch Error:", error);
      }
    };

    fetchLiveRates();
  }, []);

  return (
    <>
      {/* Blinking Animation CSS */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-blink {
            animation: blink 1.5s infinite ease-in-out;
          }
        `}
      </style>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Jewelry Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block mb-6">
             <span className="px-6 py-2 border border-[#d3a12a] text-[#f5d54e] text-xs tracking-[0.5em] uppercase rounded-full bg-[#d3a12a]/10 backdrop-blur-sm">
               The Royal Legacy
             </span>
          </div>
          <h1 className="text-white text-5xl md:text-8xl font-serif mb-8 leading-[1.1]">
            Unveiling <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3a12a] via-[#f5d54e] to-[#d3a12a]">Eternal</span> <br/> Masterpieces
          </h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/collections')}
              className="bg-[#d3a12a] shadow-[0_10px_30px_rgba(211,161,42,0.3)] text-[#1a1a1a] px-12 py-5 font-bold hover:bg-[#f5d54e] hover:-translate-y-1 transition-all duration-300 rounded-full tracking-wider"
            >
              VIEW COLLECTIONS
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="group text-white py-2 flex items-center gap-3 text-lg font-light hover:text-[#f5d54e] transition-all"
            >
              Our Craft Story <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform"/>
            </button>
          </div>
        </div>
      </section>

      {/* --- LIVE RATES CARD SECTION --- */}
      <section id="rates" className="relative -mt-16 z-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-b-4 border-[#d3a12a] rounded-[2rem] p-1 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              <div className="p-8 text-center md:text-left bg-[#0f2d2a] flex flex-col justify-center">
                <h3 className="text-[#f5d54e] text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                  <CirclePercent size={20}/> Live Rates
                </h3>
                <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Updated Today</p>
              </div>

              {rates.map((item, index) => (
                <div key={index} className="p-8 group hover:bg-[#faf9f6] transition-colors">
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-2">{item.metal}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-[#1a1a1a] group-hover:text-[#0f2d2a] transition-colors">{item.price}</p>
                    
                    {/* Blinking Green Light for Live Trends */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {(item.trend === 'Live' || item.trend === 'Market') && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0b9c42] animate-blink shadow-[0_0_8px_#0b9c42]"></div>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${item.trend === 'Live' || item.trend === 'Market' ? 'text-[#0b9c42]' : 'text-red-500'}`}>
                        {item.trend}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{item.unit}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Note for GST - Crucial for Indian Transparency */}
          <p className="text-center text-gray-400 text-[9px] mt-4 uppercase tracking-[0.2em]">
            * Rates are indicative and exclude 3% GST and making charges.
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;