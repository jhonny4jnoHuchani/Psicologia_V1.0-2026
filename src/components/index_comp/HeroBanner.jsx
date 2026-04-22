import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// SVG inline (mantienen igual)
const IconBrain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
  </svg>
);

const IconHeart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Frases motivacionales para rotar
const frasesMotivacionales = [
  "La mente es como un paracaídas, solo funciona si se abre.",
  "No hay salud sin salud mental.",
  "El primer paso hacia el cambio es la conciencia.",
  "Eres más fuerte de lo que crees.",
  "Cada día es una nueva oportunidad para crecer.",
  "La psicología es el arte de entender el alma humana.",
];

// Componente decorador flotante (encima de la portada)
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, opacity = 0.5 }) => {
  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none z-20"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
        opacity: opacity
      }}
      animate={{
        y: [0, -25, 0],
        rotate: rotate ? [0, 360] : 0,
        scale: [1, 1.08, 1],
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
        scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
};

export default function HeroBanner({
  institucion,
  portadas = [],
  loading,
  children,
  childrenPosition = "bottom-0 left-0 right-0",
  height = "min-h-[500px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[700px]",
  showControls = true,
  autoSlide = true,
  slideInterval = 5000,
  showButtons = true,
}) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next");
  const [fraseIndex, setFraseIndex] = useState(0);
  const [animatingLetters, setAnimatingLetters] = useState({});

  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const triggerSlide = (dir) => {
    if (sliding || portadas.length <= 1) return;

    const nextIdx =
      dir === "next"
        ? (current + 1) % portadas.length
        : (current - 1 + portadas.length) % portadas.length;

    setDirection(dir);
    setNext(nextIdx);
    setSliding(true);

    setTimeout(() => {
      setCurrent(nextIdx);
      setNext(null);
      setSliding(false);
    }, 600);
  };

  // Auto-slide de portadas
  useEffect(() => {
    if (!autoSlide || portadas.length <= 1) return;
    const interval = setInterval(() => triggerSlide("next"), slideInterval);
    return () => clearInterval(interval);
  }, [portadas.length, current, autoSlide, slideInterval]);

  // Rotar frases cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frasesMotivacionales.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animación saltarina de letras cada 10 segundos
  useEffect(() => {
    const nombre = descripcion?.institucion_nombre ?? "PSICOLOGÍA";
    const letras = nombre.replace(/\s/g, "").split("");

    const animateLetters = () => {
      letras.forEach((_, idx) => {
        setTimeout(() => {
          setAnimatingLetters((prev) => ({ ...prev, [idx]: true }));
          setTimeout(() => {
            setAnimatingLetters((prev) => ({ ...prev, [idx]: false }));
          }, 600);
        }, idx * 80);
      });
    };

    animateLetters();
    const interval = setInterval(animateLetters, 10000);
    return () => clearInterval(interval);
  }, [descripcion?.institucion_nombre]);

  // Skeleton
  if (loading) {
    return (
      <div className={`relative w-full ${height} bg-gray-900 animate-pulse flex items-center justify-center`}>
        <div className="text-center space-y-5 px-4">
          <div className="w-40 h-4 sm:w-56 sm:h-5 bg-white/10 rounded-full mx-auto" />
          <div className="w-60 h-12 sm:w-80 sm:h-16 bg-white/10 rounded-xl mx-auto" />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="w-32 h-10 sm:w-36 sm:h-11 bg-white/10 rounded-full mx-auto sm:mx-0" />
            <div className="w-32 h-10 sm:w-36 sm:h-11 bg-white/10 rounded-full mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
    );
  }

  // Fallback sin portadas
  if (portadas.length === 0) {
    return (
      <div
        className={`relative w-full ${height} flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)",
          }}
        />
        <div className="w-full md:w-auto">
          <TextContent
            descripcion={descripcion}
            showButtons={showButtons}
            fraseActual={frasesMotivacionales[fraseIndex]}
            animatingLetters={animatingLetters}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
        <div className="hidden lg:block">
          <LogoFloat
            descripcion={descripcion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
        {children && (
          <div className={`absolute ${childrenPosition} z-20`}>{children}</div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 z-20"
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)`,
          }}
        />
      </div>
    );
  }

  const slideActual = portadas[current];
  const slideNext = next !== null ? portadas[next] : null;

  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px ${primaryColor}80; }
          50% { text-shadow: 0 0 40px ${primaryColor}; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-enter-next { animation: slideInFromRight 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-exit-next { animation: slideOutToLeft 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-enter-prev { animation: slideInFromLeft 0.6s cubic-bezier(.4,0,.2,1) both; }
        .slide-exit-prev { animation: slideOutToRight 0.6s cubic-bezier(.4,0,.2,1) both; }
        
        .letter-bounce {
          display: inline-block;
          animation: bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .float-buttons {
          animation: float 3s ease-in-out infinite;
        }
        
        .fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .hero-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }
      `}</style>

      {/* ─── DECORADORES FLOTANTES ENCIMA DE LA PORTADA ─────────────────────── */}
      
      {/* Esquina superior izquierda */}
      <FloatingDecorator 
        src="/png_decoradores/shape-01.png" 
        size={160} 
        x="2%" 
        y="5%" 
        delay={0} 
        duration={14}
        opacity={0.5}
      />
      
      {/* Esquina superior derecha */}
      <FloatingDecorator 
        src="/png_decoradores/shape-02.png" 
        size={140} 
        x="85%" 
        y="3%" 
        delay={1} 
        duration={12}
        opacity={0.5}
      />
      
      {/* Esquina inferior izquierda */}
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-09.png" 
        size={200} 
        x="1%" 
        y="75%" 
        delay={2} 
        duration={16}
        rotate={false}
        opacity={0.4}
      />
      
      {/* Esquina inferior derecha */}
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-13.png" 
        size={170} 
        x="83%" 
        y="78%" 
        delay={1.5} 
        duration={14}
        rotate={false}
        opacity={0.4}
      />
      
      {/* Centro izquierdo - flotando */}
      <FloatingDecorator 
        src="/png_decoradores/shape-03.png" 
        size={120} 
        x="1%" 
        y="40%" 
        delay={3} 
        duration={15}
        opacity={0.45}
      />
      
      {/* Centro derecho - flotando */}
      <FloatingDecorator 
        src="/png_decoradores/shape-04.png" 
        size={110} 
        x="87%" 
        y="45%" 
        delay={2.5} 
        duration={13}
        opacity={0.45}
      />

      {/* Imagen de fondo actual */}
      <div
        key={`current-${current}`}
        className={`absolute inset-0 ${sliding ? (direction === "next" ? "slide-exit-next" : "slide-exit-prev") : ""}`}
      >
        <img
          src={slideActual.portada_imagen}
          alt={slideActual.portada_titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Imagen siguiente entrando */}
      {sliding && slideNext && (
        <div
          key={`next-${next}`}
          className={`absolute inset-0 ${direction === "next" ? "slide-enter-next" : "slide-enter-prev"}`}
        >
          <img
            src={slideNext.portada_imagen}
            alt={slideNext.portada_titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay gradiente mejorado - responsivo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40 sm:via-black/60 md:to-transparent z-10" />

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-12 lg:py-0">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <TextContent
            descripcion={descripcion}
            showButtons={showButtons}
            fraseActual={frasesMotivacionales[fraseIndex]}
            animatingLetters={animatingLetters}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>

        <div className="hidden lg:flex">
          <LogoFloat
            descripcion={descripcion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      </div>

      {/* Children */}
      {children && (
        <div className={`absolute ${childrenPosition} z-30`}>{children}</div>
      )}

      {/* Botones prev / next - responsivos */}
      {showControls && portadas.length > 1 && (
        <>
          <button
            onClick={() => triggerSlide("prev")}
            disabled={sliding}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 text-white p-2 sm:p-3 rounded-full opacity-60 hover:opacity-100 focus:opacity-100 transition-all backdrop-blur-sm hover:scale-110 disabled:cursor-not-allowed"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            aria-label="Anterior"
          >
            <ChevronLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <button
            onClick={() => triggerSlide("next")}
            disabled={sliding}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 text-white p-2 sm:p-3 rounded-full opacity-60 hover:opacity-100 focus:opacity-100 transition-all backdrop-blur-sm hover:scale-110 disabled:cursor-not-allowed"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            aria-label="Siguiente"
          >
            <ChevronRight size={18} className="sm:w-[22px] sm:h-[22px]" />
          </button>
        </>
      )}

      {/* Franja inferior con gradiente */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 z-30"
        style={{
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
        }}
      />
    </div>
  );
}

// ─── Subcomponente: texto izquierdo CON COLORES DE API Y RESPONSIVO ─────────
function TextContent({
  descripcion,
  showButtons,
  fraseActual,
  animatingLetters,
  primaryColor,
  secondaryColor,
}) {
  const nombre = descripcion?.institucion_nombre ?? "PSICOLOGÍA";
  const palabras = nombre.split(" ");

  return (
    <div className="flex flex-col justify-center max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto lg:mx-0">
      
      {/* Badge universidad - Responsivo */}
      <div className="fade-up flex items-center justify-center lg:justify-start gap-2 mb-4 sm:mb-5">
        <div
          className="flex items-center gap-2 sm:gap-3 md:gap-5 backdrop-blur-md rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-3"
          style={{
            backgroundColor: `${primaryColor}08`,
            backdropFilter: "blur(16px)",
          }}
        >
          <img
            src="/logo/upeaLogo.png"
            alt="UPEA"
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
          />
          <span className="text-white/80 sm:text-white/90 text-xs sm:text-sm md:text-base font-light uppercase tracking-wider">
            Universidad Pública de El Alto
          </span>
        </div>
      </div>

      {/* "Carrera de" - Responsivo */}
      <p className="fade-up text-white/70 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light uppercase tracking-widest mb-2 sm:mb-4 text-center lg:text-left">
        Carrera de
      </p>

      {/* Nombre con animación saltarina - Responsivo */}
      <h1
        className="font-black mb-4 sm:mb-6 leading-tight"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <div className="flex flex-wrap justify-center lg:justify-start gap-x-1 sm:gap-x-2">
          {palabras.map((palabra, wi) => (
            <div key={wi} className="inline-flex">
              {palabra.split("").map((letra, li) => {
                const globalIndex = wi * 10 + li;
                const isAnimating = animatingLetters[globalIndex];

                return (
                  <span
                    key={li}
                    className={`inline-block ${isAnimating ? "letter-bounce" : ""} transition-all duration-300`}
                    style={{
                      fontSize: "clamp(2rem, 8vw, 7rem)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                      display: "inline-block",
                      color: primaryColor,
                    }}
                  >
                    {letra}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </h1>

      {/* Frase motivacional rotativa - Responsivo */}
      <div className="mb-3 sm:mb-4 min-h-[50px] sm:min-h-[60px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={fraseActual}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hero-glow text-sm sm:text-base md:text-lg font-medium italic leading-relaxed max-w-full sm:max-w-xl text-center lg:text-left px-2 sm:px-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            "{fraseActual}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Botones - Responsivos */}
      {showButtons && (
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 float-buttons">
          <a
            href="#contenido"
            className="group relative overflow-hidden flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-white rounded-full font-semibold text-xs sm:text-sm hover:scale-105 hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <IconBrain />
              Explorar carrera
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
              }}
            />
          </a>

          <a
            href="/about"
            className="group flex items-center justify-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 border-2 border-white/30 text-white rounded-full font-semibold text-xs sm:text-sm hover:bg-white/10 hover:scale-105 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = primaryColor)
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            <IconHeart />
            Conócenos
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Subcomponente: logo flotante RESPONSIVO ───────────────────────────────
function LogoFloat({ descripcion, primaryColor, secondaryColor }) {
  if (!descripcion?.institucion_logo) return null;

  return (
    <div className="hidden xl:flex items-center justify-center shrink-0 ml-8">
      <div className="relative">
        {/* Anillos pulsantes */}
        <div
          className="pulse-ring absolute inset-0 rounded-full border"
          style={{
            borderColor: `${primaryColor}50`,
            animationDelay: "0s",
            borderWidth: "1px",
          }}
        />
        <div
          className="pulse-ring absolute inset-0 rounded-full border"
          style={{
            borderColor: `${secondaryColor}30`,
            animationDelay: "0.7s",
            borderWidth: "1px",
          }}
        />

        {/* Logo con tamaño responsivo */}
        <div
          className="relative"
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 25px 8px rgba(255,255,255,0.25)`,
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />

          <img
            src={descripcion.institucion_logo}
            alt={descripcion.institucion_nombre}
            className="object-contain rounded-full relative"
            style={{
              width: "clamp(180px, 25vw, 400px)",
              height: "clamp(180px, 25vw, 400px)",
              filter: `drop-shadow(0 0 15px ${primaryColor}60)`,
              transform: "scale(1.04)",
            }}
          />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `inset 0 0 15px 2px rgba(255,255,255,0.25)`,
              pointerEvents: "none",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>
    </div>
  );
}