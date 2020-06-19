import config from '../../config/app';

export default {
    getDb(name, resourceName) {
        // let db;
        // returns a index db request

        return new Promise(function(resolve, reject) {
            const request = indexedDB.open(name, 1);

            request.onupgradeneeded = function(e) {
                const db = request.result;

                config.resourcesAllowed.forEach(function(resource){
                    try {
                        db.createObjectStore(resource + "ToSync", {
                            keyPath: "id"
                        });
                    } catch (err) {
                        // most likely store already exist
                        console.log(err);
                    }
                })

                // db.createObjectStore(resourceName + "ToSync", {
                //     keyPath: "id"
                // });
            };

            request.onsuccess = function(event) {
                const db = request.result;



                resolve(db); // resolve the index db instance
            };

            request.onerror = function(event) {
                reject("error connecting to index db");
            };
        });

        // request.onerror = function(event) {
        //     console.log({event});
        //     console.log("Why didn't you allow my web app to use IndexedDB?!");
        // };
        // request.onsuccess = function(event) {
        //     db = event.target.result;
        // };
        // return db;
    },
    async delete(resourceName, resourceId) {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDb("api", resourceName);

            const storeName = resourceName + "ToSync";

            let transaction;
            try{
                transaction = db.transaction([storeName], "readwrite");
            }catch(err){
                return reject(err);
            }

            // let transaction = db.transaction([storeName], "readwrite");

            transaction.oncomplete = function() {
                resolve();
            }
            transaction.onerror = function(err){
                reject(err)
            }

            transaction.objectStore(storeName).delete(resourceId)

            // await transaction.done;
        })
    },

    async getAll(resourceName) {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDb("api", resourceName);

            const storeName = resourceName + "ToSync";

            let transaction;
            try{
                transaction = db.transaction([storeName], "readwrite");
            }catch(err){
                return reject(err)
            }

            transaction.onerror = function(event) {
                reject(transaction.error);
            };

            let dbRequest = transaction.objectStore(storeName).getAll();

            transaction.oncomplete = function(event) {
                console.log(
                    "index db transaction completed. read offline data from cache."
                );
                resolve(dbRequest.result);
            };



            // await transaction.done
        });
    },



    // method is either POST or PUT or Patch
    async save(resourceName, data, method) {
        return new Promise(
            async function(resolve, reject) {
                const db = await this.getDb("api", resourceName);

                const storeName = resourceName + "ToSync";

                let transaction;
                try{
                    transaction = db.transaction([storeName], "readwrite");
                }catch(err){
                    //if(err === )
                    return reject(err)
                }


                transaction.oncomplete = function(event) {
                    console.log(
                        "index db transaction completed. stored offline data in cache."
                    );
                    resolve(data);
                };

                transaction.onerror = function(err) {
                    reject(err);
                };

                const store = transaction.objectStore(storeName);

                // if data is form data unpack it
                if (data instanceof FormData) {
                    let payload = {};
                    data.forEach((val, key) => {
                        payload[key] = val;
                    });
                    data = payload;
                }

                // console.log({data});

                store.put({ ...data, method });

                // await transaction.done;
            }.bind(this)
        );
    }
};
