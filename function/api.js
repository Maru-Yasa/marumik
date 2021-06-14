const AxiosService = require('../helpers/axiosService')
const cheerio = require('cheerio')
const URL = 'https://komiku.id/'
const replaceMangaPage = "https://komiku.id/manga/";


module.exports = {

       // NOTE:get chapter image
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


     // NOTE:get chapter list
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
        return {}
    }
    return chapter;
    },


     // NOTE:get manga terbaru
    getMangaTerbaru:async (pagenumber) => {
      pagenumber = pagenumber.toString()
      let url = pagenumber === '1' ?'https://data.komiku.id/pustaka/'
      :`https://data.komiku.id/pustaka/page/${pagenumber}/`;

      try {
        const response = await AxiosService(url);
        console.log(url);
        if (response.status === 200) {
          console.log(response.status)
          const $ = cheerio.load(response.data);
          const element = $(".perapih");
          let manga_list = [];
          var obj = {}

          element.find(".daftar > .bge").each((idx, el) => {
            title = $(el).find(".kan > a").find("h3").text().trim();
            endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "");
            type = $(el).find(".bgei > a").find(".tpe1_inf > b").text();
            updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
            thumb = $(el).find(".bgei > a").find("img").attr("data-src");
            chapter = $(el).find("div.kan > div:nth-child(5) > a > span:nth-child(2)").text();

            // tambah sendiri
            info = $(el).find(".kan > span").text().trim();
            x = $(el).find(".kan > .new1").last().text().trim();
            chapterTerbaru = (x.match(/\d+/))[0];
            sinopsis = $(el).find(".kan > p").text().trim();
            genre = $(el).find(".bgei > a").find(".tpe1_inf").last().text().trim().split(/[ ,]+/);;
            manga_list.push({
              title,
              thumb,
              type,
              updated_on,
              endpoint,
              chapter,
              info,
              chapterTerbaru,
              sinopsis,
              genre
            });
          });
          return manga_list;
        }
        return []
      }catch (err) {
        return err
      }
    },

    // NOTE:get manhwa & manhua
    getManhwaManhua : async (pagenumber,type) => {
      pagenumber = pagenumber.toString()
      let url = pagenumber === '1' ?`https://data.komiku.id/pustaka/?orderby=&category_name=${type}&genre=&genre2=&status=`
      :`https://data.komiku.id/pustaka/page/${pagenumber}/?orderby&category_name=${type}&genre&genre2&status`;


      try {
        console.log(url);
        const response = await AxiosService(url);
        const $ = cheerio.load(response.data);
        const element = $(".perapih");
        var manga_list = [];
        var title, type, updated_on, endpoint, thumb, chapter;
    
        element.find(".daftar > .bge").each((idx, el) => {
          title = $(el).find(".kan > a").find("h3").text().trim();
          endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "");
          type = $(el).find(".bgei > a").find(".tpe1_inf > b").text().trim();
          updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
          thumb = $(el).find(".bgei > a").find("img").attr("data-src");
          chapter = $(el).find("div.kan > div:nth-child(5) > a > span:nth-child(2)").text();
    
          // tambah sendiri
          info = $(el).find(".kan > span").text().trim()
          x = $(el).find(".kan > .new1").last().text().trim()
          chapterTerbaru = (x.match( /\d+/))[0]
          sinopsis = $(el).find(".kan > p").text().trim()
          genre = $(el).find(".bgei > a").find(".tpe1_inf").last().text().trim().split(/[ ,]+/);;
    
          manga_list.push({
            title,
            thumb,
            type,
            updated_on,
            endpoint,
            chapter,
            info,
            chapterTerbaru,
            sinopsis,
            genre
          });
        });
    
        return manga_list
      } catch (error) {
        console.log(error);
        return []
      }
    },

    // NOTE:get detail dari komik
    getDetailKomik : async (komik) => {
      const slug = komik
      try {
        const response = await AxiosService("manga/"+slug);
      const $ = cheerio.load(response.data);
      const element = $(".perapih");
      let genre_list = [];
      let chapter = [];
      const obj = {};
      const info = [];
    
      /* Get Title, Type, Author, Status */
      const getMeta = element.find(".inftable > tbody").first();
      obj.title = $('#Judul > h1').text().trim();
      obj.type = $('tr:nth-child(2) > td:nth-child(2)').find('b').text();
      obj.author = $('#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)').text().trim();
      obj.status = $(getMeta).children().eq(4).find("td:nth-child(2)").text();
    
    
      /* Set Manga Endpoint */
      obj.manga_endpoint = slug;
    
      /* Get Manga Thumbnail */
      obj.thumb = element.find(".ims > img").attr("src");
      
    
      element.find(".genre > li").each((idx, el) => {
        let genre_name = $(el).find("a").text();
        genre_list.push({
          genre_name,
        });
      });
    
      obj.genre_list = genre_list||[];
    
      /* Get Synopsis */
      const getSinopsis = element.find("#Sinopsis").first();
      obj.synopsis = $(getSinopsis).find("p").text().trim();
    
      // tambah sendiri
      obj.desc = $('#Judul > .desc').text().trim();
      e = $('.inftable > tbody')
      e.find("tr").each((idx,el) => {
        info1 = $(el).find('td').first().text()
        info2 = $(el).find('td').last().text()
    
        info.push({
            info:[info1,info2]
          })
        })
      obj.info = info
    
    
      /* Get Chapter List */
      $('#Daftar_Chapter > tbody')
        .find("tr")
        .each((index, el) => {
          let chapter_title = $(el)
            .find("a")
            .attr("title")
          let chapter_endpoint = $(el).find("a").attr("href")
          if(chapter_endpoint !== undefined){
            const rep = chapter_endpoint.replace('/ch/','')
            chapter.push({
              chapter_title,
              chapter_endpoint:rep,
            }); 
          }
          obj.chapter = chapter;
        });
    
      return obj
    
      } catch (error) {
        console.log(error);
        return {}
      }
    },

    // NOTE:mencari komik dari quey
    searchManga : async (query) => {
      const url = `https://data.komiku.id/cari/?post_type=manga&s=${query}`;
    
      try {
        const response = await AxiosService(url);
        const $ = cheerio.load(response.data);
        const element = $(".daftar");
        let manga_list = [];
        let title, thumb, type, endpoint, updated_on;
        element.find(".bge").each((idx, el) => {
          endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "").replace('/manga/','');
          thumb = $(el).find("div.bgei > a > img").attr("data-src");
          type = $(el).find("div.bgei > a > div.tpe1_inf > b").text();
          title = $(el).find(".kan").find("h3").text().trim();
          updated_on = $(el).find("div.kan > p").text().split('.')[0].trim();
    
          // tambah sendiri
          info = $(el).find(".kan > span").text().trim()
          x = $(el).find(".kan > .new1").last().text().trim()
          chapterTerbaru = (x.match( /\d+/))[0]
          sinopsis = $(el).find(".kan > p").text().trim()
          genre = $(el).find(".bgei > a").find(".tpe1_inf").last().text().trim().split(/[ ,]+/);;
          manga_list.push({
            title,
            thumb,
            type,
            endpoint,
            updated_on,
            info,
            chapterTerbaru,
            sinopsis,
            genre
          });
        });
        return manga_list
      } catch (error) {
        console.log(error)
        return []
      }
    }



}

// async function main() {
//     // x = await fun.getChapter(encodeURI('tokyo卍revengers-chapter-178/'))
//     // console.log(x)
//     // max = await getMaxChapter(encodeURI('tokyo卍revengers/'))
//     max2 = await f.searchManga('tokyo')
//     console.log(max2)
// }

// main()