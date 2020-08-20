const request = require('supertest');
const app = require('./server'); //gets root route
const api = require('./routers/api') // gets routes for api




//======================================================
/* Test for '/' root route that serves the home page */
//======================================================

describe('GET /', () => {
    it('responds with 200 status and text/html content type', done => {
        request(app)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .expect(200, done);
    });
});

//======================================================
/* Test '/api' routes * test/
//======================================================

//Login routes
// describe('GET /api/', () => {
//     it('responds with 200 status', async () => {
//         request(api)
//             .get('/api/login')
//         // WHAT AM I CHECKING FOR BACK FROM GOOGLE? (res.locals.url)
//     });

//     it('redirection back to root page', async () => {
//         request(api)
//             .get('/api/login/google')
//         // HOW DO I CHECK IF I GET REDIRECTED BACK TO HOMEPAGE ('http://localhost:8080/')
//     });
// });



//Get info routes
//-- NEED TO FIGURE OUT HOW TO CHECK IF RESPONSE IS AN OBJECT --
// describe('/api/', () => {
//     it('responds with 200 status and application/json content type', () => {
//         return request(api)
//             .get('/api/info')
//             .expect('Content-Type', /json/)
//             .expect(200)
//     });
// });



    //Post create & add routes
    // describe('POST /api/', () => {
    //     it('responds with 200 status and application/json content type', async () => {
    //         let minchanCommentingOnMinchanWedding = [1, 'minchanjun@gmail.com', 2, 'minchan wedding', 'my wedding is gonna be LIT', '2020-10-18', '12:30:00']
    //         await request(api)
    //             .post('/api/create')
    //             .expect('Content-Type', /application\/json/)
    //             .send(minchanCommentingOnMinchanWedding)
    //             .then((data) => {
    //                 console.log('/create')
    //             })
    //     });

    //     it('responds with 200 status and application/json content type', done => {
    //         return request(api)
    //             .post('/api/add')
    //             .expect('Content-Type', /application\/json/)
    //             .expect(200, done)
    //     });
    // });


    //get events
    // -- NEED TO FIGURE OUT HOW TO CHECK IF RESPONSE IS AN OBJECT OR ARRAY --
    // describe('/api/', () => {
    //     it('responds with 200 status and application/json content type', () => {
    //         return request(api)
    //             .get('/api/events')
    //             .expect('Content-Type', /application\/json/)
    //             .then(data => console.log('/api/events'));
    //     });
    // });

