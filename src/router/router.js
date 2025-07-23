import { createRouter, createWebHashHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from "../pages/Register.vue";
import CargarGasto from "../pages/Cargar-Gasto.vue";
import MontoTotal from "../pages/Monto-Total.vue";
import Presupuestos from "../pages/Presupuestos.vue";
 import MiPerfil from "../pages/Mi-Perfil.vue";
import CalendarioPagos from "../pages/Calendario-Pagos.vue";
import ConfiguracionTarjeta from "../components/ConfiguracionTarjeta.vue";
import HistorialGastos from "../pages/Historial-Gastos.vue";
import Graficos from "../pages/Graficos.vue";


const routes = [ 
    { path: '/',               component: Home },
    { path: '/Iniciar-sesion', component: Login },
    { path: '/Registrarse',    component: Register },  
    { path: '/Monto-Total',    component: MontoTotal,  meta:{ requiresAuth: true }},
    { path: '/Cargar-Gasto',   component: CargarGasto,  meta:{ requiresAuth: true }},
    { path: '/Presupuestos',   component: Presupuestos, meta:{ requiresAuth: true }},
    { path: '/Mi-Perfil',      component: MiPerfil, meta:{ requiresAuth: true }},
    { path: '/Calendario-Pagos', component: CalendarioPagos, meta:{ requiresAuth: true }},
    { path: '/Configuracion-Tarjeta', component: ConfiguracionTarjeta, meta:{ requiresAuth: true }},
    { path: '/Historial-Gastos', component: HistorialGastos, meta:{ requiresAuth: true }},
    { path: '/Graficos', component: Graficos, meta:{ requiresAuth: true }},
   
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});


function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
}


router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const user = await getCurrentUser();
        if (user) {
            next();
        } else {
            next({ 
                path: '/Iniciar-sesion', 
                query: { mensaje: 'Debes iniciar sesión para acceder a esta sección' } 
            });
        }
    } else {
        next();
    }
});

export default router;
