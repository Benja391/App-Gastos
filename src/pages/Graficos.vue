<template>
<div class="min-h-screen bg-[#08a04b] flex flex-col items-center py-10 px-4 text-gray-900 mt-8">
  <div class="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-10 grid gap-8 mt-2">

      <!-- Encabezado -->
      <BaseHeading>
        Tus finanzas en gráficos
      </BaseHeading>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <!-- Gráfico de barras -->
        <div class="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Gastos mensuales</h2>
          <p class="text-sm text-gray-600 mb-4">Compara cuánto gastaste en cada mes.</p>
          <BarChart :data="barChartData" :options="barChartOptions" />
        </div>

        <!-- Gráfico de línea -->
        <div class="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Ahorro acumulado</h2>
          <p class="text-sm text-gray-600 mb-4">Observa cómo crecen tus ahorros mes a mes.</p>
          <LineChart :data="lineChartData" :options="lineChartOptions" />
        </div>

        <!-- Gráfico de doughnut -->
        <div class="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Distribución por categoría</h2>
          <p class="text-sm text-gray-600 mb-4">Visualiza el porcentaje de gasto en cada categoría.</p>
          <DoughnutChart :data="doughnutChartData" :options="doughnutChartOptions" />
        </div>

        <!-- Gráfico de pie -->
        <div class="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Porcentaje de gasto</h2>
          <p class="text-sm text-gray-600 mb-4">Desglose de tu presupuesto en porciones porcentuales.</p>
          <PieChart :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>

      <!-- Recomendaciones -->
      <div class="bg-green-50 border border-green-100 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-bold mb-3 text-gray-800">Recomendaciones</h3>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-800">
          <li v-for="(rec, i) in recommendations" :key="i">
            {{ rec }}
          </li>
        </ul>
      </div>
    </div>
  </div>
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
  