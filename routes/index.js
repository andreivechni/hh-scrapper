const router = require('express').Router();
const Vacancy = require('../models/index').Vacancy;
const HHscrapper = require('../HHvacansy-scrapper');

router.get('/index', async (req, res) => {
    res.render('index');
});

router.get('/refreshVacs', (req, res) => {
    console.log('refreshing vacs');
    HHscrapper.HHgetVacs()
        .then(vacs => {
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
    res.redirect('/index');
});

module.exports = router;