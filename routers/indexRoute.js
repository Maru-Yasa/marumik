const router = require('express').Router()
const fetch = require('node-fetch')
const myFunc = require('../function/apiNotLocal')
require('dotenv').config()

API = process.env.API_URL

async function getLatestManga(page) {
    var r = await myFunc.getLatestManga(page)
    return r;
}

async function getListManga(page,jenis) {
    var r = undefined
    if (jenis === 'popular') {
        await fetch(`manga/popular/1`)
            .then(res => res.json())
            .then((json) => {
                r = json
        });
    }else{
        r = await myFunc.getLatestManhwaManhua(page,jenis)
    }  
    return r;
}

async function getDetailManga(endpoint) {
    var r = await myFunc.getDetailManga(endpoint)
    return r;
}

async function searchManga(query) {
    var r = await myFunc.searchManga(query)
    return r;
}

// async function getChapter(endpoint) {
//     var r = undefined
//     await fetch(`${API}chapter/${endpoint}`)
//         .then(res => res.json())
//         .then((json) => {
//             r = json
//         });
//     return r;
// }


router.route('/')
    .get(async(req,res) => {
        mangaBaru = await myFunc.getLatestManga(1)
        manhuaBaru = await myFunc.getLatestManhwaManhua(1,'manhua')
        manhwaBaru = await myFunc.getLatestManhwaManhua(1,'manhwa')
        data = {
            // mangaBaru   :await myFunc.getLastestManga(1),
            mangaBaru   :mangaBaru,
            manhuaBaru  :manhuaBaru,
            manhwaBaru  :manhwaBaru
        }            
        // dataMangaBaru = await getLastestManga(1)
        // dataManhua = await getListManga(1,'manhua')
        // dataManhwa = await getListManga(1,'manhua')
        // console.log(data.magaBaru);
        res.render('index',manga=data)
        // res.send(data)
    })

router.route('/komik')
    .get(async(req,res) => {
        let query = req.query
        let body  = req.body
        if(query.jenis && query.page || query.cari){
            if(query.jenis === 'terbaru'){
                data = [await myfunc.getLatestManga(query.page), parseInt(query.page),query.jenis]
                console.log('masuk')
                return res.render('komik', manga=data)
            }
            if(query.jenis === 'manhwa' || query.jenis === 'manhua'){
                data = [await getListManga(query.page,query.jenis), parseInt(query.page),query.jenis]
                console.log('masuk')
                return res.render('komik', manga=data)
            }
            if (query.cari) {
                data = [
                    await searchManga(query.cari),
                    parseInt(query.page),
                    query.cari
                ]
                res.render('komik', manga=data)
            }
        }else{
            res.redirect('/komik?jenis=terbaru&page=1')
        }
    })
    .post(async (req,res) => {
        let body = req.body
        res.redirect(`/komik?cari=${body.cari}`)
    })

router.route('/komik/:jenis')
    .get(async (req,res) => {
        const param = req.params
        const query = req.query
        if (param.jenis !== 'terbaru'){
            if (query.page) {
                data =[
                    await getListManga(query.page,param.jenis),
                    parseInt(query.page),
                    param.jenis
                ]
                res.render('komik',manga=data)
            }else{
                res.redirect(`/komik/${param.jenis}?page=1`)
            }
        }else{
            if (query.page) {
                data =[
                    await getLatestManga(query.page),
                    parseInt(query.page),
                    param.jenis
                ]
                res.render('komik',manga=data)
            }else{
                res.redirect('/komik/terbaru?page=1')
            }
        }
    })

router.route('/komik/detail/:endpoint')
    .get(async (req,res) => {
        let param = req.params
        let endpoint = encodeURI(param.endpoint)
        if (param.endpoint) {
            data = await getDetailManga(endpoint)
            res.render('detail',data=data)
        }
    })

router.route('/komik/baca/:endpoint')
        .get(async (req,res) => {
            let param = req.params;
            endpoint = encodeURI(param.endpoint + '/')
            let lanjut,sebelum,chapter = null
            if (param.endpoint) {
                chapter = await myFunc.getChapter(param.endpoint)
                detailEndpoint = encodeURI(param.endpoint.split('-chapter')[0].toLowerCase())
                chapterList = await myFunc.getChapterList(detailEndpoint)
                chapterIndex = chapterList.indexOf(endpoint.toLowerCase())
                if (chapterIndex === 0) {
                    sebelum = await chapterList[chapterIndex + 1]
                }else if(chapterIndex > 0 || chapterIndex === 1){
                    lanjut = await chapterList[parseInt(chapterIndex - 1)]
                    sebelum = await chapterList[parseInt(chapterIndex + 1)]
                }
                data = {
                    chapter : chapter,
                    lanjut : lanjut,
                    sebelum : sebelum

                }
            }
            // console.log(chapterList)
            // console.log(chapterIndex,detailEndpoint,endpoint)
            // console.log(lanjut,sebelum,chapterIndex)
            // console.log(data.lanjut);
            res.render('chapter',data=data)
        })

module.exports = router;