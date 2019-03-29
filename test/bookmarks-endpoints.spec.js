const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe('Bookmarks Endpoints', function() {
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

    context('Given there are bookmarks in the database', () => {
        const testBookmarks = [
            {
                id: 1,
                title: 'Thinkful',
                url: 'https://www.thinkful.com',
                description: 'Think outside the classroom',
                rating: 5,
              },
              {
                id: 2,
                title: 'Google',
                url: 'https://www.google.com',
                description: 'Where we find everything else',
                rating: 4,
              },
              {
                id: 3,
                title: 'MDN',
                url: 'https://developer.mozilla.org',
                description: 'The only place to find web documentation',
                rating: 5,
              },
        ]; 

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })

        it('GET /bookmarks responds with 200 and all the bookmarks', () => {
            return supertest(app)
                .get('/bookmarks')
                .expect(200)
            }
        )
    })
})