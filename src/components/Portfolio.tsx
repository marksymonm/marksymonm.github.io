import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Play,
  X,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Library,
  ShoppingBag,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import "./Portfolio.css";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type Category = "lab" | "library" | "store" | "web";

type Project = {
  id: string;
  name: string;
  category: Category;
  /** Omit when there's no video thumbnail to try (e.g. no demo video). */
  thumbnail?: string;
  description: string;
  githubUrl: string;
  /** Omit when there's no video demo — the "Watch Video Demo" button/link
   *  and thumbnail play overlay are hidden automatically when this is unset. */
  demoUrl?: string;
};

type Poster = {
  id: string;
  title: string;
  image: string;
};

/** How many project cards show per page in the System Projects tab. */
const PROJECTS_PER_PAGE = 4;

const TRANSITION_MS = 350;

/** YouTube's static thumbnail CDN — no API key needed. */
const ytThumb = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;


const YT_PLACEHOLDER_SIZE = 120;

const CATEGORY_META: Record<Category, { icon: LucideIcon; tag: string; label: string }> = {
  lab: { icon: FlaskConical, tag: "LAB.SYS", label: "Laboratory System" },
  library: { icon: Library, tag: "LIB.SYS", label: "Library System" },
  store: { icon: ShoppingBag, tag: "SHOP.SYS", label: "Online Store" },
  web: { icon: Globe, tag: "WEB.SYS", label: "Web Portfolio" },
};

const PROJECTS: Project[] = [
    {
    id: "web-portfolio",
    name: "Website Portfolio",
    category: "web",
    description:
        "• Developed a responsive portfolio website using React and TypeScript.\n• Showcases my projects, graphic design works, and technical skills.\n• Deployed on GitHub Pages with a modern, front-end focused design.",
    githubUrl: "https://github.com/marksymonm/marksymonm.github.io",
    },
  {
    id: "doms",
    name: "Innovation of Digital Ordering and Management System (THESIS)",
    category: "store",
    thumbnail: ytThumb("P31W1VeOcSo"),
    description:
    "• Built a customizable ordering and management system for three MSMEs.\n• Integrated inventory, order tracking, payments, and customer management.\n• Created responsive interfaces and implemented business-driven features.",    githubUrl: "https://github.com/therebloc-oos/therebloc",
    demoUrl: "https://youtu.be/P31W1VeOcSo?si=85pOaSjFoek_54At",
  },
    {
    id: "les-web",
    name: "Laboratory Equipment Borrowing System — Web",
    category: "lab",
    thumbnail: ytThumb("fqLLZcGy5dU"),
    description:
        "• Built a web-based laboratory equipment borrowing system.\n• Automated equipment reservations, borrowing, and approval workflows.\n• Designed responsive interfaces for students and laboratory custodians.",
    githubUrl:
        "https://github.com/marksymonm/TUPCLaboratoryEquipmentBorrowingSystem",
    demoUrl: "https://youtu.be/fqLLZcGy5dU",
    },
    {
    id: "les-mobile",
    name: "Laboratory Equipment Borrowing System — Mobile App",
    category: "lab",
    thumbnail: ytThumb("pYtHfROe7js"),
    description:
        "• Developed a mobile app for laboratory equipment borrowing.\n• Enabled equipment reservations and real-time request tracking.\n• Designed an intuitive mobile experience for students and laboratory custodians.",
    githubUrl:
        "https://github.com/marksymonm/Lab-Equipment-Borrowing-System-Mobile-App",
    demoUrl: "https://youtu.be/pYtHfROe7js",
    },
    {
    id: "lms-desktop",
    name: "Library Management System — Desktop App",
    category: "library",
    thumbnail: ytThumb("B7YeI0dZ1A4"),
    description:
        "• Built a desktop library management system.\n• Automated book borrowing, returns, and user record management.\n• Centralized library transactions to improve efficiency and accessibility.",
    githubUrl:
        "https://github.com/marksymonm/Library-Management-System-Desktop-App",
    demoUrl: "https://youtu.be/B7YeI0dZ1A4",
    },
];

