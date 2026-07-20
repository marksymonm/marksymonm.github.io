import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ScrollVelocity from "./components/ScrollVelocity";
import Lanyard from "./components/Lanyard";
import TextType from "./components/TextType";
import AboutVisual, { ABOUT_VISUAL_LABELS } from "./components/AboutVisual";

import { Mail } from "lucide-react";

import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiBootstrap, SiTailwindcss,
  SiPython, SiDjango, SiPhp, SiMysql,
  SiDocker, SiXampp, SiGit, SiGithub,
  SiFigma,
} from "react-icons/si";
import { FaImage, FaDrawPolygon, FaCode, FaPaintBrush, FaLayerGroup  } from "react-icons/fa";

const SKILLS = [
  { icon: SiHtml5, name: "HTML5", desc: "Semantic markup", color: "#E34F26" },
  { icon: SiCss, name: "CSS3", desc: "Styling & layout", color: "#1572B6" },
  { icon: SiJavascript, name: "JavaScript", desc: "Core scripting", color: "#F7DF1E" },
  { icon: SiTypescript, name: "TypeScript", desc: "Typed JS", color: "#3178C6" },
  { icon: SiReact, name: "React.js", desc: "UI components", color: "#61DAFB" },
  { icon: SiBootstrap, name: "Bootstrap", desc: "UI framework", color: "#7952B3" },
  { icon: SiTailwindcss, name: "Tailwind CSS", desc: "Utility-first CSS", color: "#38BDF8" },
  { icon: SiPython, name: "Python", desc: "Server-side logic", color: "#3776AB" },
  { icon: SiDjango, name: "Django", desc: "Web framework", color: "#092E20" },
  { icon: SiPhp, name: "PHP", desc: "Server scripting", color: "#777BB4" },
  { icon: SiMysql, name: "MySQL", desc: "Relational DB", color: "#4479A1" },
  { icon: SiDocker, name: "Docker", desc: "Containeri- zation", color: "#2496ED" },
  { icon: SiXampp, name: "XAMPP", desc: "Local server stack", color: "#FB7A24" },
  { icon: FaCode, name: "VS Code", desc: "Code editor", color: "#007ACC" },
  { icon: SiGit, name: "Git", desc: "Version control", color: "#F05032" },
  { icon: SiGithub, name: "GitHub", desc: "Code hosting", color: "#ffffff" },
  { icon: SiFigma, name: "Figma", desc: "UI/UX design", color: "#F24E1E" },
  { icon: FaLayerGroup, name: "Visily", desc: "UI/UX design", color: "#7C3AED" },
  { icon: FaDrawPolygon, name: "Draw.io", desc: "Diagrams & flows", color: "#F08705" },
  { icon: FaPaintBrush, name: "Canva", desc: "Graphic design", color: "#00C4CC" },
  { icon: FaImage, name: "Photoshop", desc: "Image editing", color: "#31A8FF" },
];

const PERSONAL_SKILLS = [
  "Leadership",
  "Team Collaboration",
  "Communication",
  "Organizational Skills",
  "Attention to Detail",
  "Problem Solving",
  "Analytical Thinking",
  "Time Management",
];

// Github at LinkedIn icons — inline SVG dahil tinanggal na
// yung brand/logo icons sa lucide-react
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" {...props}>
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.03 3.26 9.29 7.79 10.8.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.33-5.21 5.62.41.35.77 1.04.77 2.11 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const SOCIALS = [
  {
    icon: GithubIcon,
    label: "@marksymonm",
    href: "https://github.com/marksymonm",
  },
  {
    icon: LinkedinIcon,
    label: "Mark Symon Martinez",
    href: "https://www.linkedin.com/in/mark-symon-martinez-1878a13a0/",
  },
  {
    icon: Mail,
    label: "marksymonmartinez05@gmail.com",
    href: "mailto:marksymonmartinez05@gmail.com",
  },
];

const ROLES = ["Software Developer", "UI/UX Designer", "Graphic Artist"];

const HOBBIES = [
  "Photography",
  "Editing",
  "Designs",
  "Programming",
  "Travelling",
  "Binge Watching",
];

const EDUCATION = [
  {
    school: "Technological University of the Philippines – Cavite",
    date: "Sep 2022 – August 2026",
    detail: "Bachelor of Engineering Technology, Major in Computer Engineering Technology",
  },
  {
    school: "National College of Science and Technology – Senior High School",
    date: "August 2020 – July 2022",
    detail: "Science, Technology, Engineering and Mathematics (STEM) Strand — With Honors (A.Y. 2020–2022)",
  },
];

const EXPERIENCE = [
  {
    role: "Full-Stack Web Developer Intern",
    company: "One Outsource Direct Corporation",
    date: "Feb 2026 – July 2026",
    location: "Makati City, Metro Manila, Philippines",
    detail:
      "Developed and maintained front-end and back-end features for the OneApp Learning Management System (LMS), enhancing platform functionality and supporting a seamless user experience. Implemented responsive UI components and system enhancements, improving accessibility, usability, and cross-device compatibility for learners and administrators.",
  },
];

const AFFILIATIONS = [
  {
    org: "University Student Government (USG)",
    roles: [
      "Vice President (2025–2026)",
      "Senator for Information Dissemination (2024–2025)",
      "Mayor (2023–2024)",
    ],
  },
  {
    org: "Association of Computer Technology Students (ACTS)",
    roles: ["Assistant Public Relations Officer (2022–2023)"],
  },
];

