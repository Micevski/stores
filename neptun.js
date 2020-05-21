const chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function getCategories() {
        let timeStart = Date.now();
        let options = new chrome.Options();
        // options.addArguments('headless');
        // options.addArguments('disable-gpu');
        // options.addArguments('sandbox');
        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        try {
            // await driver.navigate().to('https://www.neptun.mk/');
            let searchCriteria = 'GORENJE NRK 611 PW4';
            // let qBy = By.id('q');
            // await driver.wait(until.elementLocated(qBy),5000);
            // let searchElement = await driver.findElement(qBy);
            // await searchElement.sendKeys(searchCriteria);
            // await searchElement.sendKeys(Key.ENTER);
            let q = searchCriteria.split(" ").join("+");
            await driver.navigate().to(`https://www.neptun.mk/search-product-result.nspx?q=${q}`);
            let by = By.css("div.white-box");
            await driver.wait(until.elementLocated(by), 10000);
            let searchedProducts = await driver.findElements(By.className('searchItem'));
            for (const item of searchedProducts) {
                let divRight = await item.findElement(By.css('div.text-right'));
                let score = await divRight.findElement(By.css('p.ng-binding')).getAttribute('innerText');
                if(parseFloat(score) > 0.8) {
                    await fetchProductData(item, driver);
                    searchedProducts = searchedProducts.slice(1);
                }
            }

        } finally {
            let timeEnd = Date.now();
            console.log(timeEnd - timeStart);
        }
    }
)();

let fetchProductData = async (productElement, driver) => {
        let productDetailsUrl = await productElement.findElement(By.css('a')).getAttribute('href');
        await driver.navigate().to(productDetailsUrl);

        let byTitle = By.css('h1.product-details-second-col__title');
        await driver.wait(until.elementLocated(byTitle), 3000);
        let name = await driver.findElement(byTitle).getAttribute('innerText');

        let byPrice = By.css('div.product-price__amount');
        await driver.wait(until.elementLocated(byPrice), 3000);
        let price = await driver.findElement(byPrice).getAttribute('innerText');

        let product = {name, price, productDetailsUrl};
        console.log(product);
        await driver.navigate().back();
}
