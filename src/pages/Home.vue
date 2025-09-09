<template>
  <main class="bg-green-50 min-h-screen">
    <!-- HERO SECTION -->
    <section class="py-20 px-4 sm:px-8 bg-green-600 rounded-3xl shadow-2xl mx-4 mt-8 overflow-hidden">
      <div class="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <!-- Texto -->
        <div class="text-center lg:text-left max-w-2xl mb-12 lg:mb-0">
          <h1 class="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Bienvenido a
            <span class="text-4xl md:text-6xl font-bold text-black leading-tight whitespace-nowrap">GASTOS</span>
          </h1>

          <p class="text-green-100 text-xl lg:text-2xl leading-relaxed mb-8 max-w-xl">
            Transformá la manera en que manejás tu dinero. <strong>Simple</strong>, <strong>inteligente</strong> y <strong>efectivo</strong>.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <router-link
              to="/registrarse"
              class="inline-flex items-center justify-center bg-white text-green-700 font-bold py-4 px-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 group"
            >
              <span>Empezá ahora</span>
            </router-link>
          </div>
        </div>

        <!-- Mockup a la derecha -->
        <div class="flex justify-start lg:justify-start">
          <div
            class="w-52 sm:w-56 transform rotate-6 rounded-[2.5rem] border-8 border-black shadow-[0_15px_45px_rgba(0,0,0,0.3)] bg-black overflow-hidden transition-transform duration-500 hover:scale-105 hover:rotate-3"
          >
            <img
              src="/screenshot-page.png"
              alt="Mockup app"
              class="w-full h-full object-cover rounded-[2rem]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CARACTERÍSTICAS -->
    <section class="py-20 px-4 sm:px-8">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center bg-green-100 text-green-700 rounded-full px-6 py-2 mb-4">
            <span class="text-sm font-semibold">Características principales</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todo lo que necesitás para
            <span class="text-green-600">controlar tus finanzas</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Herramientas diseñadas para simplificar tu vida financiera
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Registro Fácil -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/registro-facil.png"
                alt="Registro fácil"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Registro fácil</h3>
            <p class="text-gray-600 leading-relaxed">
              Agregá tus gastos diarios de manera rápida y sencilla con categorización automática.
            </p>
          </div>

          <!-- Reportes Visuales -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/reportes.jpg"
                alt="Reportes visuales"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Reportes visuales</h3>
            <p class="text-gray-600 leading-relaxed">
              Obtené gráficos claros sobre tus hábitos de gasto y analizá tendencias.
            </p>
          </div>

          <!-- Presupuestos Personalizados -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/presupuestos.jpeg"
                alt="Presupuestos personalizados"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Presupuestos personalizados</h3>
            <p class="text-gray-600 leading-relaxed">
              Definí y controlá tus presupuestos mensuales con alertas inteligentes.
            </p>
          </div>

          <!-- Personalización -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/personalizacion-personal.jpg"
                alt="Personalización"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Personalización</h3>
            <p class="text-gray-600 leading-relaxed">
              Adaptá las categorías de gastos según tus necesidades específicas.
            </p>
          </div>

          <!-- Interfaz Amigable -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/interfaz-amigable.jpg"
                alt="Interfaz amigable"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Interfaz amigable</h3>
            <p class="text-gray-600 leading-relaxed">
              Disfrutá de una experiencia intuitiva y sin complicaciones.
            </p>
          </div>

          <!-- Reportes Simples -->
          <div class="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div class="relative overflow-hidden rounded-2xl mb-6">
              <img
                src="/reportes-simples.jpg"
                alt="Reportes simples"
                class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">Reportes simples</h3>
            <p class="text-gray-600 leading-relaxed">
              Revisá tus reportes de gastos con un solo clic y obtené insights valiosos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="py-20 px-4 sm:px-8 bg-gray-50">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center bg-green-100 text-green-700 rounded-full px-6 py-2 mb-4">
            <span class="text-sm font-semibold">Testimonios</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros <span class="text-green-600">usuarios</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Testimonio 1 -->
          <div class="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="flex text-yellow-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
            <blockquote class="text-gray-700 text-lg leading-relaxed mb-6">
              "GASTOS me ayudó a cambiar completamente la forma en que manejo mi dinero. Antes solía perder el control fácilmente y nunca sabía exactamente en qué estaba gastando."
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-uno-uno.jpg" alt="Mariana López" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <div class="font-semibold text-gray-900">Mariana López</div>
                <div class="text-sm text-gray-500">Diseñadora gráfica</div>
              </div>
            </div>
          </div>

          <!-- Testimonio 2 -->
          <div class="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="flex text-yellow-400">
                <!-- estrellas (omitidas por brevedad, mismas que arriba) -->
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049..."/></svg>
              </div>
            </div>
            <blockquote class="text-gray-700 text-lg leading-relaxed mb-6">
              "Como analista financiero, siempre busco herramientas que sean prácticas y confiables. Los reportes visuales me permiten analizar mis hábitos de consumo."
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-tres-tres.jpg" alt="Carlos García" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <div class="font-semibold text-gray-900">Carlos García</div>
                <div class="text-sm text-gray-500">Analista financiero</div>
              </div>
            </div>
          </div>

          <!-- Testimonio 3 -->
          <div class="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="flex text-yellow-400">
                <!-- estrellas (omitidas por brevedad, mismas que arriba) -->
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049..."/></svg>
              </div>
            </div>
            <blockquote class="text-gray-700 text-lg leading-relaxed mb-6">
              "Para mí, GASTOS es mucho más que una app. Es un sistema que me permitió llevar un control detallado de las finanzas de mi hogar."
            </blockquote>
            <div class="flex items-center">
              <img src="/testimonio-dos-dos.jpg" alt="Paola Mendoza" class="w-12 h-12 rounded-full object-cover mr-4">
              <div>
                <div class="font-semibold text-gray-900">Paola Mendoza</div>
                <div class="text-sm text-gray-500">Madre y emprendedora</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONSEJOS -->
    <section class="py-20 px-4 sm:px-8 bg-green-800">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center bg-green-700 text-green-200 rounded-full px-6 py-2 mb-4">
            <span class="text-sm font-semibold">Tips financieros</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">
            Consejos para <span class="text-green-300">maximizar tus ahorros</span>
          </h2>
          <p class="text-xl text-green-200 max-w-2xl mx-auto">
            Estrategias simples que te van a ayudar a construir un futuro financiero sólido
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">1</span>
              </div>
              <h3 class="text-2xl font-bold text-white">Regla del 50/30/20</h3>
            </div>
            <p class="text-green-100 leading-relaxed">
              Destiná 50% a necesidades, 30% a gustos y 20% a ahorros. Esta fórmula simple te garantiza equilibrio financiero.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">2</span>
              </div>
              <h3 class="text-2xl font-bold text-white">Automatizá tus ahorros</h3>
            </div>
            <p class="text-green-100 leading-relaxed">
              Configurá transferencias automáticas el día que cobrás. Si no lo ves, no lo gastás.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">3</span>
              </div>
              <h3 class="text-2xl font-bold text-white">Revisá y ajustá</h3>
            </div>
            <p class="text-green-100 leading-relaxed">
              Dedicá 15 minutos semanales a revisar tus gastos. Los pequeños ajustes generan grandes resultados.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">4</span>
              </div>
              <h3 class="text-2xl font-bold text-white">Fondo de emergencia</h3>
            </div>
            <p class="text-green-100 leading-relaxed">
              Construí un fondo que cubra 3-6 meses de gastos. Tu tranquilidad no tiene precio.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-20 px-4 sm:px-8 bg-green-600 mx-4 mb-4 rounded-3xl mt-8">
      <div class="container mx-auto text-center">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Empezá a controlar
            <span class="text-green-800">tus finanzas hoy</span>
          </h2>
          <p class="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed">
            Transformá tu relación con el dinero y construí el futuro que deseás
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/registrarse"
              class="inline-flex items-center justify-center bg-white text-green-700 font-bold py-4 px-10 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 text-lg"
            >
              Empezá ahora
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
