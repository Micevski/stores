const chrome = require('selenium-webdriver/chrome');
const {Builder, By, Key, until} = require('selenium-webdriver');

(async function getCategories() {
    let timeStart  = Date.now();
    let options = new chrome.Options();
    // options.addArguments('headless');
    // options.addArguments('disable-gpu');
    // options.addArguments('sandbox');
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://setec.mk')
        let searchCriteria = 'GORENJE NRK 611 PW4';
        let searchElement = await driver.findElement(By.id('search_query'));
        await searchElement.sendKeys(searchCriteria);
        await searchElement.sendKeys(Key.ENTER);
        let productsGrid = await driver.findElement(By.className('product-grid'));
        await driver.wait(until.elementIsVisible(productsGrid),5000);
        let searchedProducts = await driver.findElements(By.css('div.product'))
        for (const item of searchedProducts) {
            await fetchProductData(item);
        }

    } finally {
        let timeEnd = Date.now();
        console.log(timeEnd - timeStart);
    }
        // let allCategories = [];
        // try {
        //     console.log("Fetching categories from https://setec.mk");
        //     await driver.get('https://setec.mk');
        //     let allMegaMenus = await driver.findElements(By.css('ul.megamenu.fade'));
        //     let categoriesMenu = allMegaMenus[0];
        //     let categoiresItems = await categoriesMenu.findElements(By.css('li.with-sub-menu'));
        //     for (const el of categoiresItems.slice(1)) {
        //         let aEl = await el.findElement(By.css('a'));
        //         let cat = {
        //             name: await aEl.getAttribute("innerText"),
        //             url: await aEl.getAttribute('href')
        //         };
        //         allCategories.push(cat);
        //     }
        // } finally {
        //     console.log("Fetched categories")
        // }
        // for (const it of allCategories) {
        //     if (it.url.length > 1) {
        //         console.log("Fetching products from category: " + it.name);
        //         await driver.get(it.url);
        //         let productsGrid = await driver.findElement(By.className('product-grid'));
        //         await driver.wait(until.elementIsVisible(productsGrid), 5000);
        //         let products = await driver.findElements(By.css('div.product'));
        //         fetchProductData(products[2]);
        //         console.log(`Products from ${it.name} fetched`);
        //     }
        //
        // }


    }
)();

let fetchProductData = async (productElement) => {
    let imgDiv = await productElement.findElement(By.css('div.image'));
    let imgUrl = await imgDiv.findElement(By.css('a')).getAttribute('href');
    let productA = await productElement.findElement(By.id('mora_da_ima_prazno_mesto')).findElement(By.css('a'));
    let productName = await productA.getAttribute('innerText');
    let productUrl = await productA.getAttribute('href');
    let shifra = await productElement.findElement(By.className('shifra')).getAttribute('innerText');
    let priceOld = await productElement.findElement(By.className('price-old-new')).getAttribute('innerText').catch(er => null);
    let priceNew = await productElement.findElement(By.className('price-new-new')).getAttribute('innerText').catch(er => null);
    let clubRataSuma = await productElement.findElement(By.className('klub-rata-suma')).getAttribute('innerText').catch(er => null);
    let productData = {
        imgUrl,
        productName,
        productUrl,
        shifra,
        priceOld,
        priceNew,
        clubRataSuma
    };
    console.log(productData);
};
