export default {
    apiHost: process.env.REACT_APP_BASE_URL || "https://sw.dev.local",  // api server url
    image: {
        maxEntriesLimit: 1000,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
    },
    static: {
        maxEntriesLimit: 1000,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
    },
    resourcesAllowed: [  // the object stores to create for post, patch, put request
        'services',
        'service-answers',
    ]
};