function App() {
  const [activeVisual, setActiveVisual] = useState(0);

  return (
    <main className="main">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">HELLO I AM</p>

          <h1 className="name">
            MARK SYMON
            <br />
            MARTINEZ
          </h1>

          <div className="roles">
            <TextType
              className="roles-text"
              as="span"
              text={ROLES}
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={1400}
              initialDelay={300}
              loop
              showCursor
              cursorCharacter="|"
              cursorClassName="roles-cursor"
              cursorBlinkDuration={0.5}
            />
          </div>

          <div className="socials">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  window.open(
                    href,
                    href.startsWith("mailto:") ? "_self" : "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="social-link"
              >
                <Icon size={20} />
                <span className="social-tooltip">{label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Mark-Symon-Martinez-Resume.pdf";
                link.download = "Mark-Symon-Martinez-Resume.pdf";
                link.click();
              }}
              className="resume-btn"
            >
              Download Resume
            </button>
          </div>
        </div>

        <div className="hero-lanyard">
          <Lanyard
            position={[0, 0, 14]}
            gravity={[0, -40, 0]}
            frontImage="/images/card-front.png"
            backImage="/images/card-back.jpg"
            imageFit="cover"
          />
        </div>
      </section>

      <div className="ticker">
        <ScrollVelocity
          texts={["BEHIND THE CODE", "BEHIND THE CODE"]}
          velocity={100}
          className="ticker-text"
          numCopies={100}
          damping={50}
          stiffness={400}
        />
      </div>

      {/* About Me section */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-visual-col">
            <h2 className="about-heading">ABOUT ME</h2>

            <div className="about-visual">
              <div className="about-visual-canvas">
                <AboutVisual onActiveChange={setActiveVisual} />
              </div>
              <div className="about-visual-labels">
                {ABOUT_VISUAL_LABELS.map((label, i) => (
                  <span key={label} className={i === activeVisual ? "active" : ""}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="about-text">
            <p>
              I'm Mark Symon Martinez, a graduating student pursuing a
              Bachelor of Engineering Technology, major in Computer
              Engineering Technology, at the Technological University of the
              Philippines – Cavite.
              <br />
              <br />
              I'm passionate about building modern, user-friendly web
              applications that combine clean design with reliable
              functionality. I enjoy transforming ideas into intuitive
              digital experiences through thoughtful UI/UX design and
              efficient development.
              <br />
              <br />
              Beyond coding, I have a strong interest in graphic design and
              creating visually engaging interfaces. I believe great software
              should be both functional and enjoyable to use, and I'm always
              eager to learn new technologies, sharpen my skills, and take on
              new challenges that help me grow as a developer.
            </p>

            <div className="about-hobbies">
              <h3>HOBBIES</h3>
              <ul className="about-hobbies-list">
                {HOBBIES.map((hobby) => (
                  <li key={hobby}>{hobby}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="skills" id="skills">
        <h2 className="skills-heading">SKILLS</h2>

        <div className="skill-cards">
          {SKILLS.map(({ icon: Icon, name, desc, color }) => (
            <div className="skill-card" key={name}>
              <div className="skill-card-inner">
                <div className="skill-card-front">
                  <Icon size={32} style={{ color }} />
                  <span>{name}</span>
                </div>
                <div className="skill-card-back">
                  <p>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="skills-personal">
          <p className="skills-personal-label">PERSONAL SKILLS</p>
          <div className="skills-marquee">
            <div className="skills-marquee-track">
              {[...PERSONAL_SKILLS, ...PERSONAL_SKILLS].map((skill, i) => (
                <span className="skills-marquee-item" key={`${skill}-${i}`}>
                  {skill} <span className="skills-marquee-dot">●</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section className="projects" id="projects">
        <h2 className="projects-heading">PORTFOLIO</h2>

        <div className="projects-wip">
          <div className="wip-stripe" />
          <div className="wip-content">
            <span className="wip-tag">STATUS: IN PROGRESS</span>
            <h3 className="wip-title">
              BUILDING
              <br />
              SOMETHING
              <br />
              COOL
            </h3>
            <p className="wip-desc">
              This section is currently under construction. Check back soon
              for a full showcase of my work.
            </p>
          </div>
          <div className="wip-stripe" />
        </div>
      </section>

      {/* Background section */}
      <section className="background" id="background">
        <h2 className="background-heading">BACKGROUND</h2>

        <div className="background-grid">
          {/* Education */}
          <div className="background-col">
            <h3 className="background-col-title">
              <span className="background-col-dot" />
              EDUCATION
            </h3>
            <div className="timeline">
              {EDUCATION.map((edu) => (
                <div className="timeline-item" key={edu.school}>
                  <span className="timeline-date">{edu.date}</span>
                  <h4 className="timeline-title">{edu.school}</h4>
                  <p className="timeline-detail">{edu.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="background-col">
            <h3 className="background-col-title">
              <span className="background-col-dot" />
              EXPERIENCE
            </h3>
            <div className="timeline">
              {EXPERIENCE.map((exp) => (
                <div className="timeline-item" key={exp.role}>
                  <span className="timeline-date">{exp.date}</span>
                  <h4 className="timeline-title">{exp.role}</h4>
                  <p className="timeline-sub">
                    {exp.company} — {exp.location}
                  </p>
                  <p className="timeline-detail">{exp.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Affiliations */}
        <div className="affiliations">
          <h3 className="background-col-title affiliations-title">
            <span className="background-col-dot" />
            AFFILIATIONS
          </h3>
          <div className="affiliations-grid">
            {AFFILIATIONS.map((aff) => (
              <div className="affiliation-card" key={aff.org}>
                <h4>{aff.org}</h4>
                <ul>
                  {aff.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}

export default App;