const POSTERS: Poster[] = [
  { id: "poster-1", title: "Araw ng Kagitingan Pubmat", image: "/images/posters/poster-01.jpg" },
  { id: "poster-2", title: "Intramurals Tarpaulin", image: "/images/posters/poster-02.jpg" },
  { id: "poster-3", title: "Labor Day Pubmat", image: "/images/posters/poster-03.jpg" },
  { id: "poster-4", title: "Sublimation Polo Shirt Design", image: "/images/posters/poster-04.jpg" },
  { id: "poster-5", title: "Intramurals Teams Introduction Pubmat", image: "/images/posters/poster-05.jpg" },
  { id: "poster-6", title: "New Set of Officers Pubmat", image: "/images/posters/poster-06.jpg" },
  { id: "poster-7", title: "Christmas Pubmat", image: "/images/posters/poster-07.jpg" },
  { id: "poster-8", title: "BOTB Participants Pubmat", image: "/images/posters/poster-08.jpg" },
  { id: "poster-9", title: "USG Uniform Layout", image: "/images/posters/poster-09.jpg" },
  { id: "poster-10", title: "Order of Perfomances", image: "/images/posters/poster-10.jpg" },
  { id: "poster-11", title: "ACSO Booth Pubmat", image: "/images/posters/poster-11.jpg" },
  { id: "poster-12", title: "Jersey Design", image: "/images/posters/poster-12.jpg" },
  { id: "poster-13", title: "Pubmat", image: "/images/posters/poster-13.jpg" },
  { id: "poster-14", title: "Intramurals Medal Tally Pubmat", image: "/images/posters/poster-14.jpg" },
  { id: "poster-15", title: "National Womens Month Pubmat", image: "/images/posters/poster-15.jpg" },
  { id: "poster-16", title: "Intramurals Overall Champion Pubmat", image: "/images/posters/poster-16.jpg" },
];

type Tab = "system" | "posters";

function CodeThumb({ project, size = "card" }: { project: Project; size?: "card" | "modal" }) {
  const { icon: Icon, tag, label } = CATEGORY_META[project.category];
  return (
    <div className={`project-thumb-code project-thumb-code--${size}`}>
      <span className="project-thumb-tag">{tag}</span>
      <span className="project-thumb-icon">
        <Icon size={size === "modal" ? 46 : 34} strokeWidth={1.4} />
      </span>
      <span className="project-thumb-label">{label}</span>
    </div>
  );
}

function CardThumb({ project }: { project: Project }) {
  const [src, setSrc] = useState(project.thumbnail);
  const [triedHq, setTriedHq] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleError = () => {
    if (!triedHq) {
      setTriedHq(true);
      setSrc((s) => s?.replace("maxresdefault", "hqdefault"));
    } else {
      setImageFailed(true);
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth <= YT_PLACEHOLDER_SIZE) {
      // Loaded "successfully" but it's YouTube's no-thumbnail placeholder.
      if (!triedHq) {
        setTriedHq(true);
        setSrc((s) => s?.replace("maxresdefault", "hqdefault"));
      } else {
        setImageFailed(true);
      }
    }
  };

  const showImage = Boolean(project.thumbnail) && !imageFailed;

  return (
    <div className="project-thumb">
      {showImage ? (
        <img src={src} alt={project.name} onError={handleError} onLoad={handleLoad} />
      ) : (
        <CodeThumb project={project} size="card" />
      )}
      {project.demoUrl && (
        <span className="project-thumb-play">
          <Play size={16} fill="currentColor" />
        </span>
      )}
    </div>
  );
}

