const { expect } = require('chai')
const knex = require('knex')
const fixtures = require('./bookmarks-fixtures')
const app = require('../src/app')

describe.only('Bookmarks Endpoints', function() {
    let db 
    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmarks').truncate())

    afterEach('cleanup', () => db('bookmarks').truncate())

    context('Given there are bookmarks in the database', () => {
        const testBookmarks = [
            {
              id: 0,
              title: 'Google',
              url: 'http://www.google.com',
              rating: '3',
            },
            {
              id: 1,
              title: 'Thinkful',
              url: 'http://www.thinkful.com',
              rating: '5',
            },
            {
              id: 2,
              title: 'Github',
              url: 'http://www.github.com',
              rating: '4',
            },
          ]; 

          beforeEach('insert bookmarks', () => {
              return db 
                .into('bookmarks')
                .insert(testBookmarks)
          })

          it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
              return supertest(app)
                .get('/bookmarks')
                .expect(200, testBookmarks)
          })

          it('GET /article/:article_id responds with 200 and the specified article', () => {
            const bookmarkId = 2
            const expectedBookmark = testBookmark[bookmarkId - 1]
            return supertest(app)
                .get(`/bookmarks/${bookmarkId}`)
                .expect(200, expectedBookmark)
            })
    })
})

describe('GET /bookmarks', () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = fixtures.makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('gets the bookmarks from the store', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testBookmarks)
      })
    })
  })

  describe('GET /bookmarks/:id', () => {
    context(`Given no bookmarks`, () => {
      it(`responds 404 whe bookmark doesn't exist`, () => {
        return supertest(app)
          .get(`/bookmarks/123`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Bookmark Not Found` }
          })
      })
    })

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = fixtures.makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it('responds with 200 and the specified bookmark', () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedBookmark)
      })
    })
  })

  describe(`POST /bookmarks`, () => {
      it(`creates a bookmark responding with 201 and the new bookmark`, function() {
          const newBookmark = {
              title: 'Test new bookmark', 
              url: 'http://test-url.com', 
              rating: 1, 
              desc: 'test'
          }
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send(newBookmark)
            .expect(201)
            .expect(res => {
                expect(res.body.title).to.eql(newBookmark.title)
                expect(res.body.style).to.eql(newBookmark.url)
                expect(res.body.rating).to.eql(newBookmark.rating)
                expect(res.body).to.have.property('id')
            })
      })
  })