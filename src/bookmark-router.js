const express = require('express')
const { isWebUri } = require('valid-url')
const xss = require('xss')
const uuid = require('uuid/v4')
const logger = require('./logger')
const bookmarksRouter = express.Router()
const BookmarksService = require('./bookmarks-service')
const bodyParser = express.json()
// const { bookmarks, lists} = require('./store')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
})

bookmarksRouter 
  .route('/bookmarks')
  .get((req, res, next) => {
    BookarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })
  .post (bodyParser, (req, res) => {
    const { title, url, rating, desc } = req.body;
  
    if(!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    if(!url) {
      logger.error(`URL is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    if(!rating) {
      logger.error(`Rating is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    if(!desc) {
      logger.error(`Description is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      url, 
      rating, 
      desc
    };
  
    bookmarks.push(bookmark);
  
    logger.info(`Bookmark with id ${id} created`);
    
    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json({bookmark});
  })

bookmarksRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
  
    //remove bookmark from lists
    //assume bookmarkIds are not duplicated in the bookmarkIds array
    lists.forEach(list => {
      const bookmarkIds = list.bookmarkIds.filter(bId => bId !== id);
      list.bookmarkIds = bookmarkIds;
    });
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`bookmark with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
    })

module.exports = bookmarkRouter
