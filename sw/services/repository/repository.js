import store from './../db/db'


export default {
    //https://www.monterail.com/blog/pwa-offline-dynamic-data
    async saveToOffline(event, toMerge = {}) {
        const url = new URL(event.request.url)
        const resourceName = url.pathname.split("/").slice(3, 4)[0];
        const request = event.request;
        const body = await request.formData()

        for (let key in toMerge){
            body.set(key, toMerge[key])
        }
        
        return store.save(resourceName, body, request.method);
    },

    async create(event) {
        return fetch(event.request).catch(async (err) => {
            // save to db
            this.saveToOffline(event);
            throw err;
        });
    },

    async get(resourceName){
        return store.getAll(resourceName);
    },

    async delete(resourceName, resourceId){
        return store.delete(resourceName, resourceId);
    }
};