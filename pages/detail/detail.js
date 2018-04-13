const app = getApp()
const util = require('../../utils/util')

Page({
    data: {
        userinfo: {},
        repo: [],
        prs: [],
        language: [],
    },
    onLoad() {
        //userinfo
        let userinfo = app.globalData.userinfo;
        userinfo.ctime_str = util.getYear(new Date(userinfo.created_at))
        userinfo.name_str = userinfo.name ? userinfo.name : userinfo.login
        userinfo.name_upper = userinfo.name_str.toUpperCase()
        
        //repo
        let repo = app.globalData.repoinfo.filter(item => {
            return !item.fork
        })
        repo.sort((a, b) => {
            return this.computePopularity(a) - this.computePopularity(b)
        }).reverse()

        //prs
        let prs = this.collectPr(app.globalData.prinfo.items)
        prs.sort(function (a, b) {
            return a.popularity - b.popularity;
        }).reverse()

        this.setData({
            userinfo: app.globalData.userinfo,
            repo: repo.slice(0, 5),
            prs: prs.slice(0, 5),
            language: this.languageHandler(app.globalData.repoinfo)
        })
    },
    languageHandler(repoinfo) {
        let language = {},
            total = 0

        repoinfo.forEach(item => {
            let lang = item.language

            if (!lang) {
                return false
            } else if (!language[lang]) {
                language[lang] = {
                    popularity: 1
                }
            } else {
                language[lang].popularity += 1
            }

            total += 1
        })

        return Object.keys(language).map(item => {
            return {
                name: item,
                percent: Math.round(language[item].popularity / total * 100),
                popularity: language[item].popularity
            }
        })
    },
    collectPr: function (prs) {
        prs = prs.reduce(function (p, c) {
            if (!p[c.repository_url]) {
                p[c.repository_url] = {
                    popularity: 1
                };
            } else {
                p[c.repository_url].popularity += 1;
            }
            return p;
        }, {});

        return Object.keys(prs).map(function (v) {
            return {
                name: v.replace('https://api.github.com/repos/', ''),
                popularity: prs[v].popularity
            }
        });
    },
    computePopularity(repo) {
        return repo.stargazers_count * 2 + parseInt(repo.forks_count)
    }


})