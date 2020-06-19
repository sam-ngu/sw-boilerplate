import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies/StaleWhileRevalidate";
import appConfig from "./../config/app";
import {handlePostAndPut, handlePatch} from './route-handler/handler'
import {handleSync} from './route-handler/sync'



export default function() {
    // post and patch request to cache
    // 1. service
    // 2. service answer
    // 3. Site notes
    //

    // only select a few POST request

    // service patch
    self.addEventListener("fetch", async event => {
        // event.preventDefault()

        const request = event.request;

        const url = new URL(request.url);

        const isPatch = request.method.toUpperCase() === "PATCH";
        const isPost = request.method.toUpperCase() === "POST";
        const isPut = request.method.toUpperCase() === "PUT";
        const fromApp = url.origin === appConfig.apiHost;

        const isServicePatchRequest =
            isPatch && fromApp && url.pathname.startsWith("/api/v1/services");
        const isServicePostRequest =
            isPost && fromApp && url.pathname.startsWith("/api/v1/services");

        const isSyncPostRequest =
            isPost && fromApp && url.pathname.startsWith("/api/v1/sync");

        const isServiceAnswerPutRequest = isPut && fromApp && url.pathname.startsWith("/api/v1/service-answers")


        // console.log('caching fetch');
        if (isServicePostRequest || isServiceAnswerPutRequest) {
            return event.respondWith(handlePostAndPut(request));
        }

        if (isServicePatchRequest) {
            return event.respondWith(handlePatch(request));
        }

        if(isSyncPostRequest){
            return event.respondWith(handleSync(request))
        }




    });
    // registerRoute(
    //     ({url, request, event}) => {
    //         console.log('from service patch match');
    //         console.log(url);
    //         return request.method === 'PATCH' &&
    //             url.origin === appConfig.apiHost &&
    //             url.pathname.startsWith("/api/v1/services")
    //     },
    //     ({url, request, event, params}) => {
    //         console.log({params});
    //         console.log({url});
    //         console.log({request});
    //         console.log({event});
    //         // url = new URL(url)
    //     }
    // )

    //
    let cacheFirst = ["pdf"];

    // other request send error

    // all api GET requests
    registerRoute(
        // new RegExp(appConfig.apiHost + '/api/v1/.+'),
        // /https:\/\/minearc\.dev\.local\/api\/v1\/hello/,

        ({ url, request }) => {
            // return shouldCache(url, request);
            console.log({ url });
            console.log({ appConfig });
            console.log({ request });
            return (
                url.origin === appConfig.apiHost &&
                url.pathname.startsWith("/api/v1") &&
                request.method === "GET"
            );
        },
        new StaleWhileRevalidate({
            cacheName: "api-responses",
            plugins: [
                // new CacheableResponsePlugin({
                //     statuses: [200, 404],
                //     // headers: {
                //     //     'X-Is-Cacheable': 'true', // only cache if backend wants it to be cachable?
                //     // }
                // })
            ]
        })
    );
}
