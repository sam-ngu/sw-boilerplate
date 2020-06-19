


const cacheableUrls = {
    // get: {
    //     "/api/v1/chambers",
    // },

    post: {
        "/api/v1/chambers": createChamber,
        "/api/v1/service-answers": createServiceAnswer
    },

    patch: {
        "/api/v1/chambers": updateChamber
    },

    delete: []
};

function shouldCache(event) {

    
    const requestMethod = event.request.method.toLowerCase()
    const validMethod = cacheableUrls.hasOwnProperty(requestMethod);

    if(!validMethod){
        return false;
    }

    return cacheableUrls[requestMethod].includes(event.url.pathname)

}


self.addEventListener('fetch', (event) => {
    
    if(!shouldCache(event)){
        return
    }



})