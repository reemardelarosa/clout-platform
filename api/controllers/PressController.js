/**
 * PressController
 *
 * @description :: Server-side logic for managing presses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const parser = require('rss-parser');
var pager = require('sails-pager');
const cheerio = require('cheerio');
const ogs = require('open-graph-scraper');
const extend = require('util')._extend;

module.exports = {
  index: function (req, res) {
    var perPage = req.query.per_page || 20;
    var currentPage = parseInt(req.query.page, 10) || 1;

    var userId = null;

    if (req.user) {
      userId = req.user.id
    }


    var conditions = {};
    pager.paginate(Press, conditions, currentPage, perPage, [], 'updatedAt DESC').then(function (records) {
      async.map(records.data,
        function (item, cb) {
          Insights.get(item.id, userId).then(function (data) {
            extend(item, data);
            cb(null, item)
          }, function (err) {
            cb(err);
          })
        },
        function (err, result) {
          if (err) return res.json(400, Errors.build(err, Errors.ERROR_UNKNOWN));
          records.data = result;
          return res.json(records);
        });
    }).catch(function (err) {
      res.send(err)
    });
  },


  sync: function (req, res) {

    var url = req.param('url');

    var options = {
      customFields: {
        item: ['description', 'image']
      }
    };

    parser.parseURL(url, options, function (err, parsed) {
        if (err) return res.json(400, {"message": err.errorMessage});
        async.map(parsed.feed.entries, function (item, cb) {
          if (err) return cb(null, err);
          var $ = cheerio.load(item.content);
          var img = $('img').attr("src");

          if (!img && item["content:encoded"]) {
            $ = cheerio.load(item["content:encoded"]);
            img = $('img').attr("src");
          }
          const optionsOg = {'url': item.link};

          ogs(optionsOg, function (err, results) {
            if (err) return cb(null, err);
            if (!img) {
              img = results.data.ogImage.url;
            }
            var pubDate = new Date(item.pubDate);
            var createData = {
              title: item.title,
              description: item.contentSnippet,
              pubDate: pubDate,
              image: img,
              link: item.link,
              guid: item.guid
            };
            Press.findOrCreate({guid: item.guid}, createData).then(function (pressItem) {
              cb(null, pressItem)
            }).catch(function (err) {
              cb(err);
            });
          });

        }, function (err, result) {
          return res.json(result)
        })
      }
    )

  }

}
;

