const { response } = require('express')
const AxiosService = require('../helpers/axiosService')
const URL = 'https://mangamint.kaedenoki.net/api'


module.exports = {
    getLatestManga : async (page) => {
        try {
            var endpoint = `${URL}/manga/page/${page}`
            let response = await AxiosService(endpoint)
            if (response.status == 200) {
                return response.data.manga_list                
            }else{
                return []
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },


    getLatestManhwaManhua : async (page,jenis) => {
        try {
            var endpoint = `${URL}/${jenis}/${page}`
            let response = await AxiosService(endpoint)
            if (response.status == 200) {
                return response.data.manga_list                
            }else{
                return []
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },


    searchManga : async (query) => {
        try {
            var endpoint = `${URL}/search/${query}`
            let response = await AxiosService(endpoint)
            if (response.status == 200) {
                return response.data.manga_list                
            }else{
                return []
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },


    getDetailManga : async (endpoint) => {
        try {
            var endpoint = `${URL}/manga/detail/${endpoint}`
            let response = await AxiosService(endpoint)
            if (response.status === 200){
                return response.data
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },

    getChapter : async (endpoint) => {
        try {
            var endpoint = `${URL}/chapter/${endpoint}`
            let response = await AxiosService(endpoint)
            if (response.status == 200) {
                return response.data                
            }else{
                return []
            }
        } catch (error) {
            console.log(error)
            return []
        }
    },

    getChapterList : async (endpoint) => {
        try {
            var endpoint = `${URL}/manga/detail/${endpoint}`
            let response = await AxiosService(endpoint)
            if (response.status === 200){
                let re = []
                response.data.chapter.forEach(e => {
                    re.push(e.chapter_endpoint)
                });
                return re
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

}


// async function main() {
//     let max2 = await f.getChapter("after-transformation-mine-and-her-wild-fantasy-chapter-70-bahasa-indonesia/")
//     console.log(max2)
// }

// main()