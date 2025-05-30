<template>
  <main class=" bg-green-50 min-h-screen">
   
   <section class="py-16 px-8 bg-gradient-to-r from-green-800 via-green-700 to-green-800 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center md:justify-between overflow-hidden relative">


<div class="absolute inset-0 bg-green-900 opacity-30 blur-sm"></div>


<div class="relative z-10 text-center md:text-left max-w-xl">
  <h1 class="text-4xl md:text-6xl font-robotobold text-white leading-tight  whitespace-nowrap">
    Bienvenido a <span class="text-black">GASTOS</span>
  </h1>
  <p class="text-green-200 mt-6 text-lg md:text-xl leading-relaxed">
    La forma más fácil, rápida y eficiente de gestionar tus finanzas personales.
  </p>
  <div class="mt-8">
    <router-link
      to="/registrarse"
      class="inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
    >
      Comienza Ahora
    </router-link>
  </div>
</div>


<div class="relative mt-10 md:mt-0 md:w-1/2 flex justify-center z-10">
  <img
    src="/imagen-primera.jpg"
    alt="Gestión de Finanzas"
    class="w-4/5 md:w-full max-w-md rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:rotate-1"
  />
</div>

</section>


<section class="space-y-10">
<h2 class="text-3xl font-bold text-green-800 text-center mt-5">Características</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 
  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/registro-facil.png" alt="Registro Fácil" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Registro Fácil</h3>
    <p class="text-green-700 mt-2">
      Agrega tus gastos diarios de manera rápida y sencilla.
    </p>
  </div>

 
  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/reportes.jpg" alt="Reportes Visuales" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Reportes Visuales</h3>
    <p class="text-green-700 mt-2">
      Obtén gráficos claros sobre tus hábitos de gasto.
    </p>
  </div>

  
  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/presupuestos.jpeg" alt="Presupuestos Personalizados" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Presupuestos Personalizados</h3>
    <p class="text-green-700 mt-2">
      Define y controla tus presupuestos mensuales.
    </p>
  </div>

 
  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/personalizacion-personal.jpg" alt="Personalización" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Personalización</h3>
    <p class="text-green-700 mt-2">
      Adapta las categorías de gastos según tus necesidades.
    </p>
  </div>


  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/interfaz-amigable.jpg" alt="Interfaz Amigable" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Interfaz Amigable</h3>
    <p class="text-green-700 mt-2">
      Disfruta de una experiencia intuitiva y sin complicaciones.
    </p>
  </div>

  
  <div class="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-green-400/50">
    <img src="/reportes-simples.jpg" alt="Reportes Simples" class="w-60 h-40 mx-auto mb-4 rounded-md shadow-md" />
    <h3 class="text-xl font-semibold text-green-800">Reportes Simples</h3>
    <p class="text-green-700 mt-2">
      Revisa tus reportes de gastos con un solo clic.
    </p>
  </div>
</div>
</section>


   
<section class="space-y-10 bg-gray-50 py-12 px-6">
<h2 class="text-3xl font-bold text-green-800 text-center">Testimonios de nuestros usuarios</h2>
<div class="space-y-10">
  
  <div class="flex flex-col md:flex-row items-center md:items-start bg-white p-6 rounded-lg shadow-md">
   
    <div class="flex-shrink-0 w-full md:w-1/3 mb-6 md:mb-0">
      <img
        src="/testimonio-uno-uno.jpg"
        alt="Usuario feliz"
        class="rounded-lg shadow-md object-cover h-48 w-full"
      />
    </div>
  
    <div class="md:w-2/3 md:pl-6 text-center md:text-left">
      <p class="text-green-700 text-lg italic leading-relaxed">
        " <strong>GASTOS</strong>  me ayudó a cambiar completamente la forma en que manejo mi dinero. Antes solía perder el control fácilmente 
        y nunca sabía exactamente en qué estaba gastando. Desde que uso la app, tengo un registro claro de mis ingresos 
        y gastos, y eso me ha permitido ahorrar para cosas importantes como mis estudios y viajes. ¡Realmente la recomiendo!".
      </p>
      <h3 class="text-green-800 font-bold mt-4">Mariana López</h3>
      <p class="text-sm text-green-600">Diseñadora Gráfica</p>
    </div>
  </div>


  <div class="flex flex-col md:flex-row-reverse items-center md:items-start bg-green-50 p-6 rounded-lg shadow-md">
  
    <div class="flex-shrink-0 w-full md:w-1/3 mb-6 md:mb-0">
      <img
        src="/testimonio-tres-tres.jpg"
        alt="Usuario sonriente"
        class="rounded-lg shadow-md object-cover h-48 w-full"
      />
    </div>
 
    <div class="md:w-2/3 md:pr-6 text-center md:text-left">
      <p class="text-green-700 text-lg italic leading-relaxed">
        "Como analista financiero, siempre busco herramientas que sean prácticas y confiables. Con <strong>GASTOS</strong>, no solo 
        puedo registrar mis gastos diarios, sino que también obtengo reportes visuales que me permiten analizar mis 
        hábitos de consumo. Es una herramienta imprescindible para cualquier persona que quiera organizar sus finanzas 
        de manera eficiente. Además, la interfaz es muy amigable y fácil de usar."
      </p>
      <h3 class="text-green-800 font-bold mt-4">Carlos García</h3>
      <p class="text-sm text-green-600">Analista Financiero</p>
    </div>
  </div>

  
  <div class="flex flex-col md:flex-row items-center md:items-start bg-white p-6 rounded-lg shadow-md">
   
    <div class="flex-shrink-0 w-full md:w-1/3 mb-6 md:mb-0">
      <img
        src="/testimonio-dos-dos.jpg"
        alt="Usuario satisfecho"
        class="rounded-lg shadow-md object-cover h-48 w-full"
      />
    </div>
 
    <div class="md:w-2/3 md:pl-6 text-center md:text-left">
      <p class="text-green-700 text-lg italic leading-relaxed">
        "Para mí, <strong>GASTOS</strong>  es mucho más que una app. Es un sistema que me ha permitido llevar un control detallado 
        de las finanzas de mi hogar. Antes solía olvidar en qué gastábamos y terminábamos con deudas. Ahora, con cada 
        gasto registrado y las alertas de presupuesto, me siento mucho más tranquilo y organizado. ¡Definitivamente cambiará 
        la forma en que manejas tu dinero!".
      </p>
      <h3 class="text-green-800 font-bold mt-4">Paola Mendoza</h3>
      <p class="text-sm text-green-600">Madre y Emprendedora</p>
    </div>
  </div>
