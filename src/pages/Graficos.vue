<template>
 
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] text-white px-4 py-10 mt-8">
   
    <div class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl  border border-white/20 w-full max-w-6xl p-10 grid gap-10 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]
         hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)]
         transition-shadow duration-500">
      
    
      <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full -ml-24 -mb-24"></div>

      <div class="relative z-10">
     
        <BaseHeading >
          Tus finanzas en gráficos
        </BaseHeading>
        <p class="text-center text-gray-600 mb-8">Analizá y visualizá tus datos de manera clara</p>

       

      
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
       
          <div class="bg-gradient-to-r from-gray-50 to-green-50/30 border border-green-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-bold mb-2 text-gray-800">Gastos mensuales</h2>
            <p class="text-sm text-gray-600 mb-4">Compará cuánto gastaste en cada mes.</p>
            <BarChart :data="barChartData" :options="barChartOptions" />
          </div>

          
          <div class="bg-gradient-to-r from-gray-50 to-green-50/30 border border-green-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-bold mb-2 text-gray-800">Ahorro acumulado</h2>
            <p class="text-sm text-gray-600 mb-4">Observá cómo crecen tus ahorros mes a mes.</p>
            <LineChart :data="lineChartData" :options="lineChartOptions" />
          </div>

          
          <div class="bg-gradient-to-r from-gray-50 to-green-50/30 border border-green-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-bold mb-2 text-gray-800">Distribución por categoría</h2>
            <p class="text-sm text-gray-600 mb-4">Visualizá el porcentaje de gasto en cada categoría.</p>
            <DoughnutChart :data="doughnutChartData" :options="doughnutChartOptions" />
          </div>

  
          <div class="bg-gradient-to-r from-gray-50 to-green-50/30 border border-green-100 rounded-2xl p-8 shadow-md hover:shadow-lg transition">
            <h2 class="text-xl font-bold mb-2 text-gray-800">Porcentaje de gasto</h2>
            <p class="text-sm text-gray-600 mb-4">Desglosá tu presupuesto en porciones porcentuales.</p>
            <PieChart :data="pieChartData" :options="pieChartOptions" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-gray-50 to-green-50/30 border border-green-100 rounded-2xl p-8 shadow-md mt-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Recomendaciones</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700 text-sm">
            <li v-for="(rec, i) in recommendations" :key="i" class="hover:text-green-700 transition">
              {{ rec }}
            </li>
          </ul>
        </div>
     
          <div class="flex justify-center mt-10">
            <button
              @click="$router.push('/Reportes-Docu')"
              class="px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-md hover:bg-green-700 transition text-lg"
            >
              Descargá reportes
            </button>
          </div>
        </div>
    </div>
  </section>
</template>


  
<script>
  
