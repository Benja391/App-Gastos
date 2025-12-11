<template>
  <section class="flex items-center justify-center min-h-screen bg-[#08a04b] px-4 py-10 mt-8">
    <div
      class="relative bg-white/95 backdrop-blur-sm text-gray-900 rounded-3xl border border-white/20 
             w-full max-w-5xl p-8 grid gap-8 mt-1 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]
             hover:shadow-[0_12px_45px_rgba(0,0,0,0.45)] transition-shadow duration-500">

     
      <BaseHeading>Reportes</BaseHeading>
      <p class="text-center text-gray-600 mb-6">Generá reportes detallados con tus datos reales</p>

 
      <transition name="fade">
        <div
          v-if="mensaje"
          class="p-4 rounded-2xl font-medium border-l-4 shadow-sm mb-6 text-center"
          :class="mensajeClass"
        >
          {{ mensaje }}
        </div>
      </transition>

     
      <div v-if="loading" class="flex justify-center items-center my-6">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-green-200"></div>
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 absolute"></div>
      </div>

     
      <div v-else class="space-y-6">
        <div
          v-for="reporte in reportesDisponibles"
          :key="reporte.id"
          class="bg-gradient-to-r from-gray-50 to-green-50/30 p-6 rounded-2xl shadow-lg border border-gray-100 
                 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
        >
          <div>
            <h3 class="text-lg font-bold text-gray-800">{{ reporte.nombre }}</h3>
            <p class="text-sm text-gray-500">{{ reporte.descripcion }}</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="descargarExcel(reporte.id)"
              class="px-4 py-2 bg-green-600 text-white text-sm rounded-xl shadow hover:bg-green-700 transition"
            >
              Descargar Excel
            </button>
            <button
              @click="descargarWord(reporte.id)"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl shadow hover:bg-blue-700 transition"
            >
              Descargar Word
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import BaseHeading from "../components/BaseHeading.vue";

export default {
  name: "ReportesDocu",
  components: { BaseHeading },
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const user = ref(null);

    const gastos = ref([]);
    const presupuestos = ref([]);
    const settings = ref(null);
    const loading = ref(false);

    
    const mensaje = ref("");
    const mensajeClass = ref("");

    const mostrarMensaje = (texto, tipo = "success") => {
      mensaje.value = texto;
      if (tipo === "success") {
        mensajeClass.value =
          "bg-green-100 border-green-400 text-green-700 border";
      } else if (tipo === "error") {
        mensajeClass.value =
          "bg-red-100 border-red-400 text-red-700 border";
      } else if (tipo === "warning") {
        mensajeClass.value =
          "bg-yellow-100 border-yellow-400 text-yellow-700 border";
      }
      setTimeout(() => (mensaje.value = ""), 3500);
    };

    const reportesDisponibles = ref([
      { id: "gastos", nombre: "Reporte de Gastos", descripcion: "Listado detallado de tus gastos registrados." },
      { id: "presupuestos", nombre: "Reporte de Presupuestos", descripcion: "Detalle de tus presupuestos creados." },
      { id: "settings", nombre: "Reporte de Saldos", descripcion: "Saldo inicial y adicionales guardados." },
    ]);

   
    const cargarDatos = async () => {
      if (!user.value) return;
      loading.value = true;

      try {
        const gastosSnap = await getDocs(query(collection(db, "gastos"), where("uid", "==", user.value.uid)));
        gastos.value = gastosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const presupuestosSnap = await getDocs(query(collection(db, "Presupuestos"), where("uid", "==", user.value.uid)));
        presupuestos.value = presupuestosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const qUsers = query(collection(db, "users"), where("uid", "==", user.value.uid));
        const snapUsers = await getDocs(qUsers);

        if (!snapUsers.empty) {
          const userDocId = snapUsers.docs[0].id;
          const montoRef = doc(db, "users", userDocId, "settings", "montoTotal");
          const montoSnap = await getDoc(montoRef);
          settings.value = montoSnap.exists() ? { id: "montoTotal", ...montoSnap.data() } : null;
        }
      } catch (e) {
        mostrarMensaje("Error al cargar los datos de Firestore", "error");
      }

      loading.value = false;
    };

  
    const descargarExcel = (id) => {
      let data = [];
      let nombre = "";

      if (id === "gastos") {
        data = gastos.value;
        nombre = "Gastos";
      }
      if (id === "presupuestos") {
        data = presupuestos.value;
        nombre = "Presupuestos";
      }
      if (id === "settings" && settings.value) {
        data = [
          {
            SaldoInicial: settings.value.initialAmount,
            SaldoRestante: settings.value.remainingAmount,
            Adicionales: settings.value.additionalAmounts
              ?.map((a) => `${a.description}: ${a.amount}`)
              .join(", "),
          },
        ];
        nombre = "Saldos";
      }

      if (!data || data.length === 0) {
        mostrarMensaje(`No hay datos en el reporte de ${nombre}`, "warning");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, id);
      XLSX.writeFile(wb, `${id}_reporte.xlsx`);
      mostrarMensaje(`Reporte de ${nombre} descargado en Excel`, "success");
    };

    const descargarWord = async (id) => {
      let contenido = [];
      let nombre = "";

      if (id === "gastos") {
        contenido = gastos.value.map(
          (g) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${g.name}: `, bold: true }),
                new TextRun(`$${g.amount} (${g.category})`),
              ],
            })
        );
        nombre = "Gastos";
      }

      if (id === "presupuestos") {
        contenido = presupuestos.value.map(
          (p) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${p.name}: `, bold: true }),
                new TextRun(`$${p.amount}`),
              ],
            })
        );
        nombre = "Presupuestos";
      }

      if (id === "settings" && settings.value) {
        contenido = [
          new Paragraph({
            children: [
              new TextRun({ text: "Saldo inicial: ", bold: true }),
              new TextRun(`$${settings.value.initialAmount}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Saldo restante: ", bold: true }),
              new TextRun(`$${settings.value.remainingAmount}`),
            ],
          }),
          ...(settings.value.additionalAmounts?.map(
            (a) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${a.description}: `, bold: true }),
                  new TextRun(`$${a.amount}`),
                ],
              })
          ) || []),
        ];
        nombre = "Saldos";
      }

      if (!contenido.length) {
        mostrarMensaje(`No hay datos en el reporte de ${nombre}`, "warning");
        return;
      }

      const docFile = new Document({
        sections: [{ properties: {}, children: contenido }],
      });

      const buffer = await Packer.toBlob(docFile);
      saveAs(buffer, `${id}_reporte.docx`);
      mostrarMensaje(`Reporte de ${nombre} descargado en Word`, "success");
    };

    
    onMounted(() => {
      auth.onAuthStateChanged(async (u) => {
        if (u) {
          user.value = u;
          await cargarDatos();
        }
      });
    });

    return {
      reportesDisponibles,
      gastos,
      presupuestos,
      settings,
      descargarExcel,
      descargarWord,
      loading,
      mensaje,
      mensajeClass,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
