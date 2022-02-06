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

    // const browser = await Apify.launchPuppeteer();
    // log.debug("Open target page");
    // const page = await browser.newPage();
    // await page.goto(request.url);

    // log.debug("Fill in search form");
    // await page.type(".Inputstyles__Input-sc-14wbi02-8", "London");

    // log.debug("Submit form");
    // await Promise.all([
    //     page.waitForNavigation(),
    //     page.click('.Buttonstyles__Button-sc-42scm2-2 button[type="submit"'),
    // ]);

    // const results = await page.$$eval(
    //     "div.AvailabilityResultsstyles__AvailabilityResultsWrapper-i6pafh-0 > p.AvailabilityResultstyles__AvailabilityResultHeadingCollectTitle-sc-13xpu43-7",
    //     (nodes) =>
    //         nodes.map((node) => ({
    //             ProductName: $("[class^=Namestyles__Main-sc-269llv-1]").text(),
    //             ProductUrl: request.url,
    //             Price: $("[class^=Pricestyles__Li-sc-1oev7i-0] > h2").text(),
    //             Stock: node.innerText,
    //         }))
    // );

    const results = {
        ProductName: $("[class^=Namestyles__Main-sc-269llv-1]").text(),
        ProductUrl: request.url,
        Price: $("[class^=Pricestyles__Li-sc-1oev7i-0] > h2").text(),
    };
    log.debug("Pushing data to dataset.");
    await Apify.pushData(results);
};
