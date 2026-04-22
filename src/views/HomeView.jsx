import { useOutletContext } from "react-router";
import HeroBanner           from "../components/index_comp/HeroBanner";
import QuickAccess          from "../components/index_comp/QuickAccess";
import MarqueeText          from "../components/index_comp/MarqueeText";
import CategoriesExplorer   from "../components/index_comp/CategoriesExplorer";
import MisionVisionAcordion from "../components/index_comp/MisionVisionAcordion";
import LatestConvocatorias  from "../components/index_comp/LatestConvocatorias";
import VideoVision          from "../components/index_comp/VideoVision";
import GacetaCarousel       from "../components/index_comp/GacetaCarousel";
import LatestCursos         from "../components/index_comp/LatestCursos";
import Autoridades          from "../components/index_comp/Autoridades";
import LogosBar             from "../components/index_comp/LogosBar";

export default function HomeView() {
  const {
    loading,
    institucion,
    portadas,
    autoridades,
    videos,
    publicaciones,
    linksExternos,
    convocatorias,
    cursos,
    eventos,
    gaceta,
    ofertas,
    servicios,
  } = useOutletContext();

  return (
    <div id="contenido">

      {/* 1 — Slider de portadas CON QuickAccess superpuesto */}
      <HeroBanner
        institucion={institucion}
        portadas={portadas}
        loading={loading}
        overlayOpacity="bg-gradient-to-t from-black/80 via-black/50 to-black/30"
        height="min-h-[700px]"
        childrenPosition="bottom-0 left-0 right-0 translate-y-1/3"
        autoSlide={true}
        slideInterval={6000}
        showButtons={true}
      >
        {/* 2 — Accesos rápidos superpuestos en la parte inferior del banner */}
        <QuickAccess linksExternos={linksExternos} loading={loading} />
      </HeroBanner>

      {/* 3 — Texto marquee animado - ahora con margen superior para separar del QuickAccess */}
      <div className="mt-16">
        <MarqueeText institucion={institucion} />
      </div>

      {/* 4 — Categorías + Misión/Visión en dos columnas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Explorador de categorías con contadores */}
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
                Explorar contenido
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Categorías</h2>
              <CategoriesExplorer
                convocatorias={convocatorias}
                cursos={cursos}
                eventos={eventos}
                gaceta={gaceta}
                publicaciones={publicaciones}
                servicios={servicios}
                ofertas={ofertas}
                videos={videos}
                loading={loading}
              />
            </div>

            {/* Acordeón Misión / Visión / Objetivos */}
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
                Universidad Pública de El Alto
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                {institucion?.institucion_nombre ?? "Psicología"}
              </h2>
              <MisionVisionAcordion institucion={institucion} loading={loading} />
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Últimas convocatorias, comunicados y avisos */}
      <LatestConvocatorias convocatorias={convocatorias} loading={loading} />

      {/* 6 — Video visión institucional */}
      <VideoVision institucion={institucion} loading={loading} />

      {/* 7 — Gaceta universitaria con visor PDF */}
      <GacetaCarousel gaceta={gaceta} loading={loading} />

      {/* 8 — Últimos cursos y seminarios */}
      <LatestCursos cursos={cursos} loading={loading} />

      {/* 9 — Autoridades */}
      <Autoridades autoridades={autoridades} loading={loading} />

      {/* 10 — Barra de logos institucionales */}
      <LogosBar institucion={institucion} loading={loading} />

    </div>
  );
}