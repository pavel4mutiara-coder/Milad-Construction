/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  MessageSquare, 
  ShieldCheck, 
  Briefcase, 
  Mountain, 
  HardHat, 
  Languages, 
  ArrowRight,
  Menu,
  X,
  Warehouse,
  Construction,
  Layers,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onSnapshot, 
  doc, 
  collection, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  serverTimestamp 
} from './lib/firebase';

// --- Translations Data ---
const translations = {
  en: {
    nav: {
      home: 'Overview',
      services: 'Expertise',
      projects: 'Portfolio',
      about: 'Legacy',
      contact: 'Inquiry',
    },
    projects: {
      title: 'Our Portfolio',
      subtitle: 'Building the landmarks of tomorrow, today.',
      all: 'All Projects',
      roads: 'Roads',
      bridges: 'Bridges',
      buildings: 'Buildings',
      client: 'Client',
      location: 'Location',
      year: 'Year',
    },
    hero: {
      title: 'Building Excellence',
      subtitle: 'Premium construction solutions for roads, bridges, and infrastructure across Sylhet.',
      cta: 'Explore Projects',
    },
    services: {
      title: 'Expertise',
      subtitle: 'Constructing Foundations',
      sand: 'Sand Supply',
      stone: 'Stone Aggregate',
      brick: 'Premium Bricks',
      road: 'Road Networks',
      bridge: 'Advanced Bridges',
      building: 'Scale Buildings',
    },
    about: {
      title: 'A Vision for Modern Sylhet',
      owner: 'Md. Milad Ahmed',
      role: 'Proprietor',
      description1: 'Milad Construction stands as a pillar of reliability in the Sylhet construction sector, merging modern engineering with traditional values.',
      description2: 'We specialize in supplying high-grade materials and executing complex civil contracting projects with total integrity.',
    },
    contact: {
      title: 'Connect',
      address_title: 'Headquarters',
      address: 'Azadi 54/1, Lane 1, Mirboxtula, Sylhet, Bangladesh',
      license: 'Trade License: 1230005218',
      call: 'Hotline',
    },
    footer: {
      rights: 'All rights reserved.',
    }
  },
  bn: {
    nav: {
      home: 'সারসংক্ষেপ',
      services: 'দক্ষতা',
      projects: 'প্রকল্প',
      about: 'ঐতিহ্য',
      contact: 'অনুসন্ধান',
    },
    projects: {
      title: 'আমাদের প্রকল্পসমূহ',
      subtitle: 'আগামীকালের স্থাপত্য আজ নির্মাণ করছি।',
      all: 'সব প্রজেক্ট',
      roads: 'রাস্তা',
      bridges: 'সেতু',
      buildings: 'দালান',
      client: 'ক্লায়েন্ট',
      location: 'অবস্থান',
      year: 'বছর',
    },
    hero: {
      title: 'শ্রেষ্ঠত্বের নির্মাণ',
      subtitle: 'সিলেটজুড়ে রাস্তা, সেতু এবং গুরুত্বপূর্ণ অবকাঠামো নির্মাণে আমাদের নির্ভরযোগ্যতা।',
      cta: 'আমাদের প্রকল্প',
    },
    services: {
      title: 'বিশেষত্ব',
      subtitle: 'ভবিষ্যত নির্মাণে আমরা',
      sand: 'বালু সরবরাহ',
      stone: 'পাথর সরবরাহ',
      brick: 'উন্নত মানের ইট',
      road: 'রাস্তা নির্মাণ',
      bridge: 'সেতু নির্মাণ',
      building: 'দালান কোটা',
    },
    about: {
      title: 'আধুনিক সিলেটের জন্য এক অনন্য লক্ষ্য',
      owner: 'মোঃ মিলাদ আহমদ',
      role: 'স্বত্বাধিকারী',
      description1: 'সিলেটের নির্মাণ খাতে মিলাদ কান্সট্রাকশন একটি আস্থার নাম, যেখানে আধুনিক ইঞ্জিনিয়ারিং ও ঐতিহ্যবাহী মূল্যবোধের মেলবন্ধন ঘটে।',
      description2: 'আমরা উচ্চমানের নির্মাণ সামগ্রী সরবরাহ এবং জটিল সিভিল কন্ট্রাক্টিং প্রকল্প বাস্তবায়নে কাজ করে আসছি।',
    },
    contact: {
      title: 'যোগাযোগ',
      address_title: 'প্রধান কার্যালয়',
      address: 'আজাদী ৫৪/১, ১নং গলি, মিরবক্সটুলা, সিলেট, বাংলাদেশ',
      license: 'ট্রেড লাইসেন্স নম্বর: ১২৩০০০৫২১৮',
      call: 'হটলাইন',
    },
    footer: {
      rights: 'সর্বস্বত্ব সংরক্ষিত।',
    }
  }
};

