const Apify = require("apify");
const tools = require("./tools");
const {
    utils: { log },
} = Apify;

Apify.main(async () => {
    log.info("Starting actor.");
    const requestList = await Apify.openRequestList(
        "categories",
        await tools.getSources()
    );
    const requestQueue = await Apify.openRequestQueue();
    const router = tools.createRouter({ requestQueue });

    log.debug("Setting up crawler.");
    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        minConcurrency: 10,
        maxConcurrency: 50,
        maxRequestsPerCrawl: 10,
        maxRequestRetries: 1,
        handlePageTimeoutSecs: 30,
        handlePageFunction: async (context) => {
            const { request } = context;
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        },
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Actor finished.");
});