import 'chart.js/auto';
 
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs';
  
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import BaseHeading from '../components/BaseHeading.vue';
  
  export default {
    name: 'Graficos',
    components: {
      BarChart: Bar,
      LineChart: Line,
      DoughnutChart: Doughnut,
      PieChart: Pie,
      BaseHeading
    },
    data() {
      return {
        gastos: [],
        initialMonthlyBudget: 0,
  
       
        barChartData:   { labels: [], datasets: [] },
        lineChartData:  { labels: [], datasets: [] },
        doughnutChartData: { labels: [], datasets: [] },
        pieChartData:   { labels: [], datasets: [] },
  
        
        barChartOptions:   { responsive: true, plugins: { legend: { position: 'top' } } },
        lineChartOptions:  { responsive: true, plugins: { legend: { position: 'top' } }, elements: { line: { tension: 0.3 } } },
        doughnutChartOptions: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const v = ctx.raw;
                  const data = ctx.dataset.data;
                  const total = data.reduce((sum, x) => sum + x, 0);
                  const pct = ((v/total)*100).toFixed(1);
                  return `${ctx.label}: $ ${v.toLocaleString()} (${pct}%)`;
                }
              }
            }
          }
        },
        pieChartOptions:   {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: ctx => {
                  const v = ctx.raw;
                  const data = ctx.dataset.data;
                  const total = data.reduce((sum, x) => sum + x, 0);
                  const pct = Math.round((v/total)*100);
                  return `${ctx.label}: $ ${Math.round(v).toLocaleString()} (${pct}%)`;
                }
              }
            }
          }
        },
  
        recommendations: []
      };
    },
    async mounted() {
      await this.fetchInitialBudget();
      await this.fetchGastos();
      this.generarGraficos();
      this.generarRecomendaciones();
    },
    methods: {
      async fetchInitialBudget() {
        const user = getAuth().currentUser;
        if (!user) return;
        const usersQ = query(collection(db, 'users'), where('uid', '==', user.uid));
        const usersSnap = await getDocs(usersQ);
        if (usersSnap.empty) return;
        const userDocId = usersSnap.docs[0].id;
        const settingsRef = doc(db, 'users', userDocId, 'settings', 'montoTotal');
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          this.initialMonthlyBudget = settingsSnap.data().initialAmount || 0;
        }
      },
  
      async fetchGastos() {
        const user = getAuth().currentUser;
        if (!user) return;
        const q = query(collection(db, 'gastos'), where('uid', '==', user.uid));
        const snap = await getDocs(q);
        this.gastos = snap.docs.map(d => {
          const { amount, category, createdAt } = d.data();
          return { amount, category, date: createdAt.toDate() };
        });
      },
  
      generarGraficos() {
        
        const byMonth = {};
        this.gastos.forEach(g => {
          const m = g.date.getMonth() + 1, y = g.date.getFullYear();
          const key = `${y}-${String(m).padStart(2,'0')}`;
          byMonth[key] = (byMonth[key]||0) + g.amount;
        });
        const months = Object.keys(byMonth).sort();
        const monthTotals = months.map(m=> byMonth[m]);
  
        this.barChartData = {
          labels: months,
          datasets: [{ label:'Gastos ARS', data: monthTotals, backgroundColor:'#42A5F5' }]
        };
  
        let cum = 0;
        const savings = monthTotals.map(val => {
          cum += val;
          return this.initialMonthlyBudget - cum;
        });
  
        this.lineChartData = {
          labels: months,
          datasets: [{ label:'Ahorros mensuales', data: savings, borderColor:'#10b981', fill:false }]
        };
  
        
        const byCat = {};
        this.gastos.forEach(g=> {
          byCat[g.category] = (byCat[g.category]||0) + g.amount;
        });
        const cats = Object.keys(byCat);
        const totals = cats.map(c=>byCat[c]);
        const colors = ['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa'];
  
        this.pieChartData = {
          labels: cats,
          datasets: [{ data: totals, backgroundColor: colors.slice(0,cats.length) }]
        };
  
        this.doughnutChartData = {
          labels: cats,
          datasets: [{ data: totals, backgroundColor: colors.slice(0,cats.length) }]
        };
      },
  
      generarRecomendaciones() {
        function formatearMesClave(clave) {
        const [anio, mes] = clave.split('-');
        const fecha = new Date(anio, mes - 1); 
        return new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(fecha);
        }
       
        this.recommendations = [];
        if (!this.gastos.length) {
          this.recommendations.push('Aún no has registrado gastos: empieza agregando tus gastos.');
          return;
        }
  
      
        const byCat = {};
        this.gastos.forEach(g => byCat[g.category] = (byCat[g.category]||0) + g.amount);
        const maxCat = Object.entries(byCat).sort((a,b)=> b[1]-a[1])[0];
        this.recommendations.push(`Has gastado más en "${ maxCat[0] }": considerá reducir esos gastos.`);
  
       
  const byMonth = {};
  this.gastos.forEach(g => {
    const key = `${g.date.getFullYear()}-${String(g.date.getMonth()+1).padStart(2,'0')}`;
    byMonth[key] = (byMonth[key] || 0) + g.amount;
  });
  const maxMonth = Object.entries(byMonth).sort((a,b)=> b[1]-a[1])[0];
  const mesFormateadoMax = formatearMesClave(maxMonth[0]);

  this.recommendations.push(`El mes ${ mesFormateadoMax } fue el más caro con $ ${ maxMonth[1].toLocaleString('es-AR') }.`);


  const months = Object.keys(byMonth).sort();
  let cum = 0, minSave = Infinity, minMonth = months[0];
  months.forEach(m => {
    cum += byMonth[m];
    const save = this.initialMonthlyBudget - cum;
    if (save < minSave) {
      minSave = save;
      minMonth = m;
    }
  });
  const mesFormateadoMin = formatearMesClave(minMonth);

  this.recommendations.push(`Revisá tus finanzas de ${ mesFormateadoMin }: tu ahorro fue de $ ${ minSave.toLocaleString('es-AR') }.`);
          this.recommendations.push('Intenta destinar al menos un 10% de tus ingresos al ahorro cada mes.');
        }
      }
    };
</script>
  
<style scoped>
  .grid { margin: 20px; }
  h2 { color: #444; margin-bottom: .5rem; }
</style>
  