const projectsData = [
  {
    id: 1,
    type: 'bridges',
    titleEn: 'Bridge Engineering',
    titleBn: 'সেতু প্রকৌশল',
    image: 'https://images.unsplash.com/photo-1545624446-4238bc35a78f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    type: 'roads',
    titleEn: 'Highway Construction',
    titleBn: 'মহাসড়ক নির্মাণ',
    image: 'https://images.unsplash.com/photo-1596435017004-949449ba3651?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    type: 'buildings',
    titleEn: 'Modern Architecture',
    titleBn: 'আধুনিক স্থাপত্য',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 4,
    type: 'bridges',
    titleEn: 'River Crossing Project',
    titleBn: 'নদী পারাপার প্রকল্প',
    image: 'https://images.unsplash.com/photo-1548678967-f1fa5d9eb27d?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 5,
    type: 'roads',
    titleEn: 'Urban Road Network',
    titleBn: 'নগর সড়ক নেটওয়ার্ক',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 6,
    type: 'buildings',
    titleEn: 'Industrial Structure',
    titleBn: 'শিল্প অবকাঠামো',
    image: 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1200'
  }
];

export default function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'roads' | 'bridges' | 'buildings'>('all');
  
  // Real-time Data State
  const [siteTranslations, setSiteTranslations] = useState(translations);
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const t = siteTranslations[lang];

  // Auth Listener
  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
    });
  }, []);

  // Firestore Listeners
  useEffect(() => {
    // 1. Translations
    const unsubSite = onSnapshot(doc(db, 'config', 'site'), (snap) => {
      if (snap.exists()) {
        setSiteTranslations(snap.data() as any);
      } else {
        // Seed if empty
        setDoc(doc(db, 'config', 'site'), {
          ...translations,
          heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=3000"
        });
      }
      setIsLoading(false);
    });

    // 2. Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const projs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (projs.length > 0) {
        setProjects(projs);
      } else {
        // Seed projects
        projectsData.forEach(p => {
          const { id, ...rest } = p;
          addDoc(collection(db, 'projects'), { ...rest, createdAt: serverTimestamp() });
        });
      }
    });

    return () => {
      unsubSite();
      unsubProjects();
    };
  }, []);

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-4 bg-amber-600 rounded-2xl shadow-2xl"
        >
          <Building2 size={48} className="text-white" />
        </motion.div>
        <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-black animate-pulse">Initializing Excellence</span>
      </div>
    );
  }

  return (
    <div lang={lang} className={`font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden w-full antialiased`}>
      {/* --- Sophisticated Navigation --- */}
      <nav className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-2xl py-3' : 'bg-transparent py-5 lg:py-8'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-5 group cursor-pointer">
            <div className={`transition-all duration-700 p-2 md:p-3 ${scrolled ? 'bg-slate-900 rounded-xl' : 'bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/10'}`}>
              <Building2 size={24} className={scrolled ? 'text-amber-500' : 'text-white'} />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-sm md:text-2xl font-black tracking-tighter uppercase transition-colors duration-500 leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                {lang === 'en' ? 'Milad Construction' : 'মিলাদ কান্সট্রাকশন'}
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black transition-colors mt-1 ${scrolled ? 'text-amber-600' : 'text-amber-400/80'}`}
              >
                {lang === 'en' ? 'Engineering Mastery' : 'নির্মাণে শ্রেষ্ঠত্ব'}
              </motion.p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10">
              {['home', 'services', 'about', 'contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item === 'home' ? '' : item}`}
                  className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-all hover:text-amber-500 relative group ${scrolled ? 'text-slate-600' : 'text-white/80'}`}
                >
                  {t.nav[item as keyof typeof t.nav]}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-500 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* --- Advanced Language Toggle --- */}
            <div className="flex items-center bg-slate-900/5 p-1 rounded-full border border-slate-900/10 backdrop-blur-sm shadow-inner group overflow-hidden relative min-w-[140px] h-10">
              <motion.div 
                animate={{ x: lang === 'bn' ? 0 : 70 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="absolute inset-y-1 left-1 bg-white rounded-full shadow-lg w-[66px] z-0" 
              />
              <button 
                onClick={() => setLang('bn')}
                className={`relative z-10 w-[70px] py-2 text-[10px] uppercase font-black tracking-widest transition-colors duration-500 ${lang === 'bn' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                বাংলা
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`relative z-10 w-[70px] py-2 text-[10px] uppercase font-black tracking-widest transition-colors duration-500 ${lang === 'en' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                ENG
              </button>
            </div>
          </div>

          <button className="lg:hidden p-2 rounded-xl transition-all active:scale-95 bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} className={scrolled ? 'text-slate-900' : 'text-white'} /> : <Menu size={24} className={scrolled ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Sidebar Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%', transition: { duration: 0.3 } }}
            className="fixed inset-0 z-[150] bg-white flex flex-col p-8 md:p-16 lg:hidden"
          >
             <div className="flex justify-between items-center mb-16">
               <div className="flex items-center gap-2">
                 <Building2 className="text-amber-600" size={24} />
                 <span className="font-black text-lg">MILAD</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-50 rounded-full"><X size={24} /></button>
             </div>
             <div className="flex flex-col gap-8">
               {['home', 'services', 'about', 'contact'].map((item, idx) => (
                  <motion.a 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item} 
                    href={`#${item === 'home' ? '' : item}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase"
                  >
                    {t.nav[item as keyof typeof t.nav]}
                  </motion.a>
                ))}
              </div>
              <div className="mt-auto pt-12 border-t border-slate-100 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl flex-1 text-center font-black text-xs tracking-widest border-2 transition-all ${lang === 'bn' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100 text-slate-400'}`} onClick={() => setLang('bn')}>বাংলা</div>
                  <div className={`p-4 rounded-2xl flex-1 text-center font-black text-xs tracking-widest border-2 transition-all ${lang === 'en' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100 text-slate-400'}`} onClick={() => setLang('en')}>ENG</div>
                </div>
                <div className="flex justify-center gap-6 text-slate-400">
                  <Phone size={24} />
                  <Globe size={24} />
                  <MessageSquare size={24} />
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 text-white/5 pointer-events-none flex items-center justify-center select-none overflow-hidden opacity-10 lg:opacity-30">
           <motion.span 
             animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="text-[40vw] font-black leading-none tracking-tighter mix-blend-overlay whitespace-nowrap"
           >
             SYLHET DIVISION
           </motion.span>
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 3, ease: "circOut" }}
            src={(siteTranslations as any).heroImage || "https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=3000"} 
            alt="Infrastructure" 
            className="w-full h-full object-cover grayscale mix-blend-luminosity lg:mix-blend-normal brightness-75 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-48 pb-24">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", damping: 15 }}
              className="flex items-center gap-5 mb-12"
            >
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-slate-950 bg-amber-600 flex items-center justify-center text-xs md:text-sm font-black text-white hover:bg-slate-900 transition-all duration-500 shadow-2xl cursor-default">0{i}</div>)}
              </div>
              <div className="h-px w-12 bg-amber-500/50 hidden sm:block" />
              <span className="text-amber-500 text-[10px] md:text-[13px] uppercase font-black tracking-[0.5em] drop-shadow-sm">
                {lang === 'en' ? 'Contracting Specialist' : 'ঠিকাদারি স্পেশালিস্ট'}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.8rem,13vw,16rem)] font-black text-white mb-10 leading-[0.75] tracking-tighter"
            >
              {lang === 'en' ? (
                <>WE BUILD<br/><span className="text-amber-500 animate-float inline-block">LEGENDS.</span></>
              ) : (
                <>আস্থার<br/><span className="text-amber-500 animate-float inline-block pb-6">নির্মাণ।</span></>
              )}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.2 }}
              className="text-lg md:text-5xl text-slate-300 mb-20 max-w-4xl font-light leading-[1.3] text-pretty border-l-8 border-amber-600 pl-10 ml-2"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-10 items-start sm:items-center"
            >
              <a href="#projects" className="btn-primary group h-24 px-16 md:px-20 text-xl hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(245,158,11,0.3)]">
                {t.hero.cta} 
                <ArrowRight size={28} className="transition-transform duration-500 group-hover:translate-x-4" />
              </a>
              <div className="flex items-center gap-12 text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">
                <div className="flex flex-col gap-3 group/stat cursor-default">
                  <ShieldCheck size={32} className="text-amber-500/60 group-hover/stat:text-amber-500 transition-colors" />
                  <span>ISO CERTIFIED</span>
                </div>
                <div className="h-14 w-px bg-white/10" />
                <div className="flex flex-col gap-3 group/stat cursor-default">
                  <HardHat size={32} className="text-amber-500/60 group-hover/stat:text-amber-500 transition-colors" />
                  <span>HSE COMPLIANT</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Rest of content with similar refinements --- */}
      
      {/* --- Projects Section: Interactive Portfolio --- */}
      <section id="projects" className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-white skew-x-[-15deg] translate-x-1/2 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-end mb-20">
            <div className="lg:col-span-7">
              <h3 className="text-amber-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">PORTFOLIO</h3>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                {t.projects.title}
              </h2>
              <p className="text-xl text-slate-500 font-light max-w-xl">
                {t.projects.subtitle}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {['all', 'roads', 'bridges', 'buildings'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-8 py-3 rounded-full text-[10px] uppercase font-black tracking-widest transition-all duration-300 border-2 ${
                      activeFilter === filter 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {t.projects[filter as keyof typeof t.projects]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group relative h-[500px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl"
                >
                  <img 
                    src={project.image} 
                    alt={lang === 'en' ? project.titleEn : project.titleBn} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-40"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-amber-600/20 text-amber-500 text-[9px] font-black uppercase tracking-widest mb-4 backdrop-blur-md border border-amber-600/30">
                      {t.projects[project.type as keyof typeof t.projects]}
                    </span>
                    <h4 className="text-3xl font-black text-white mb-2 leading-tight tracking-tighter">
                      {lang === 'en' ? project.titleEn : project.titleBn}
                    </h4>
                  </div>
                  
                  <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 border border-white/20">
                    <ArrowRight size={20} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="services" className="relative islamic-pattern py-40 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex flex-col lg:row justify-between items-start lg:items-end gap-12 mb-24">
            <div>
              <h3 className="text-amber-600 font-black uppercase tracking-[0.5em] text-[10px] mb-6">SERVICES</h3>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                 {t.services.subtitle}
              </h2>
            </div>
            <p className="text-slate-500 text-xl max-w-md bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500 italic">
               {lang === 'en' ? 'Quality you can see, engineering you can trust.' : 'দৃশ্যমান গুণমান এবং নির্ভরযোগ্য প্রকৌশলী।'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            <BentoCard 
              span="md:col-span-2 md:row-span-2"
              icon={<Building2 size={48} />}
              title={t.services.building}
              img="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
              desc={lang === 'en' ? 'Iconic structures for a lasting legacy.' : 'স্থায়ী ঐতিহ্যের জন্য আইকনিক অবকাঠামো।'}
            />
            <BentoCard 
              icon={<Construction size={32} />}
              title={t.services.sand}
              desc={lang === 'en' ? 'Finest Sylhet river sand.' : 'সিলেটের সর্বোত্তম নদীর বালু।'}
            />
            <BentoCard 
              icon={<Mountain size={32} />}
              title={t.services.stone}
              desc={lang === 'en' ? 'High-density crushed aggregate.' : 'উচ্চ ঘনত্বের চূর্ণ পাথর।'}
            />
            <BentoCard 
              span="md:col-span-2"
              icon={<Layers size={32} />}
              title={t.services.bridge}
              img="https://images.unsplash.com/photo-1545624446-4238bc35a78f?auto=format&fit=crop&q=80&w=1200"
              desc={lang === 'en' ? 'State-of-the-art bridge engineering.' : 'অত্যাধুনিক সেতু প্রকৌশলী।'}
            />
            <BentoCard 
              icon={<Warehouse size={32} />}
              title={t.services.brick}
              desc={lang === 'en' ? 'Auto-bricks for robust walls.' : 'মজবুত দেয়ালের জন্য অটো-ইট।'}
            />
            <BentoCard 
              icon={<Briefcase size={32} />}
              title={t.services.road}
              desc={lang === 'en' ? 'Sustainable asphalt solution.' : 'টেকসই অ্যাসফল্ট সমাধান।'}
            />
          </div>
        </div>
      </section>

      {/* --- About --- */}
      <section id="about" className="bg-slate-950 text-white py-40 overflow-hidden relative">
         <div className="section-padding grid lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
              <div className="aspect-[3/4] overflow-hidden rounded-[3rem] grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-[0_0_80px_rgba(245,158,11,0.1)]">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200" alt="Milad Ahmed" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-amber-600 p-12 rounded-3xl shadow-2xl">
                 <div className="text-[10px] uppercase tracking-widest text-white/60 mb-2 font-black">{t.about.role}</div>
                 <div className="text-3xl font-black leading-none">{t.about.owner}</div>
              </div>
            </div>

            <div>
               <h3 className="text-amber-600 font-bold uppercase tracking-[0.5em] text-[11px] mb-8">FOUNDATION</h3>
               <h2 className="text-6xl font-black mb-12 tracking-tighter leading-tight bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                  {t.about.title}
               </h2>
               <p className="text-slate-400 text-2xl font-light mb-12 leading-relaxed border-l-2 border-amber-600/30 pl-10">
                  {t.about.description1}
               </p>
               <div className="grid grid-cols-2 gap-12 mt-16 pt-16 border-t border-white/5">
                  <div>
                    <div className="text-5xl font-black text-amber-500 mb-2">15+</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">YEARS EXPERTISE</div>
                  </div>
                   <div>
                    <div className="text-5xl font-black text-amber-500 mb-2">100+</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">PROJECTS COMPLETED</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="py-40 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-32">
           <div>
              <h2 className="text-8xl font-black text-slate-900 mb-16 tracking-tighter leading-none">
                 LET'S <br/> <span className="text-amber-600">TALK.</span>
              </h2>
              <div className="space-y-12">
                 <div className="flex gap-8 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <div className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">VISIT US</div>
                       <div className="text-2xl font-black text-slate-900">{t.contact.address}</div>
                    </div>
                 </div>
                 <div className="flex gap-8 items-center group">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-slate-900 group-hover:text-white transition-all">
                       <Phone size={24} />
                    </div>
                    <div>
                       <div className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">CALL US</div>
                       <div className="text-2xl font-black text-slate-900">01711975093</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 relative">
              <div className="flex flex-col gap-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Name" placeholder="Your full name" />
                    <InputField label="Phone" placeholder="Your contact number" />
                 </div>
                 <InputField label="Message" placeholder="How can we help?" textarea />
                 <button className="btn-primary w-full bg-slate-900 hover:bg-amber-600 text-sm py-6">
                    SUBMIT INQUIRY
                 </button>
              </div>
           </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-20 border-t border-white/5">
         <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-2 rounded-lg"><Building2 size={24} className="text-amber-500" /></div>
              <span className="text-xl font-black tracking-tighter">MILAD CONSTRUCTION</span>
            </div>
            <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold">
               <span>ISO 9001:2015</span>
               <span>BS OHSAS 18001</span>
            </div>
            <div className="flex items-center gap-8">
               {user ? (
                 <button onClick={() => setShowAdmin(true)} className="flex items-center gap-2 text-amber-500 font-black cursor-pointer hover:text-amber-400">
                    <Settings size={16} /> ADMIN
                 </button>
               ) : (
                 <button onClick={handleLogin} className="text-[10px] uppercase tracking-widest text-slate-700 hover:text-slate-500 font-black">
                    STAFF LOGIN
                 </button>
               )}
               <div className="text-[10px] uppercase tracking-widest text-slate-500">
                  © 2026 {t.footer.rights}
               </div>
            </div>
         </div>
      </footer>

      {/* --- Admin Modal --- */}
      <AnimatePresence>
        {showAdmin && user && (
          <AdminDashboard 
            translations={siteTranslations} 
            projects={projects}
            lang={lang}
            onClose={() => setShowAdmin(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminDashboard({ translations: initialData, projects, lang, onClose }: { translations: any, projects: any[], lang: 'en' | 'bn', onClose: () => void }) {
  const [activeTab, setActiveTab ] = useState<'content' | 'projects'>('content');
  const [editData, setEditData] = useState(initialData);

  const saveContent = async () => {
    try {
      await setDoc(doc(db, 'config', 'site'), editData);
      alert("Content Updated successfully!");
    } catch (e) {
      alert("Error updating content");
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const addProject = async () => {
    const titleEn = prompt("English Title:");
    const titleBn = prompt("Bengali Title:");
    const image = prompt("Image URL (Unsplash recommended):", "https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=1200");
    const type = prompt("Type (roads/bridges/buildings):", "roads");

    if (titleEn && titleBn && image && type) {
      await addDoc(collection(db, 'projects'), {
        titleEn,
        titleBn,
        image,
        type,
        createdAt: serverTimestamp()
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl p-4 md:p-12 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
             <div className="p-4 bg-amber-600 rounded-2xl text-white"><Settings size={32} /></div>
             <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Command Center</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Logged in as: {auth.currentUser?.email}</p>
             </div>
          </div>
          <div className="flex gap-4">
             <button onClick={() => signOut(auth)} className="p-4 bg-red-600/10 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><LogOut /></button>
             <button onClick={onClose} className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-all"><X /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-12">
           {['content', 'projects'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-12 py-5 rounded-3xl text-[10px] uppercase font-black tracking-widest border-2 transition-all ${activeTab === tab ? 'bg-amber-600 border-amber-600 text-white' : 'border-white/10 text-slate-500 hover:border-white/20'}`}
             >
               {tab} Management
             </button>
           ))}
        </div>

        {activeTab === 'content' && (
          <div className="space-y-12 pb-20">
             <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                   <h3 className="text-amber-500 font-black mb-10 text-[10px] uppercase tracking-widest flex items-center gap-4">
                      <Languages size={20} /> English Content
                   </h3>
                   <div className="space-y-8">
                      <AdminTextarea label="Hero Subtitle" value={editData.en.hero.subtitle} onChange={(val) => setEditData({...editData, en: {...editData.en, hero: {...editData.en.hero, subtitle: val}}})} />
                      <AdminInput label="About Owner" value={editData.en.about.owner} onChange={(val) => setEditData({...editData, en: {...editData.en, about: {...editData.en.about, owner: val}}})} />
                      <AdminTextarea label="About Description" value={editData.en.about.description1} onChange={(val) => setEditData({...editData, en: {...editData.en, about: {...editData.en.about, description1: val}}})} />
                   </div>
                </div>
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                   <h3 className="text-amber-500 font-black mb-10 text-[10px] uppercase tracking-widest flex items-center gap-4">
                      <Languages size={20} /> Bengali Content
                   </h3>
                   <div className="space-y-8">
                      <AdminTextarea label="Hero Subtitle" value={editData.bn.hero.subtitle} onChange={(val) => setEditData({...editData, bn: {...editData.bn, hero: {...editData.bn.hero, subtitle: val}}})} />
                      <AdminInput label="About Owner" value={editData.bn.about.owner} onChange={(val) => setEditData({...editData, bn: {...editData.bn, about: {...editData.bn.about, owner: val}}})} />
                      <AdminTextarea label="About Description" value={editData.bn.about.description1} onChange={(val) => setEditData({...editData, bn: {...editData.bn, about: {...editData.bn.about, description1: val}}})} />
                   </div>
                </div>
             </div>
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 mb-12">
                <AdminInput label="Global Hero Image URL" value={(editData as any).heroImage} onChange={(val) => setEditData({...editData, heroImage: val} as any)} />
             </div>
             <button onClick={saveContent} className="btn-primary w-full py-8 text-xl hover:bg-amber-500">
                <Save size={24} /> PUSH UPDATES LIVE
             </button>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-8 pb-20">
             <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/10">
                <span className="text-white text-lg font-black tracking-widest">{projects.length} PROJECTS ONLINE</span>
                <button onClick={addProject} className="flex items-center gap-4 bg-amber-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-amber-500">
                   <Plus size={20} /> ADD PROJECT
                </button>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 relative group">
                     <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                        <img src={p.image} className="w-full h-full object-cover" />
                     </div>
                     <h4 className="text-white font-black text-xl mb-2">{lang === 'en' ? p.titleEn : p.titleBn}</h4>
                     <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{p.type}</p>
                     <button 
                        onClick={() => deleteProject(p.id)}
                        className="absolute top-8 right-8 p-3 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-2xl"
                      >
                       <Trash2 size={16} />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AdminInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
       <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 font-mono">{label}</label>
       <input 
         value={value} 
         onChange={(e) => onChange(e.target.value)}
         className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
       />
    </div>
  );
}

function AdminTextarea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
       <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 font-mono">{label}</label>
       <textarea 
         value={value} 
         onChange={(e) => onChange(e.target.value)}
         className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white h-40 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
       />
    </div>
  );
}

function BentoCard({ icon, title, desc, img, span = "" }: { icon: ReactNode, title: string, desc: string, img?: string, span?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`relative group overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 flex flex-col transition-all duration-500 hover:shadow-3xl hover:bg-white min-h-[350px] ${span}`}
    >
      {img && (
        <div className="absolute inset-0 z-0">
          <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-5 group-hover:opacity-10" alt={title} referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>
      )}
      <div className="relative z-10">
        <div className="mb-10 w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center text-amber-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700">
          {icon}
        </div>
        <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">{title}</h4>
        <p className="text-slate-500 text-lg leading-relaxed font-light">{desc}</p>
      </div>
    </motion.div>
  );
}

function InputField({ label, placeholder, textarea }: { label: string, placeholder: string, textarea?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
       <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">{label}</label>
       {textarea ? (
         <textarea className="bg-white border border-slate-200 rounded-2xl p-6 h-32 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans" placeholder={placeholder} />
       ) : (
         <input className="bg-white border border-slate-200 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans" placeholder={placeholder} />
       )}
    </div>
  );
}

function SocialIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all cursor-pointer">
      {icon}
    </div>
  );
}
