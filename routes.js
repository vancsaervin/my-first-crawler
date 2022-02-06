const Apify = require("apify");
const {
    utils: { log },
} = Apify;

exports.PRODUCT = async ({ $, request }, { requestQueue }) => {
    return Apify.utils.enqueueLinks({
        $,
        requestQueue,
        selector: "div.ProductCardstyles__ContentBlock-h52kot-5 > div > a",
        baseUrl: request.loadedUrl,
        transformRequestFunction: (req) => {
            req.userData.label = "DETAIL";
            return req;
        },
    });
};

exports.DETAIL = async ({ $, request }) => {
    log.debug("Scraping results.");
    const results = {
        ProductName: $("[class^=Namestyles__Main-sc-269llv-1]").text(),
        ProductUrl: request.url,
        Price: $("[class^=Pricestyles__Li-sc-1oev7i-0] > h2").text(),
    };
    log.debug("Pushing data to dataset.");
    await Apify.pushData(results);
};
