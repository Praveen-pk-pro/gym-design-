import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ChevronRight, 
  Dumbbell, 
  Zap, 
  Timer, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook,
  Quote,
  Star,
  Activity,
  Trophy,
  Focus
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// --- Gallery Data ---
const GALLERY = [
  { title: "Power Lifting", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", icon: <Trophy/> },
  { title: "Functional Flow", image: "https://images.unsplash.com/photo-1541534741688-6078c64b52d3?q=80&w=2070&auto=format&fit=crop", icon: <Activity/> },
  { title: "Hypertrophy", image: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=2070&auto=format&fit=crop", icon: <Dumbbell/> },
  { title: "Mental Focus", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop", icon: <Focus/> },
  { title: "Endurance", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1974&auto=format&fit=crop", icon: <Zap/> },
];

// --- Review Data ---
const REVIEWS = [
  {
    name: "Arul Mozhi varman",
    review: "This gym is absolutely fantastic! From the moment you walk in, the atmosphere is buzzing with energy. The equipment is top-notch, always clean and well-maintained.",
    meta: "17 reviews · 2 photos",
    rating: 5
  },
  {
    name: "harsavardhan kadhir",
    review: "One of the best gyms in Gandhipuram. The atmosphere is exorbitant. The trainers are very friendly, especially Mr Ajith who is a gem in this gym.",
    meta: "5 reviews · 8 photos",
    rating: 5
  },
  {
    name: "Anush A",
    review: "Well equipped equipments. Very neat and clean gym. Trainers are very professional, especially go for training with Mr. Babu.",
    meta: "4 reviews · 4 photos",
    rating: 5
  },
  {
    name: "Kavi Raja",
    review: "Nalla gym superb environment. Trainers are also good, sema relaxing place with good ambience. Loved to be the part here.",
    meta: "4 reviews",
    rating: 5
  },
  {
    name: "Mehulesh R S",
    review: "The gym is spacious and can do all the workouts without any disturbance. There are advanced equipments also.",
    meta: "8 reviews · 1 photo",
    rating: 5
  }
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const assembledTextRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const galleryTriggerRef = useRef<HTMLDivElement>(null);
  const galleryListRef = useRef<HTMLDivElement>(null);

  // Initialize smooth scroll and GSAP animations
  useEffect(() => {
    const lenis = new Lenis();
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 1. Target Elements
    const chars = assembledTextRef.current?.querySelectorAll('.char');
    const video = videoRef.current;
    
    if (chars && video) {
      const initAnimations = () => {
        // --- STAGE 1: Appearance on Page Load (Assemble) ---
        // First, hide all chars randomly
        gsap.set(chars, {
          x: () => Math.random() * 2000 - 1000,
          y: () => Math.random() * 2000 - 1000,
          z: () => Math.random() * 1000,
          rotation: () => Math.random() * 720 - 360,
          opacity: 0,
          filter: "blur(20px)"
        });

        // Entrance Timeline
        const entranceTl = gsap.timeline({
          onComplete: () => {
            // --- STAGE 2 & 3: Disappearance on Scroll (Shatter) ---
            // Only create the ScrollTrigger AFTER the entrance finishes 
            // for the cleanest "Assembled First" experience
            const scrollTl = gsap.timeline({
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1.5,
                pin: true,
                anticipatePin: 1,
              }
            });

            // Sync Video Time (Scrubbing)
            scrollTl.to(video, {
              currentTime: video.duration || 5,
              ease: "none"
            }, 0);

            // Shatter Text
            scrollTl.to(chars, {
              x: () => Math.random() * 2000 - 1000,
              y: () => Math.random() * 2000 - 1000,
              z: () => Math.random() * 1000,
              rotation: () => Math.random() * 720 - 360,
              opacity: 0,
              filter: "blur(20px)",
              ease: "power2.inOut"
            }, 0);

            // Fade out Hero Elements (Metadata and Buttons)
            if (heroContentRef.current) {
              const otherElements = heroContentRef.current.querySelectorAll('p, div, span:not(.char)');
              scrollTl.to(otherElements, {
                opacity: 0,
                y: -100,
                filter: "blur(10px)",
                ease: "power1.in"
              }, 0);
            }
          }
        });

        // The actual Entrance Assembly
        entranceTl.to(chars, {
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 2,
          stagger: {
            amount: 0.8,
            from: "random"
          },
          ease: "power4.out"
        });

        // Ensure buttons and tagline start visible after a short delay
        if (heroContentRef.current) {
          const otherElements = heroContentRef.current.querySelectorAll('p, div, span:not(.char)');
          gsap.fromTo(otherElements, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.5, delay: 1, ease: "power3.out" }
          );
        }
      };

      if (video.readyState >= 1) {
        initAnimations();
      } else {
        video.addEventListener('loadedmetadata', initAnimations, { once: true });
      }
    }

    // Video Parallax (keeping a subtle scale instead of Y since we are pinned now)
    gsap.to(videoRef.current, {
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Horizontal Scroll Gallery
    if (galleryTriggerRef.current && galleryListRef.current) {
      const scrollWidth = galleryListRef.current.scrollWidth - window.innerWidth;
      gsap.to(galleryListRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: galleryTriggerRef.current,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });
    }

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Background Hero Video */}
      <div 
        ref={heroRef}
        className="relative h-[150vh] w-full overflow-hidden"
      >
        <div className="absolute inset-0 z-0 h-full w-full">
          <video
            ref={videoRef}
            muted
            playsInline
            className="h-full w-full object-cover grayscale opacity-60"
            referrerPolicy="no-referrer"
          >
            {/* The video will be scrubbed by GSAP based on scroll position */}
            <source src="https://static.videezy.com/system/resources/previews/000/033/140/original/Bodybuilder_Muscle_Flexing.mp4" type="video/mp4" />
          </video>
          {/* Enhanced Gradients for Video Scrubbing depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg z-10 opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg z-10 opacity-50" />
        </div>

        {/* Hero Content - Sticky Position during scroll */}
        <div ref={heroContentRef} className="sticky top-0 h-screen flex flex-col items-center justify-center z-20 px-4">
          <div 
            ref={assembledTextRef}
            className="flex flex-col items-center select-none pointer-events-none"
            style={{ perspective: '1000px' }}
          >
            <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-6">Gandhipuram, Coimbatore</span>
            <h1 className="text-6xl md:text-[12vw] font-display uppercase leading-[0.8] flex justify-center gap-[0.2em] overflow-visible">
              {"APEX".split("").map((c, i) => (
                <span key={i} className="char inline-block">{c}</span>
              ))}
            </h1>
            <h1 className="text-6xl md:text-[12vw] font-display uppercase leading-[0.8] flex justify-center gap-[0.2em] overflow-visible">
               {"FITNESS".split("").map((c, i) => (
                <span key={i} className="char inline-block">{c}</span>
              ))}
            </h1>
            <p className="mt-8 text-white/50 font-sans max-w-md text-center text-sm md:text-base leading-relaxed">
              SURPASS YOUR LIMITS IN COIMBATORE'S ELITE TRAINING HUB. 
              ENGINEERED FOR PERFORMANCE.
            </p>
          </div>
          
          <div className="mt-12 flex gap-4">
            <button className="bg-accent text-black px-8 py-4 font-bold uppercase tracking-tighter hover:bg-white transition-colors flex items-center gap-2 group">
              Start Trial <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 bg-white/5 px-8 py-4 font-bold uppercase tracking-tighter hover:bg-white/10 transition-colors">
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Stats Ticker */}
      <section className="py-20 bg-bg relative z-30 overflow-hidden border-y border-white/10">
        <div className="flex animate-marquee whitespace-nowrap gap-20">
          {[1,2,3,4].map((i) => (
            <div key={i} className="flex gap-20 items-center">
              <span className="text-4xl font-display uppercase text-stroke">Imported Equipment</span>
              <span className="w-4 h-4 bg-accent rotate-45" />
              <span className="text-4xl font-display uppercase">24/7 Access</span>
              <span className="w-4 h-4 bg-accent rotate-45" />
              <span className="text-4xl font-display uppercase text-stroke">Expert Trainers</span>
              <span className="w-4 h-4 bg-accent rotate-45" />
              <span className="text-4xl font-display uppercase">Elite Atmosphere</span>
               <span className="w-4 h-4 bg-accent rotate-45" />
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-30 bg-bg py-32 space-y-40">
        
        {/* Why Apex */}
        <section className="px-4 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent font-mono uppercase tracking-widest text-sm mb-4 block">Engineered Excellence</span>
            <h2 className="text-5xl md:text-7xl font-display uppercase mb-8 leading-none">Why Choose <br/><span className="text-accent">Mathi Fitness?</span></h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
              Located in the heart of Gandhipuram, our facility combines cutting-edge 
              biomechanics with an industrial, high-energy aesthetic. We don't just provide a space; 
              we provide the atmosphere that demands progress.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: <Zap className="w-5 h-5" />, title: "Zero Waiting", desc: "Optimized floor layout" },
                { icon: <Timer className="w-5 h-5" />, title: "24/7 Energy", desc: "Train when you want" },
                { icon: <Dumbbell className="w-5 h-5" />, title: "Pro Gear", desc: "Hammer Strength & Life Fitness" },
                { icon: <Quote className="w-5 h-5" />, title: "Top Coaching", desc: "Experts like Mr. Ajith" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {item.icon}
                  </div>
                  <h4 className="font-bold uppercase tracking-tight">{item.title}</h4>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square md:aspect-video overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
              alt="Gym Interior"
              className="w-full h-full object-cover filter grayscale h-full hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border-[20px] border-bg" />
            <div className="absolute bottom-10 -left-10 glass p-8 max-w-xs hidden md:block">
              <p className="text-xl font-display uppercase italic">"The equipment here is a gem."</p>
              <p className="text-xs mt-2 text-white/50">- Harsavardhan Kadhir</p>
            </div>
          </div>
        </section>

        {/* Workout Gallery (Horizontal Scroll) */}
        <section ref={galleryTriggerRef} className="h-screen overflow-hidden bg-[#0a0a0a]">
          <div className="h-full flex items-center px-4 md:px-20">
            <div className="w-1/3 flex flex-col justify-center pr-20">
              <span className="text-accent font-mono uppercase tracking-[0.3em] text-xs mb-4 block">The Lab</span>
              <h2 className="text-5xl md:text-8xl font-display uppercase leading-tight mb-6">Workout <br/>Gallery</h2>
              <p className="text-white/40 text-sm max-w-xs uppercase tracking-widest font-mono">
                Scroll to explore our diverse range of <span className="text-white">high-performance</span> training methodologies.
              </p>
            </div>
            <div 
              ref={galleryListRef}
              className="flex gap-10 pl-10"
            >
              {GALLERY.map((item, idx) => (
                <div key={idx} className="relative group w-[300px] md:w-[600px] h-[400px] md:h-[600px] flex-shrink-0 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-10 left-10 text-left">
                    <div className="w-12 h-12 glass flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-black transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-display uppercase">{item.title}</h3>
                    <p className="text-accent text-[10px] uppercase font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Methodology 0{idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Speaks */}
        <section className="px-4 md:px-20 ">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-accent font-mono uppercase tracking-widest text-sm mb-4 block">Voices of Performance</span>
              <h2 className="text-5xl md:text-7xl font-display uppercase leading-none">The Community <br/>Speaks</h2>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors rounded-full">←</button>
              <button className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors rounded-full">→</button>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-8 no-scrollbar pb-10">
            {REVIEWS.map((rev, idx) => (
              <div key={idx} className="min-w-[300px] md:min-w-[450px] glass p-10 flex flex-col justify-between group hover:border-accent/40 transition-colors">
                <div className="space-y-6">
                  <div className="flex gap-1 text-accent">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xl md:text-2xl font-light leading-relaxed italic text-white/90">
                    "{rev.review}"
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-accent">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm uppercase tracking-widest">{rev.name}</h5>
                    <p className="text-[10px] text-white/40 uppercase font-mono">{rev.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing/Memberships */}
        <section className="px-4 md:px-20 py-20 border-t border-white/10">
           <div className="text-center mb-20">
            <h2 className="text-5xl md:text-8xl font-display uppercase">Choose Your <span className="text-accent">Level</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: "Pro", price: "2499", features: ["Full Access", "Locker Room", "Standard Plan"] },
               { name: "Elite", price: "4999", features: ["Full Access", "Personal Trainer", "Diet Plan", "Sauna"] },
               { name: "Legend", price: "8999", features: ["24/7 VIP Access", "Master Coach Babu", "Supplement Kit", "Recovery Lab"] },
             ].map((plan, idx) => (
               <div key={idx} className={`glass p-10 flex flex-col items-center text-center ${idx === 1 ? 'border-accent shadow-[0_0_50px_rgba(225,255,0,0.1)] scale-105' : ''}`}>
                 <h3 className="text-2xl font-display uppercase mb-2">{plan.name}</h3>
                 <div className="text-4xl font-display mb-8">₹{plan.price}<span className="text-xs opacity-40">/MO</span></div>
                 <ul className="space-y-4 mb-12 flex-1">
                   {plan.features.map((f, i) => <li key={i} className="text-sm text-white/50 uppercase tracking-widest">{f}</li>)}
                 </ul>
                 <button className={`w-full py-4 font-bold uppercase tracking-widest transition-colors ${idx === 1 ? 'bg-accent text-black' : 'border border-white/20 hover:bg-white/5'}`}>
                   Select Plan
                 </button>
               </div>
             ))}
          </div>
        </section>
      </main>

      {/* Footer / Contact */}
      <footer className="relative z-30 pt-40 pb-10 px-4 md:px-20 bg-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-40">
          <div>
            <h2 className="text-6xl md:text-9xl font-display uppercase leading-none mb-10">Get In <br/>The <span className="text-accent italic">Zone</span></h2>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <MapPin className="text-accent" />
                <p className="text-white/60">Gandhipuram Cross Cut Road, Coimbatore</p>
              </div>
              <div className="flex items-center gap-6">
                <Phone className="text-accent" />
                <p className="text-white/60">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex gap-6 mt-12">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-accent hover:text-black transition-colors cursor-pointer"><Instagram size={20}/></div>
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-accent hover:text-black transition-colors cursor-pointer"><Facebook size={20}/></div>
            </div>
          </div>
          
          <div className="glass p-10 md:p-20">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono text-white/40">Full Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-accent outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono text-white/40">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-accent outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-mono text-white/40">Movement Goal</label>
                <select className="w-full bg-transparent border-b border-white/20 py-2 focus:border-accent outline-none transition-colors appearance-none text-white/60">
                  <option className="bg-bg">Hypertrophy</option>
                  <option className="bg-bg">Fat Loss</option>
                  <option className="bg-bg">Powerlifting</option>
                </select>
              </div>
              <button className="w-full bg-accent text-black font-bold uppercase py-6 tracking-widest hover:bg-white transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">© 2026 APEX PERFORMANCE LAB. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Credits</span>
          </div>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
