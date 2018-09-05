const router = require('express').Router();
const Vacancy = require('../models/index').Vacancy;
const HHscrapper = require('../HHvacansy-scrapper');

router.get('/vacs/:page', (req, res) => {
    const limit = 10;
    let offset = req.params.page * limit;
    Vacancy.findAndCountAll({
        limit,
        offset
    })
    .then(vacs => {
        const curPage = parseInt(req.params.page);
        const pagesCount = Math.ceil(vacs.count / limit);
        if (curPage + 1 > pagesCount) {
            res.send('No such page');
            return;
        }
        res.render('index', { vacs: vacs.rows, pagesCount, curPage: curPage + 1});
    });
});

router.get('/refreshVacs', (req, res) => {
    console.log('refreshing vacs');
    Vacancy.truncate()
        .then(() => {
            return HHscrapper.HHgetVacs()
        })
        .then(vacs => {
            console.log(typeof vacs);
            for (let vac of vacs) {
                Vacancy.create(vac);
            }
        })
        .then(() => {
            console.log('base job done');
        })
        .catch(e => {
            console.log(e);
        });
    res.redirect('/wait');
});

router.get('/wait', (req, res) => {
    res.send('Vacancy list is updating, standby');
});

module.exports = router;