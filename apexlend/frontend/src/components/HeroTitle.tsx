import React from 'react';

export const HeroTitle: React.FC = () => {
  return (
    <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center bg-[#ffffff]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Apple Sub-eyebrow */}
        <div className="inline-block mb-3">
          <span className="text-[12px] uppercase font-semibold tracking-wider text-[#0071e3] bg-[#0071e3]/10 border border-[#0071e3]/20 px-3 py-1 rounded-full">
            Suite Financiera de Préstamos Personales
          </span>
        </div>

        {/* Canonical Apple Main Headline (80px / 600 / -1.2px tracking) */}
        <h1 className="text-4xl sm:text-6xl md:text-[76px] font-semibold leading-[1.05] tracking-tight-apple text-[#1d1d1f]">
          Liquidez inmediata. <br className="hidden sm:inline" />
          Ingeniería de crédito pura.
        </h1>

        {/* Section Lead Text in 17px/400 with -0.374px tracking in Slate */}
        <p className="mt-4 text-[17px] font-normal leading-relaxed tracking-sub-apple text-[#707070] max-w-2xl mx-auto">
          Simulación matemática de amortizaciones bajo sistemas Francés y Alemán, control de colocaciones y gestión de cuentas por cobrar en tiempo real.
        </p>
      </div>
    </section>
  );
};

