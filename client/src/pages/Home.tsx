import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Menu,
  X,
  ChevronDown,
  Mail,
  ExternalLink,
  Award,
  Briefcase,
  Code,
  BookOpen,
  Github,
  Linkedin,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Primary: submit to backend (when deployed with server).
      // Fallback: Netlify Forms (static deploys).
      const tryBackend = async () => {
        const res = await fetch("/api/trpc/contact.submit?batch=1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "0": { json: { visitorEmail: formData.email, visitorMessage: formData.message } },
          }),
        });
        if (!res.ok) throw new Error(`Backend submit failed (${res.status})`);
      };

      const submitNetlifyForm = async () => {
        const body = new URLSearchParams();
        body.set("form-name", "contact");
        body.set("email", formData.email);
        body.set("message", formData.message);

        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) throw new Error(`Netlify submit failed (${res.status})`);
      };

      try {
        await tryBackend();
      } catch {
        await submitNetlifyForm();
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ];

  const profile = {
    fullName: "Diyorbek Abdusattorov",
    shortName: "Diyorbek",
    title: "Data Analyst • Data Engineer • (AI Engineer in progress)",
    tagline:
      "I am an analyst that pushes business forward with my analytical and engineering skills and tools, and I’m diving deeper into AI engineering to deliver reliable, business-ready solutions.",
    email: "abdusattorovdiyor01@gmail.com",
    socials: {
      linkedin: "www.linkedin.com/in/diyorbek-abdusattorov-ba8b68373",
      github: "https://github.com/Diyor-fdv",
      telegram: "https://t.me/Dnlyst",
    },
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {profile.shortName}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-cyan-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {profile.fullName}
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl font-light text-slate-300">
              {profile.title}
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {profile.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
            >
              <Linkedin size={16} className="text-cyan-400" />
              LinkedIn
              <ExternalLink size={14} className="opacity-70" />
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
            >
              <Github size={16} className="text-cyan-400" />
              GitHub
              <ExternalLink size={14} className="opacity-70" />
            </a>
            <a
              href={profile.socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
            >
              <Send size={16} className="text-cyan-400" />
              Telegram
              <ExternalLink size={14} className="opacity-70" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => scrollToSection("projects")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-lg"
            >
              View My Work
            </Button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-6 text-lg rounded-lg"
            >
              Get In Touch
            </Button>
          </div>

          <div className="pt-12 animate-bounce">
            <ChevronDown className="mx-auto text-cyan-400" size={32} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-8 border border-cyan-400/30 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-slate-900/60 border border-slate-700 flex items-center justify-center text-3xl font-semibold text-cyan-300">
                  DA
                </div>
                <p className="text-slate-300 mt-4">{profile.fullName}</p>
                <p className="text-slate-400 text-sm mt-1">Tashkent, Uzbekistan</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-slate-300 leading-relaxed text-lg">
                I’m a data professional working as a <span className="text-slate-100 font-semibold">Data Analyst</span> and actively building my skills in <span className="text-slate-100 font-semibold">Data Engineering</span> and <span className="text-slate-100 font-semibold">AI Engineering</span>.
              </p>
              <p className="text-slate-300 leading-relaxed text-lg">
                I deliver production-ready dashboards and analytics (Power BI, Superset, Grafana), build ETL/ELT pipelines with Python/SQL, and prototype data apps with Streamlit and modern visualization libraries.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300">BI & dashboards: Power BI, Superset, Grafana</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300">Data engineering: ETL/ELT, APIs, PostgreSQL, Azure SQL</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300">AI chatbots: Azure AI + Copilot Studio</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <span className="text-slate-300">Power Platform: Power Apps, Power Automate</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    English C1
                  </span>
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    Russian B2
                  </span>
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    Uzbek (Native)
                  </span>
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    Teamwork
                  </span>
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    Flexible
                  </span>
                  <span className="px-3 py-1 bg-slate-900/40 text-slate-200 text-sm rounded-full border border-slate-700/70">
                    Logical thinking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Data Engineering */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400">
                <Code size={24} />
                Data Engineering
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Python", level: 95 },
                  { name: "SQL", level: 92 },
                  { name: "ETL / ELT", level: 90 },
                  { name: "APIs (REST)", level: 86 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">{skill.name}</span>
                      <span className="text-cyan-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Data Analysis */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400">
                <Briefcase size={24} />
                BI & Analytics
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Power BI", level: 92 },
                  { name: "Superset", level: 86 },
                  { name: "Grafana", level: 84 },
                  { name: "Statistics", level: 88 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">{skill.name}</span>
                      <span className="text-cyan-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI/ML */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400">
                <Code size={24} />
                AI & Automation
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Azure AI (Chatbots)", level: 85 },
                  { name: "Copilot Studio", level: 83 },
                  { name: "Power Apps", level: 80 },
                  { name: "Power Automate", level: 82 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">{skill.name}</span>
                      <span className="text-cyan-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tools & Technologies */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400">
                <Code size={24} />
                Visualization & Databases
              </h3>
              <div className="space-y-4">
                {[
                  { name: "PostgreSQL / Azure SQL", level: 99 },
                  { name: "Matplotlib", level: 84 },
                  { name: "Plotly", level: 86 },
                  { name: "Pandas", level: 92 },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">{skill.name}</span>
                      <span className="text-cyan-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>

          <div className="space-y-8">
            {[
              {
                role: "Data Analyst",
                company: "Centrum Air (Full-time)",
                period: "Present",
                description:
                  "Perform ad‑hoc analysis, and translate business questions into measurable KPIs. Partner with stakeholders to deliver clear, actionable insights.",
              },
              {
                role: "Data Engineer (responsibilities)",
                company: "Centrum-Air",
                period: "Present",
                description:
                  "Develop ETL/ELT workflows in Python and SQL, integrate data via APIs, and work with PostgreSQL / Azure SQL to support reliable analytics and reporting workloads.",
              },
              {
                role: "AI Engineering (learning & delivery)",
                company: "Centrum Air",
                period: "2026",
                description:
                  "Built AI chatbots using Azure AI and Copilot Studio, focusing on practical automation, safe responses, and business-ready user experience.",
              },
            ].map((exp, idx) => (
              <div
                key={idx}
                className="border-l-2 border-cyan-400 pl-8 pb-8 relative"
              >
                <div className="absolute w-4 h-4 bg-cyan-400 rounded-full -left-2.5 top-2" />
                <h3 className="text-2xl font-semibold text-cyan-400">{exp.role}</h3>
                <p className="text-slate-400 text-lg">{exp.company}</p>
                <p className="text-slate-500 text-sm mb-3">{exp.period}</p>
                <p className="text-slate-300 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Azure AI Chatbot (Copilot Studio)",
                description:
                  "Designed and delivered a business-ready chatbot using Azure AI and Copilot Studio, focusing on reliable answers, guardrails, and a clean UX.",
                tags: ["Azure AI", "Copilot Studio", "Power Platform","APIs"],
              },
                            {
                title: "Integration and Engineering",
                description:
                  "Built ETL/ELT pipelines integrating various data sources (APIs, databases) to support analytics and reporting workloads, ensuring data reliability and performance.",
                tags: ["Airflow", "APIs", "SQL","APIs"],
              },
              {
                title: "Executive BI Dashboard",
                description:
                  "Built a KPI-focused Power BI dashboard with consistent metrics definitions, drilldowns, and stakeholder-friendly storytelling.",
                tags: ["Power BI", "SQL", "DAX",],
              },
              {
                title: "Streamlit Analytics App",
                description:
                  "Created a Streamlit app for exploratory analysis and reporting with interactive Plotly charts and clean data transforms in pandas.",
                tags: ["Streamlit", "Pandas", "Plotly"],
              },
              {
                title: "Monitoring Executive BI Dashboard",
                description:
                  "Built monitoring dashboards and an executive BI dashboard page, combining Grafana operational metrics with Power BI stakeholder reporting for faster detection and decision-making.",
                tags: ["Grafana", "Power BI", "SQL", "Superset"],
              },
            ].map((project, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700 p-6 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-400/20"
              >
                <h3 className="text-xl font-semibold mb-3 text-cyan-400">
                  {project.title}
                </h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm rounded-full border border-cyan-400/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                >
                  Learn More <ExternalLink size={16} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Education & Certifications
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cyan-400 flex items-center gap-2">
                <BookOpen size={24} />
                Education
              </h3>
              {[
                {
                  degree: "Bachelor of Science in Computer Science",
                  school: "Russian University of Technology MISIS",
                  year: "2025",
                },
              ].map((edu, idx) => (
                <Card
                  key={idx}
                  className="bg-slate-700/30 border-slate-600 p-4"
                >
                  <h4 className="font-semibold text-slate-200">{edu.degree}</h4>
                  <p className="text-slate-400 text-sm">{edu.school}</p>
                  <p className="text-cyan-400 text-sm">{edu.year}</p>
                </Card>
              ))}
            </div>

            {/* Certifications */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cyan-400 flex items-center gap-2">
                <Award size={24} />
                Certifications
              </h3>
              {[
                {
                  cert: "Epam Data Analytics Professional Certificate",
                  issuer: "Epam Systems",
                  year: "2025",
                },
                {
                  cert: "IELTS 7 (IDP)",
                  issuer: "IDP Education",
                  year: "2025",
                },
                {
                  cert: "Advanced Machine Learning Specialization",
                  issuer: "Coursera",
                  year: "progress",
                },
              ].map((cert, idx) => (
                <Card
                  key={idx}
                  className="bg-slate-700/30 border-slate-600 p-4"
                >
                  <h4 className="font-semibold text-slate-200">{cert.cert}</h4>
                  <p className="text-slate-400 text-sm">{cert.issuer}</p>
                  <p className="text-cyan-400 text-sm">{cert.year}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" ref={contactFormRef}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>

          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={handleContactSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Your Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your.email@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  placeholder="Tell me about your project or inquiry..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 min-h-32 resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg rounded-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-center text-slate-400 text-sm">
                I'll get back to you as soon as possible at{" "}
                <span className="text-cyan-400 font-semibold">
                  abdusattorovdiyor01@gmail.com
                </span>
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>© 2026 {profile.fullName}. All rights reserved.</p>
          <p className="text-sm mt-2">
            Data Analyst • Data Engineer • AI Engineer
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={profile.socials.telegram}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="Telegram"
            >
              <Send size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
