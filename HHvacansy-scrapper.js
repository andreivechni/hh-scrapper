const rp = require('request-promise-native');
const cheerio = require('cheerio');

const uri = require('./config/config').uri;

async function getLastPage() {
    let search = await rp({
        uri: uri + 0,
        jar: true
    });
    let $ = cheerio.load(search);
    let lastPage = 0;
    $('.HH-Pager-Control').each((i, el) => {
        if($(el).attr('data-page') * 1 > lastPage) {
            lastPage = $(el).attr('data-page');
        }
    });
    return lastPage;
}

async function getVacLinks(lastPage) {
    let vacancies = [];
    for (let i = 0; i <= lastPage; i++) {
        let curPage = await rp({
            uri: uri + i,
            jar: true
        });
        let $ = cheerio.load(curPage);
        $('.vacancy-serp-item').each((i, el) => {
            vacancies.push($(el).find('.HH-LinkModifier').attr('href'));
        });
    }
    return vacancies;
}

async function getVacBody(link) {

    let vacBody = await rp({
        jar: true,
        uri: link
    });
    let $ = cheerio.load(vacBody, { decodeEntities: false });

    return {
        header: $('h1[class=header]').text(),
        body: $('.vacancy-description').text()
    };
}

async function HHgetVacs() {

    try {
        let lastPage = await getLastPage();
        let vacLinks = await getVacLinks(lastPage);
        let vacObjects = [];
        for (let vac of vacLinks) {
            vacObjects.push(await getVacBody(vac));
        }
        console.log('scrapper done...');
        return vacObjects;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports.HHgetVacs = HHgetVacs;