</div>


<section class="space-y-12 bg-gray-100 py-16 px-8">
  <h2 class="text-4xl font-bold text-green-900 text-center mb-8">Consejos para tus finanzas</h2>
  <div class="space-y-8">
  
    <div class="flex items-start bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
      <div class="flex-shrink-0 w-14 h-14 bg-green-800 text-white rounded-full flex items-center justify-center text-xl font-bold">
        1
      </div>
      <div class="ml-8">
        <h3 class="text-2xl font-semibold text-green-800">Define un Presupuesto</h3>
        <p class="text-green-700 mt-3">
          Establece un presupuesto mensual para saber cuánto puedes gastar y cuánto necesitas ahorrar.
        </p>
      </div>
    </div>

   
    <div class="flex items-start bg-green-50 p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
      <div class="flex-shrink-0 w-14 h-14 bg-green-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
        2
      </div>
      <div class="ml-8">
        <h3 class="text-2xl font-semibold text-green-800">Ahorra Consistentemente</h3>
        <p class="text-green-700 mt-3">
          Reserva una parte de tus ingresos para el ahorro, aunque sea un porcentaje pequeño.
        </p>
      </div>
    </div>

  
    <div class="flex items-start bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
      <div class="flex-shrink-0 w-14 h-14 bg-green-800 text-white rounded-full flex items-center justify-center text-xl font-bold">
        3
      </div>
      <div class="ml-8">
        <h3 class="text-2xl font-semibold text-green-800">Evita Gastos Innecesarios</h3>
        <p class="text-green-700 mt-3">
          Piensa dos veces antes de hacer compras impulsivas y prioriza lo esencial.
        </p>
      </div>
    </div>

    
    <div class="flex items-start bg-green-50 p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
      <div class="flex-shrink-0 w-14 h-14 bg-green-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
        4
      </div>
      <div class="ml-8">
        <h3 class="text-2xl font-semibold text-green-800">Invierte en tu Futuro</h3>
        <p class="text-green-700 mt-3">
          Considera invertir en fondos o activos para hacer crecer tu dinero con el tiempo.
        </p>
      </div>
    </div>
  </div>
</section>



<section class="relative py-16 px-6 bg-green-800 overflow-hidden rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center">
  
  
  <div class="absolute inset-0 bg-green-900 opacity-20 blur-md"></div>


  <div class="relative max-w-2xl">
    <h2 class="text-4xl md:text-5xl font-extrabold text-white leading-tight">
      Comienza a <span class="text-green-300">Controlar tus Finanzas</span> Hoy
    </h2>
    <p class="text-green-100 mt-6 text-lg md:text-xl">
      Únete a miles de usuarios satisfechos. ¡Es gratis, fácil de usar y pensado para vos!
    </p>
    <div class="mt-8">
      <router-link
        to="/registrarse"
        class="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-100"
      >
        Regístrate Ahora
      </router-link>
    </div>
  </div>

</section>

</section>


  </main>
</template>



