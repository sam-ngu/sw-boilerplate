import config from "./../../config/app";
import repository from "./../../services/repository/repository";

async function handleSync(request) {
    // this happens when user is reconnected to the internet

    async function cacheRoutes(){
        const response = await fetch(config.apiHost + '/api/v1/routes', {
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            }
        })

        let result = await response.json();

        let cache = await caches.open('api-responses');
        return cache.addAll(result.data);

    }


    // run thru the api db

    const resources = config.resourcesAllowed;
    await fetch('/sanctum/csrf-cookie',{
        method: 'GET'
    })

    resources.forEach(async resourceName => {

        let resources
        try{
            resources = await repository.get(resourceName)
        }catch(err){
            console.error(err);  // could be object store not found.
            return;
        }

        let idsToRemove = [];

        // console.log({ resources });

        // idsToRemove is an array of obj
        // each obj looks like:
        /**
         * {
         *      mockId: dwadawdawa,  // this is index db id
         *      realId: 1,    // this is the actual server side id
         * }
         *
         */

        // make the request

        await Promise.all(
            resources.map(async ({ method, id, ...resource }) => {
                try {
                    let url = config.apiHost + "/api/v1/" + resourceName;
                    if (method === "PATCH") {
                        // check if resource is using real ID or mock ID
                        // if using mock id, get the real ID from idsToRemove
                        const isUuid = id.length > 30; // uuid has 36 char length

                        const realId = isUuid
                            ? idsToRemove.find(idObj => {
                                  return idObj.mockId === resource.id;
                              }).realId
                            : resource.id;

                        // if real ID is not found, throw an err
                        if (!realId) {
                            throw new Error("Id not found.");
                        }
                        url += `/${realId}`;
                    }

                    console.log({ url });

                    // pack resources to form data
                    let form = new FormData();
                    for (const key in resource) {
                        if (resource.hasOwnProperty(key)) {
                            form.set(key, resource[key]);
                        }
                    }

                    // form.forEach((val, key) => {
                    //     console.log({ val });
                    //     console.log({ key });
                    // });

                    fetch(url, {
                        mode: "cors",
                        body: form,
                        credentials: "include",
                        headers: {
                            "content-type": "multipart/form-data"
                        },
                        method: method
                    })
                        .then(res => {
                            console.log({ res });
                        })
                        .catch(err => {
                            console.log({ err });
                        });
                } catch (err) {
                    // do nothing
                }
            })
        );

        idsToRemove.forEach(idObj => {
            repository.delete(resourceName, idObj.mockId);
        });

        //
    });


    await cacheRoutes();

}

export { handleSync };
