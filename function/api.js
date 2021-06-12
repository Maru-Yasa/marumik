const AxiosService = require('../helpers/axiosService')
const cheerio = require('cheerio')
const URL = 'https://komiku.id/'

// async function getMaxChapter(endpoint) {
//     try {
//       const url = `${URL}manga/${endpoint}`
//       const response = await AxiosService(url)
//       if (response.status == 200) {
//           const $ = cheerio.load(response.data)
//           max = $('#Daftar_Chapter > tbody > tr:nth-child(2) > .judulseries').text().trim()
//           max = parseFloat(max.match( /\d+/)[0])
//       }
//     } catch (error) {
//       console.log(error)
//     }
//     return max
// }


module.exports = {

      getChapter:async (endpoint) => {
        let obj = {}
        let img_link = []
        try {
          const url = `${URL}ch/${endpoint}`;
          const response = await AxiosService(url)
          if (response.status === 200) {
              const $ = cheerio.load(response.data)
              judul = $('#Judul > h1').text().trim()
              obj.judul = judul
              obj.on_chapter = parseFloat(judul.match( /\d+/)[0])
              $('#Baca_Komik').find("img").each((idx,el) => {
                  img = $(el).attr('src')
                  img_link.push({
                      image_link:img,
                      id:idx+1
                  })
              })      
          }
      } catch (error) {
          obj.error = error
      }
      obj.img_link = img_link
      return obj;
    },

    getChapterList : async (endpoint) => {
      let obj = {}
          chapter = []
      try {
        const url = `${URL}manga/${endpoint}`;
        const response = await AxiosService(url)
        if (response.status === 200) {
          const $ = cheerio.load(response.data)
          $('#Daftar_Chapter > tbody')
          .find("tr")
          .each((index, el) => {
            let chapter_title = $(el)
              .find("a")
              .attr("title")
            let chapter_endpoint = $(el).find("a").attr("href")
            if(chapter_endpoint !== undefined){
              const rep = chapter_endpoint.replace('/ch/','')
              chapter.push(
                rep
              ); 
            }
            obj.chapter = chapter;
          });
        }
    } catch (error) {
        obj.error = error
    }
    return chapter;
    },


}

// async function main() {
//     // x = await fun.getChapter(encodeURI('tokyo卍revengers-chapter-178/'))
//     // console.log(x)
//     // max = await getMaxChapter(encodeURI('tokyo卍revengers/'))
//     max2 = await f.getChapterList('tokyo卍revengers/')
//     console.log(max2)
// }

// main()