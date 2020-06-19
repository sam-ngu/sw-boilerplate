// import registerRoutes from "./routes/routes";
// import { precacheAndRoute } from "workbox-precaching";

import install from "./services/install/install";
// import axios from 'axios'
// import _ from 'lodash'


// self._ = _
// self.axios = axios

// self.axios.defaults.withCredentials = true;

// self.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// workbox.precaching.precacheAndRoute(self.__precacheManifest);
// precacheAndRoute(self.__precacheManifest);

console.log("hello from sw");

install();

// self.addEventListener('sync', event => {
//     if(event.tag === 'sync-service-forms'){
//         event.waitUntil(syncServiceForms())
//     }
// })

// self.__WB_MANIFEST;

addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        skipWaiting();
    }
});



