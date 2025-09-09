<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  
  
  Chart.register(...registerables);
  
  export default {
    name: "ChartComponent",
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'bar', 
          data: this.chartData,
          options: this.chartOptions,
        });
      },
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    height: auto;
  }
  </style>
  