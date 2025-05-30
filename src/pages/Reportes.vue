<template>
    <section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div class="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold mb-6">Reportes</h1>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
         
          <div>
            <h2 class="text-lg font-semibold mb-4">Gráfico de Barras</h2>
            <ChartComponent :chartData="barChartData" :chartOptions="chartOptions" />
          </div>
  
        
          <div>
            <h2 class="text-lg font-semibold mb-4">Gráfico de Líneas</h2>
            <ChartComponent :chartData="lineChartData" :chartOptions="chartOptions" />
          </div>
  
         
          <div>
            <h2 class="text-lg font-semibold mb-4">Gráfico de Torta</h2>
            <ChartComponent :chartData="pieChartData" :chartOptions="chartOptions" />
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import ChartComponent from "../components/ChartComponent.vue";
  
  export default {
    name: "Reportes",
    components: { ChartComponent },
    data() {
      return {
        
        barChartData: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
          datasets: [
            {
              label: "Ingresos",
              backgroundColor: "#4CAF50",
              data: [5000, 7000, 8000, 5500, 9000],
            },
            {
              label: "Gastos",
              backgroundColor: "#F44336",
              data: [3000, 4000, 3500, 4500, 5000],
            },
          ],
        },
  
        
        lineChartData: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
          datasets: [
            {
              label: "Balance Mensual",
              borderColor: "#2196F3",
              data: [2000, 3000, 4500, 1000, 4000],
              fill: false,
            },
          ],
        },
  
       
        pieChartData: {
          labels: ["Alquiler", "Comida", "Transporte", "Ocio"],
          datasets: [
            {
              data: [40, 30, 20, 10],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
            },
          ],
        },
  
       
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      };
    },
  };
  </script>
  