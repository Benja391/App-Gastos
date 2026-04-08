<template>
  <main class="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50/40 to-white">
    <section class="py-16 md:py-20 px-4 sm:px-8">
      <div class="mx-auto max-w-7xl bg-gradient-to-br from-emerald-600 to-green-700 rounded-[2rem] shadow-[0_25px_60px_rgba(16,185,129,0.35)] p-8 md:p-12 overflow-hidden relative">
        <div class="absolute -top-12 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl"></div>
        <div class="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-black/10 blur-2xl"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div class="text-center lg:text-left">
            <span class="inline-flex px-4 py-2 rounded-full bg-white/20 text-green-50 text-sm font-semibold mb-4">
              Tu app para ordenar tus finanzas
            </span>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Bienvenido a <span class="text-black">GASTOS</span>
            </h1>

            <p class="text-green-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Transformá la manera en que manejás tu dinero: simple, clara y accionable desde el primer día.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <router-link
                to="/registrarse"
                class="inline-flex items-center justify-center bg-white text-green-700 font-bold py-3.5 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-green-50"
              >
                Empezá ahora
              </router-link>
              <router-link
                to="/iniciar-sesion"
                class="inline-flex items-center justify-center bg-white/15 border border-white/40 text-white font-semibold py-3.5 px-8 rounded-2xl transition-all duration-300 hover:bg-white/25"
              >
                Ya tengo cuenta
              </router-link>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end">
            <div class="w-60 sm:w-64 rounded-[2.3rem] border-[10px] border-black bg-black shadow-[0_20px_45px_rgba(0,0,0,0.35)] overflow-hidden rotate-3 hover:rotate-1 hover:scale-[1.02] transition-all duration-500">
              <img
                src="/screenshot-page.png"
                alt="Vista de la app"
                class="w-full h-full object-cover rounded-[1.8rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 px-4 sm:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <span class="inline-flex items-center bg-green-100 text-green-700 rounded-full px-5 py-2 mb-4 text-sm font-semibold">
            Características principales
          </span>
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todo lo que necesitás para <span class="text-green-600">controlar tus finanzas</span>
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramientas pensadas para que entiendas tus gastos y tomes mejores decisiones.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/registro-facil.png" alt="Registro fácil" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Registro fácil</h3>
            <p class="text-gray-600">Cargá gastos diarios rápidamente y mantené todo ordenado en segundos.</p>
          </article>

          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/reportes.jpg" alt="Reportes visuales" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Reportes visuales</h3>
            <p class="text-gray-600">Visualizá tendencias y detectá oportunidades de ahorro con claridad.</p>
          </article>

          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/presupuestos.jpeg" alt="Presupuestos personalizados" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Presupuestos personalizados</h3>
            <p class="text-gray-600">Definí límites por categoría y seguí tu progreso en tiempo real.</p>
          </article>

          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/personalizacion-personal.jpg" alt="Personalización" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Personalización</h3>
            <p class="text-gray-600">Adaptá categorías y vistas según tu estilo y prioridades.</p>
          </article>

          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/interfaz-amigable.jpg" alt="Interfaz amigable" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Interfaz amigable</h3>
            <p class="text-gray-600">Navegación simple para que te enfoques en decidir, no en buscar botones.</p>
          </article>

          <article class="group bg-white p-6 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <img src="/reportes-simples.jpg" alt="Reportes simples" class="w-full h-44 object-cover rounded-2xl mb-4" />
            <h3 class="text-xl font-bold text-gray-900 mb-2">Reportes simples</h3>
            <p class="text-gray-600">Interpretá resultados rápido y tomá acción con datos concretos.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 px-4 sm:px-8 bg-white/70">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <span class="inline-flex items-center bg-green-100 text-green-700 rounded-full px-5 py-2 mb-4 text-sm font-semibold">
            Testimonios
          </span>
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros <span class="text-green-600">usuarios</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article class="bg-white p-7 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <p class="text-yellow-500 font-bold mb-4 tracking-wide">★★★★★</p>
            <blockquote class="text-gray-700 leading-relaxed mb-5">
              “GASTOS me ayudó a cambiar completamente la forma en que manejo mi dinero. Ahora sé exactamente en qué gasto.”
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-uno-uno.jpg" alt="Mariana López" class="w-12 h-12 rounded-full object-cover mr-3" />
              <div>
                <p class="font-semibold text-gray-900">Mariana López</p>
                <p class="text-sm text-gray-500">Diseñadora gráfica</p>
              </div>
            </div>
          </article>

          <article class="bg-white p-7 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <p class="text-yellow-500 font-bold mb-4 tracking-wide">★★★★★</p>
            <blockquote class="text-gray-700 leading-relaxed mb-5">
              “Los reportes visuales son súper útiles para analizar mis hábitos y ajustar rápido cuando me paso.”
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-tres-tres.jpg" alt="Carlos García" class="w-12 h-12 rounded-full object-cover mr-3" />
              <div>
                <p class="font-semibold text-gray-900">Carlos García</p>
                <p class="text-sm text-gray-500">Analista financiero</p>
              </div>
            </div>
          </article>

          <article class="bg-white p-7 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <p class="text-yellow-500 font-bold mb-4 tracking-wide">★★★★★</p>
            <blockquote class="text-gray-700 leading-relaxed mb-5">
              “Me permitió controlar mejor las finanzas del hogar y organizar objetivos de ahorro con más confianza.”
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-dos-dos.jpg" alt="Paola Mendoza" class="w-12 h-12 rounded-full object-cover mr-3" />
              <div>
                <p class="font-semibold text-gray-900">Paola Mendoza</p>
                <p class="text-sm text-gray-500">Madre y emprendedora</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 px-4 sm:px-8 bg-gradient-to-br from-green-800 to-emerald-900">
      <div class="mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <span class="inline-flex items-center bg-white/10 text-green-100 rounded-full px-5 py-2 mb-4 text-sm font-semibold border border-white/20">
            Tips financieros
          </span>
          <h2 class="text-3xl lg:text-5xl font-bold text-white mb-4">
            Consejos para <span class="text-green-300">maximizar tus ahorros</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
            <h3 class="text-2xl font-bold text-white mb-3">1. Regla del 50/30/20</h3>
            <p class="text-green-100">Destiná 50% a necesidades, 30% a gustos y 20% a ahorro para mantener equilibrio.</p>
          </article>

          <article class="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
            <h3 class="text-2xl font-bold text-white mb-3">2. Automatizá tus ahorros</h3>
            <p class="text-green-100">Programá transferencias automáticas el día de cobro y ganá consistencia.</p>
          </article>

          <article class="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
            <h3 class="text-2xl font-bold text-white mb-3">3. Revisá y ajustá</h3>
            <p class="text-green-100">Con 15 minutos semanales podés corregir desvíos y mejorar tus números.</p>
          </article>

          <article class="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
            <h3 class="text-2xl font-bold text-white mb-3">4. Fondo de emergencia</h3>
            <p class="text-green-100">Apuntá a cubrir entre 3 y 6 meses de gastos para vivir con más tranquilidad.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="py-16 md:py-20 px-4 sm:px-8">
      <div class="mx-auto max-w-6xl text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-8 md:p-12 shadow-[0_18px_40px_rgba(16,185,129,0.35)]">
        <h2 class="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
          Empezá a controlar <span class="text-emerald-900">tus finanzas hoy</span>
        </h2>
        <p class="text-lg md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
          Construí hábitos financieros sólidos con una app clara, simple y útil en el día a día.
        </p>

        <router-link
          to="/registrarse"
          class="inline-flex items-center justify-center bg-white text-green-700 font-bold py-4 px-10 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-green-50 text-lg"
        >
          Empezá ahora
        </router-link>
      </div>
    </section>
  </main>
</template>