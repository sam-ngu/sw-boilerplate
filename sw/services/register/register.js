function registerEvents(registration) {

    if('SyncManager' in window){
        // making sure browser support background sync 
        // background sync event registration

        registration.sync.register("sync-service-forms");

    }
}


export { registerEvents }