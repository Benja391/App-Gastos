<template>
    <div class="min-h-screen bg-gray-700 flex flex-col items-center py-10 px-4">
      <div class="w-full max-w-4xl bg-green-200 shadow-lg rounded-xl p-6 mx-auto">
        <h2 class="text-2xl font-semibold mb-4 text-center">Tus finanzas en gráficos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-200">
         
            <div>
              <h2 class="font-semibold text-xl mb-1">Gastos mensuales</h2>
              <p class="text-sm text-gray-600 mb-4">Compara cuánto gastaste en cada mes.</p>
              <BarChart :data="barChartData" :options="barChartOptions" />
            </div>

          
            <div>
              <h2 class="font-semibold text-xl mb-1">Ahorro acumulado</h2>
              <p class="text-sm text-gray-600 mb-4">Observa cómo crecen tus ahorros mes a mes.</p>
              <LineChart :data="lineChartData" :options="lineChartOptions" />
            </div>

           
            <div>
              <h2 class="font-semibold text-xl mb-1">Distribución por categoría</h2>
              <p class="text-sm text-gray-600 mb-4">Visualiza el porcentaje de gasto en cada categoría.</p>
              <DoughnutChart :data="doughnutChartData" :options="doughnutChartOptions" />
            </div>

          
            <div>
              <h2 class="font-semibold text-xl mb-1">Porcentaje de gasto</h2>
              <p class="text-sm text-gray-600 mb-4">Desglose de tu presupuesto en porciones porcentuales.</p>
              <PieChart :data="pieChartData" :options="pieChartOptions" />
            </div>
        </div>
  
       
        <div class="mt-8 bg-white rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-2">Recomendaciones</h3>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(rec, i) in recommendations" :key="i" class="text-gray-800">
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
  
  export default {
    name: 'Graficos',
    components: {
      BarChart: Bar,
      LineChart: Line,
      DoughnutChart: Doughnut,
      PieChart: Pie
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
  