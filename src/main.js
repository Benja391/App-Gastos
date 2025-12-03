import './style.css';
import App from './App.vue';
import { createApp  } from 'vue';
import router from './router/router';

const app = createApp(App);

app.use(router);

app.mount('#app');

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registrado"))
      .catch((err) => console.error("Error registrando SW:", err));
  });
}