function Portfolio() {
  const [tab, setTab] = useState<Tab>("system");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [page, setPage] = useState(1);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  const [entering, setEntering] = useState(false);

  const pageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lock scroll + close on Escape while the modal is open
  useEffect(() => {
    if (!activeProject) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeProject]);

  // Clean up any in-flight transition timeouts on unmount.
    useEffect(() => {
      return () => {
        if (pageTimeoutRef.current !== null) {
        clearTimeout(pageTimeoutRef.current);
        }

        if (tabTimeoutRef.current !== null) {
        clearTimeout(tabTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setEntering(false);
        });
        return () => cancelAnimationFrame(raf);
    }, [page, tab]);

    const scrollPosters = (dir: 1 | -1) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
    };

  const totalPages = Math.max(1, Math.ceil(PROJECTS.length / PROJECTS_PER_PAGE));
  const pagedProjects = PROJECTS.slice(
    (page - 1) * PROJECTS_PER_PAGE,
    page * PROJECTS_PER_PAGE,
  );

  const goToPage = (newPage: number) => {
    const clamped = Math.min(Math.max(newPage, 1), totalPages);
    if (clamped === page) return;

    const container = bodyRef.current;
    if (!container) {
      setPage(clamped);
      return;
    }

    if (pageTimeoutRef.current !== null) {
        clearTimeout(pageTimeoutRef.current);
    }
    container
      .querySelectorAll(".project-card")
      .forEach((card) => card.classList.add("leaving"));

    pageTimeoutRef.current = window.setTimeout(() => {
        setEntering(true);
        setPage(clamped);
    }, TRANSITION_MS);
  };

  const switchTab = (newTab: Tab) => {
    if (newTab === tab) return;

    const container = bodyRef.current;
    if (!container) {
      setTab(newTab);
      return;
    }

    if (tabTimeoutRef.current !== null) {
        clearTimeout(tabTimeoutRef.current);
    }
    container
      .querySelectorAll(".project-card, .poster-item")
      .forEach((el) => el.classList.add("leaving"));

    tabTimeoutRef.current = window.setTimeout(() => {
        setEntering(true);
        setTab(newTab);
    }, TRANSITION_MS);
  };

  return (
    <div className={`port-root${inView ? " in-view" : ""}`} ref={rootRef}>
      <div className="port-frame">
        <div className="port-hazard" aria-hidden="true" />

        <div className="port-tabbar">
          <div className="port-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "system"}
              className={`port-tab${tab === "system" ? " active" : ""}`}
              onClick={() => switchTab("system")}
            >
              <span className="port-tab-index">01</span>
              System Projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "posters"}
              className={`port-tab${tab === "posters" ? " active" : ""}`}
              onClick={() => switchTab("posters")}
            >
              <span className="port-tab-index">02</span>
              Graphic Posters
            </button>
          </div>

          <span className="port-rec">
            <span className="port-rec-dot" />
            REC
          </span>
        </div>

        <div className="port-body" ref={bodyRef}>
          {tab === "system" ? (
            <>
              <div className="project-grid">
                {pagedProjects.map((p, i) => (
                  <article
                  className={`project-card${entering ? " entering" : ""}`}                    
                  key={p.id}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <CardThumb project={p} />
                    <h3 className="project-name">{p.name}</h3>
                    <button
                      type="button"
                      className="project-info-btn"
                      onClick={() => setActiveProject(p)}
                    >
                      View Info
                    </button>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="port-pagination">
                  <button
                    type="button"
                    className="port-page-arrow"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="port-page-numbers">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`port-page-btn${n === page ? " active" : ""}`}
                        onClick={() => goToPage(n)}
                        aria-current={n === page ? "page" : undefined}
                        aria-label={`Page ${n}`}
                      >
                        {String(n).padStart(2, "0")}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="port-page-arrow"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="poster-viewer">
              <button
                type="button"
                className="poster-arrow"
                onClick={() => scrollPosters(-1)}
                aria-label="Scroll posters left"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="poster-scroller" ref={scrollerRef}>
                <div className="poster-sprockets top" aria-hidden="true" />
                {POSTERS.map((poster, i) => (
                  <figure
                    className={`poster-item${entering ? " entering" : ""}`}
                    key={poster.id}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className="poster-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <img src={poster.image} alt={poster.title} loading="lazy" />
                    <figcaption>{poster.title}</figcaption>
                  </figure>
                ))}
                <div className="poster-sprockets bottom" aria-hidden="true" />
              </div>

              <button
                type="button"
                className="poster-arrow"
                onClick={() => scrollPosters(1)}
                aria-label="Scroll posters right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="port-hazard" aria-hidden="true" />
      </div>

      {activeProject &&
        createPortal(
          <div
            className="port-modal-overlay"
            onClick={() => setActiveProject(null)}
          >
            <div className="port-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="port-modal-close"
                onClick={() => setActiveProject(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="port-modal-thumb">
                {activeProject.demoUrl ? (
                    <a
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${activeProject.name} video demo`}
                    >
                    <CodeThumb project={activeProject} size="modal" />
                    <span className="project-thumb-play">
                        <Play size={20} fill="currentColor" />
                    </span>
                    </a>
                ) : (
                    <CodeThumb project={activeProject} size="modal" />
                )}
              </div>

              <div className="port-modal-body">
                <span className="port-modal-eyebrow">
                  {CATEGORY_META[activeProject.category].label}
                </span>
                <h3>{activeProject.name}</h3>
                <p className="port-modal-description">
                    {activeProject.description}
                </p>

                <div className="port-modal-actions">
                    {activeProject.demoUrl && (
                        <a
                        href={activeProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="port-modal-btn demo"
                        >
                        <span className="port-modal-btn-label">
                            <Play size={14} fill="currentColor" />
                            Watch Video Demo
                        </span>
                        <ArrowUpRight size={16} className="port-modal-btn-arrow" />
                        </a>
                    )}

                    <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="port-modal-btn github"
                    >
                        <span className="port-modal-btn-label">
                        <SiGithub size={14} />
                        View on GitHub
                        </span>
                        <ArrowUpRight size={16} className="port-modal-btn-arrow" />
                    </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default Portfolio;