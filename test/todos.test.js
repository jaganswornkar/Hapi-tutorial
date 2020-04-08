const app = require("../lib/controlers/todo")
const request = require("supertest");
const rightToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicHJhdGlrMiIsImVtYWlsIjoicHJhdGlrMkBtb2JpZnlpLmNvbSIsIl9pZCI6IjVlODFkY2VmNjY0ZGNlMjcwODJlNDNiYSIsImlhdCI6MTU4NTU2OTAwNywiZXhwIjoxNTg1NjU1NDA3fQ.0pTzLyDJuUrW2ctS5yBwjqOQRWzq77JWHhZwg9R0T_U"
const falseToken = "fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicHJhdGlrMiIsImVtYWlsIjoicHJhdGlrMkBtb2JpZnlpLmNvbSIsIl9pZCI6IjVlODFkY2VmNjY0ZGNlMjcwODJlNDNiYSIsImlhdCI6MTU4NTU2OTAwNywiZXhwIjoxNTg1NjU1NDA3fQ.0pTzLyDJuUrW2ctS5yBwjqOQRWzq77JWHhZwg9R0T_U"

describe("POST/ post todos",()=>{
    // creating new todo 
    it("should return 201", async (done) => {
        const res = await request('http://localhost:3000')
                    .post("/todo")
                    .send({todo:"this is for testing"})
                    .set(
                        "auth",
                        rightToken
                      )
        // console.log('res in todo',res.body)
        expect(res.status).toEqual(201)
        done()
    });

    // creating new todo but wrong token
    it("should return 401", async (done) => {
        const res = await request('http://localhost:3000')
                    .post("/todo")
                    .send({todo:"this is for testing"})
                    .set(
                        "auth",
                        falseToken
                      )
        // console.log('res in todo',res.body)
        expect(res.status).toEqual(401)
        done()
    });

    // creating new todo but empty todo
    it("should return 500/ JOI err", async (done) => {
        const res = await request('http://localhost:3000')
                    .post("/todo")
                    .send()
                    .set(
                        "auth",
                        rightToken
                      )
        // console.log('res in todo',res.serverError)
        expect(res.status).toEqual(500)
        expect(res.serverError).toBe(true)
        done()
    })
})


describe("GET/ get all todos",()=>{
    // getting all todos of a user
    it("should return 200, returning todos", async (done) => {
        const res = await request("http://localhost:3000")
                    .get('/todo')
                    .set(
                        "auth",
                        rightToken
                    )
        // console.log(res.body);
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        done()
    })

    // getting no todos with wrong token
    it("should return 200, returning todos", async (done) => {
        const res = await request("http://localhost:3000")
                    .get('/todo')
                    .set(
                        "auth",
                        falseToken
                    )
        console.log(res.body);
        expect(res.status).toEqual(401);
        done()
    })
})