const AxiosService = require('./helpers/axiosService')
const cheerio = require('cheerio')


async function main() {
    try {
        console.log('masuk fungsi')
        const url = `https://komiku.id/ch/my-wife-is-a-demon-queen/`;
        const response = await AxiosService(url)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const element = $('.main > article > #baca_manga')
            let obj = []
            let chapter = []
            let manga_list = [];
            let title, type, updated_on, endpoint, thumb;
            
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
            console.log(obj)

            // $('#Baca_Komik').find("img").each((idx,el) => {
            //     img = $(el).attr('src')
            //     // console.log(img)
            //     obj.push({
            //         image_link:img,
            //         id:idx+1
            //     })
            // })

            // console.log(obj)

            // element.find("tr").each((idx,el) => {
            //     info1 = $(el).find('td').first().text()
            //     info2 = $(el).find('td').last().text()

            //     obj.push({
            //         info:[info1,info2]
            //     })
            // })
            // console.log(obj)
            // element.find(".daftar > .bge").each((idx, el) => {
            //   title = $(el).find(".kan > a").find("h3").text().trim();
            //   info = $(el).find(".kan > span").text().trim()
            //   x = $(el).find(".kan > .new1").last().text().trim()
            //   chapterTerbaru = (x.match( /\d+/))[0]
            //   sinopsis = $(el).find(".kan > p").text().trim()
            //   genre = $(el).find(".bgei > a").find(".tpe1_inf").last().text().trim().split(/[ ,]+/);;
            //   console.log(type2)
            // });
        
        }
    } catch (error) {
        console.log(error)
    }
}

main()