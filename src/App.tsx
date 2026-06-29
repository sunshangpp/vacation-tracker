import React, { useState } from 'react';
import { 
  Mail, 
  ExternalLink, 
  Briefcase, 
  Code, 
  Sparkles, 
  Send, 
  Check, 
  Menu, 
  X, 
  ChevronRight, 
  Terminal 
} from 'lucide-react';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'fullstack'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const skills = [
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'HTML5/CSS3', category: 'frontend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'Express', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'Git', category: 'tools' },
    { name: 'Docker', category: 'tools' },
    { name: 'Vercel', category: 'tools' },
    { name: 'Figma', category: 'tools' },
  ];

  const projects = [
    {
      title: 'Aura - Creative Agency Platform',
      description: 'A premium creative agency landing page built with React, Framer Motion, and Tailwind CSS. Features seamless layouts and deep dark-mode design.',
      tags: ['React', 'Tailwind CSS', 'Framer Motion'],
      category: 'frontend',
      demo: '#',
      github: '#',
    },
    {
      title: 'TaskFlow SaaS Dashboard',
      description: 'A comprehensive workflow and task management dashboard containing drag-and-drop boards, analytics charts, and team workspace management.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      category: 'frontend',
      demo: '#',
      github: '#',
    },
    {
      title: 'Zenith eCommerce Backend & API',
      description: 'A scalable RESTful API built for eCommerce platforms with Stripe integration, JWT auth, and complex PostgreSQL product searching capabilities.',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
      category: 'fullstack',
      demo: '#',
      github: '#',
    },
    {
      title: 'Echo - Real-time Chat Workspace',
      description: 'A chat application workspace enabling channels, direct messaging, user presence tracking, and rich text editors, utilizing WebSocket sync.',
      tags: ['React', 'Node.js', 'Socket.io', 'Tailwind CSS'],
      category: 'fullstack',
      demo: '#',
      github: '#',
    }
  ];

  const experiences = [
    {
      role: 'Senior Frontend Engineer',
      company: 'PixelForge Studio',
      period: '2024 - Present',
      description: 'Lead developer for high-performance React applications. Designed a modular UI design system reducing overall styling overhead by 40% using Tailwind CSS.',
    },
    {
      role: 'Full Stack Developer',
      company: 'SyncTech Solutions',
      period: '2022 - 2024',
      description: 'Maintained enterprise SaaS platform backends. Rewrote slow database queries resulting in a 25% decrease in overall server response latency.',
    },
    {
      role: 'Software Developer Intern',
      company: 'Aperture Science',
      period: '2021 - 2022',
      description: 'Collaborated with design teams to ship responsive customer-facing web tools. Implemented modern accessibility enhancements matching WCAG guidelines.',
    }
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />

      {/* Floating Glass Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300">
        <a href="#home" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-white group">
          <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
          <span>Alex<span className="text-purple-400">Dev</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#home" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a>
          <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About</a>
          <a href="#projects" className="text-gray-400 hover:text-white transition-colors duration-200">Projects</a>
          <a href="#experience" className="text-gray-400 hover:text-white transition-colors duration-200">Experience</a>
          <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a 
            href="#contact" 
            className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030712]/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
          <nav className="flex flex-col items-center gap-6 text-xl font-semibold">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a 
              href="#projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a 
              href="#experience" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Experience
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
          </nav>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all"
          >
            Hire Me
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-36 pb-20 px-6 flex flex-col justify-center items-center max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-center w-full">
          <div className="md:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Available for work
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Crafting Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-glow">
                Experiences
              </span> That Matter
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Hi, I'm Alex. A Software Engineer specializing in building modern web applications with beautiful interfaces, clean architecture, and blazing-fast response times.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#projects" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/45 transition-all duration-200 flex items-center gap-2"
              >
                View My Projects
                <ChevronRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                className="glass hover:glass-hover text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
              >
                Get in Touch
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5 pt-4 text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:alex@example.com" className="hover:text-purple-400 transition-colors" aria-label="Email">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Visual Element (Mockup Code Block) */}
          <div className="md:col-span-5 relative w-full flex justify-center">
            <div className="w-full max-w-md glass rounded-2xl overflow-hidden shadow-2xl animate-float border border-gray-800">
              <div className="bg-gray-900/80 px-4 py-3 flex items-center gap-2 border-b border-gray-800/80">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500 font-mono ml-2">Developer.tsx</span>
              </div>
              <div className="p-6 font-mono text-xs sm:text-sm text-left bg-gray-950/40 space-y-2">
                <p className="text-purple-400">const <span className="text-blue-400">developer</span> = &#123;</p>
                <p className="pl-4 text-gray-400">name: <span className="text-green-300">"Alex"</span>,</p>
                <p className="pl-4 text-gray-400">role: <span className="text-green-300">"Frontend Engineer"</span>,</p>
                <p className="pl-4 text-gray-400">techStack: [</p>
                <p className="pl-8 text-purple-300">"React", "TypeScript",</p>
                <p className="pl-8 text-purple-300">"Next.js", "TailwindCSS"</p>
                <p className="pl-4 text-gray-400">],</p>
                <p className="pl-4 text-gray-400">coffeeLover: <span className="text-amber-400">true</span>,</p>
                <p className="pl-4 text-gray-400">solvesProblems: <span className="text-amber-400">true</span>,</p>
                <p className="text-purple-400">&#125;;</p>
                
                <div className="pt-4 mt-4 border-t border-gray-800/60 flex items-center gap-2 text-purple-400">
                  <Terminal className="w-4 h-4" />
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">Terminal Output</span>
                </div>
                <p className="text-green-400 text-[10px] sm:text-xs">
                  $ npm run dev --premium-portfolio
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">
                  ✔ Ready in 45ms. Building the future...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Skills Section */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-t border-gray-900">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-left">
            <h2 className="font-display text-3xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-purple-400" />
              About Me
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                I am a passionate software developer with over three years of building custom web tools. I enjoy bringing ideas to life through robust, modular development practices.
              </p>
              <p>
                My focus lies in building responsive layout systems, utilizing utility styling, and designing intuitive interfaces. I believe that writing code is a balancing act between clean structural components and clean graphic design.
              </p>
              <p>
                When I am not typing, you can find me exploring typography, designing custom interfaces on Figma, or making a fresh cup of filter coffee.
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="text-left space-y-6">
            <h2 className="font-display text-3xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-purple-400" />
              Core Technologies
            </h2>
            <p className="text-gray-400 text-sm">
              Here are some of the frameworks, languages, and systems I work with on a daily basis:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="glass hover:glass-hover p-4 rounded-xl transition-all duration-200 flex items-center gap-2 group cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-150 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t border-gray-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-4xl font-bold text-white">Featured Projects</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            A curated showcase of applications I have designed, engineered, and shipped.
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-2 pt-4">
            {(['all', 'frontend', 'fullstack'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-xs uppercase font-bold tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                    : 'glass text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab === 'all' ? 'All projects' : tab === 'frontend' ? 'Frontend' : 'Fullstack'}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid sm:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={index} 
              className="glass rounded-2xl overflow-hidden border border-gray-800/80 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col text-left group"
            >
              {/* Card visual mockup header */}
              <div className="h-44 bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-6 flex flex-col justify-between border-b border-gray-800/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
                <div className="flex justify-between items-center z-10">
                  <div className="px-2 py-1 rounded-md bg-gray-900/80 border border-gray-700/50 text-[10px] font-mono text-purple-400">
                    {project.category.toUpperCase()}
                  </div>
                  <div className="flex gap-3 text-gray-400">
                    <a href={project.github} className="hover:text-white transition-colors" title="GitHub Code">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={project.demo} className="hover:text-white transition-colors" title="Live Demo">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="z-10">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                <p className="text-sm text-gray-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[11px] font-medium bg-gray-900 text-gray-400 border border-gray-800 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section id="experience" className="py-24 px-6 max-w-4xl mx-auto border-t border-gray-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-display text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Work History
          </h2>
          <p className="text-gray-400">
            A timeline of my professional journey in web engineering.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-gray-800/80 ml-4 md:ml-6 space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-10 text-left">
              {/* Point Indicator */}
              <div className="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full bg-gray-950 border border-purple-500 flex items-center justify-center text-purple-400">
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap justify-between items-baseline gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    {exp.role} <span className="text-purple-400">@ {exp.company}</span>
                  </h3>
                  <span className="text-xs font-mono text-purple-400/80 bg-purple-500/5 border border-purple-500/10 px-2.5 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 max-w-4xl mx-auto border-t border-gray-900">
        <div className="glass rounded-3xl p-8 sm:p-12 border border-gray-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Info */}
            <div className="md:col-span-5 text-left space-y-6">
              <h2 className="font-display text-3xl font-bold text-white flex items-center gap-2">
                <Send className="w-6 h-6 text-purple-400" />
                Let's Connect
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Whether you have a project idea, want to discuss a software engineering role, or just want to chat about code – feel free to drop a message!
              </p>
              
              <div className="space-y-4 pt-4 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>alex@example.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Available for freelance</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-7 w-full">
              {formSubmitted ? (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">Message Dispatched!</h3>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Thanks for reaching out! I will respond to your message shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea 
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      placeholder="Hi, I'd like to discuss a project..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs text-gray-600 border-t border-gray-950">
        <p>© {new Date().getFullYear()} AlexDev. All rights reserved.</p>
        <p className="mt-1 text-[10px] text-gray-700">Built using React, Vite, Tailwind CSS v4, and hosted on Vercel.</p>
      </footer>

    </div>
  );
}
