'use strict';

const SearchService = require('../services/search.service');
const { internalServerError } = require('../middlewares/handle_error');

class SearchController {
   querySearch = async (req, res) => {
      try {
         const searchData = await SearchService.querySearch(
            req.params,
            req.query
         );
         return res.json(searchData);
      } catch (err) {
         return internalServerError(res);
      }
   };
}

module.exports = new SearchController();
