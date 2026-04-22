import { useState, useEffect, useRef } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  FileText, Eye, Download, ExternalLink,
  Clock, BookOpen, AlertCircle, Search
} from "lucide-react";

// Componente decorador flotante
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
  const getColorFilter = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
  };

  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none z-0"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
        filter: color ? getColorFilter(color) : 'none'
      }}
      animate={{
        y: [0, -25, 0],
        rotate: rotate ? [0, 360] : 0,
        scale: [1, 1.05, 1],
      }}
      transition={{
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
        rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
        scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
};

// Formatear fecha
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Componente para vista previa del PDF
const PdfPreview = ({ documentUrl, primaryColor }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const previewRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isVisible) {
    return (
      <div 
        ref={previewRef}
        className="relative w-full h-[220px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: `${primaryColor}05` }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '0.15s' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: primaryColor, animationDelay: '0.3s' }} />
          </div>
          <span className="text-xs text-gray-400">Desplázate para ver vista previa</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[220px] bg-gray-100 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor }} />
            <span className="text-xs text-gray-400">Cargando vista previa...</span>
          </div>
        </div>
      )}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`}
        className="w-full h-full"
        style={{ pointerEvents: 'none' }}
        title="Vista previa del documento"
        onLoad={handleIframeLoad}
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm">
          <ExternalLink size={14} className="text-white" />
          <span className="text-xs text-white font-medium">Vista previa del documento</span>
        </div>
      </div>
    </div>
  );
};

export default function GacetaView() {
  const { gaceta, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!gaceta) return;
    
    let filtered = [...gaceta];
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        item => item.gaceta_titulo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.gaceta_fecha) - new Date(a.gaceta_fecha));
    
    setFilteredItems(filtered);
  }, [gaceta, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-t-transparent"
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      
      {/* ─── DECORADORES FLOTANTES ────────────────────────────────────────── */}
      <FloatingDecorator 
        src="/png_decoradores/shape-01.png" 
        size={160} x="2%" y="5%" delay={0} duration={14} 
        color={primaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/shape-02.png" 
        size={140} x="85%" y="8%" delay={1} duration={12} 
        color={secondaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-09.png" 
        size={200} x="-2%" y="75%" delay={2} duration={16} rotate={false}
        color={primaryColor}
      />
      <FloatingDecorator 
        src="/png_decoradores/dark-shape-13.png" 
        size={170} x="86%" y="80%" delay={1.5} duration={14} rotate={false}
        color={secondaryColor}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-4">
            <FileText size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>
              Documentos oficiales
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
            <span className="relative inline-block">
              <span 
                className="relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Gaceta Universitaria
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </span>
          </h1>
          <p className="text-gray-500 mt-3 text-sm max-w-2xl mx-auto">
            Documentos oficiales, resoluciones y comunicados institucionales
          </p>
        </motion.div>

        {/* Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              style={{ outlineColor: primaryColor }}
            />
          </div>
        </motion.div>

        {/* Grid de documentos */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500">
              {searchTerm ? "No se encontraron documentos con esa búsqueda" : "No hay documentos disponibles"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isNew = new Date(item.gaceta_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              
              return (
                <motion.div
                  key={item.gaceta_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <Link
                    to={`/gaceta/${item.gaceta_id}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer"
                  >
                    {/* Vista previa del PDF */}
                    <div className="p-4 pb-0">
                      <PdfPreview documentUrl={item.gaceta_documento} primaryColor={primaryColor} />
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
                          }}
                        >
                          GACETA
                        </span>
                        {isNew && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white">
                            <Sparkles size={10} />
                            NUEVO
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.gaceta_titulo}
                      </h3>
                      
                      {/* Fecha */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar size={12} />
                        <span>{formatFecha(item.gaceta_fecha)}</span>
                      </div>

                      {/* Indicador de clic */}
                      <div className="mt-auto flex items-center justify-end pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-xs font-medium transition-all duration-300 group-hover:translate-x-1" style={{ color: primaryColor }}>
                          <span>Ver documento completo</span>
                          <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>

                    {/* Barra inferior animada */}
                    <motion.div 
                      className="h-1 w-0 group-hover:w-full transition-all duration-500"
                      style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contador */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-400">
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "documento" : "documentos"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Estilos para animación de bounce */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}