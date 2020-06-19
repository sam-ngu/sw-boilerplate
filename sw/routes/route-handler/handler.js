import repository from "../../services/repository/repository";
import { v4 as uuidv4 } from "uuid";

function handlePostAndPut(request) {
    let requestCloned = request.clone(); // need to clone request because request body can only be read once

    // perform network
    return fetch(request).catch(async error => {
        // if fail
        // 1. cache in db
        // 2. cache should return a dummy UUID
        console.log("saving to post offline");
        let saved = await repository.saveToOffline(
            {
                request: requestCloned
            },
            {
                id: uuidv4()
            }
        );
        return new Response(JSON.stringify(saved));
    });
}

function handlePatch(request) {
    let requestCloned = request.clone(); // need to clone request because request body can only be read once

    // perform network
    return fetch(request).catch(async error => {
        // if fail === no network ?
        // 1. cache in db
        // get patch id
        let url = new URL(request.url)

        let id = url.pathname.split('/')[4]

        console.log("saving patch to offline");
        let saved = await repository.saveToOffline(
            {
                request: requestCloned
            },
            {
                id: id,
            });
        return new Response(JSON.stringify(saved));
    });
}

export { handlePostAndPut, handlePatch };
