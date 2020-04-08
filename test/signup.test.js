const app = require("../lib/controlers/signup")
const request = require("supertest");
const rightToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicHJhdGlrMiIsImVtYWlsIjoicHJhdGlrMkBtb2JpZnlpLmNvbSIsIl9pZCI6IjVlODFkY2VmNjY0ZGNlMjcwODJlNDNiYSIsImlhdCI6MTU4NTU2OTAwNywiZXhwIjoxNTg1NjU1NDA3fQ.0pTzLyDJuUrW2ctS5yBwjqOQRWzq77JWHhZwg9R0T_U"
const falseToken = "fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicHJhdGlrMiIsImVtYWlsIjoicHJhdGlrMkBtb2JpZnlpLmNvbSIsIl9pZCI6IjVlODFkY2VmNjY0ZGNlMjcwODJlNDNiYSIsImlhdCI6MTU4NTU2OTAwNywiZXhwIjoxNTg1NjU1NDA3fQ.0pTzLyDJuUrW2ctS5yBwjqOQRWzq77JWHhZwg9R0T_U"


// const request = supertest(app);

describe("POST /signup", () => {

    //when inserting new user
  it("should return status 200", async done => {
    const newUser = {
      name: "pratik2",
      email: "pratik8@mobifyi.com",
      password: "12345678",
      repeat_password: "12345678"
    };

    const res = await request("http://localhost:3000").post('/signup')
                  .send(newUser);
    // console.log("res", res.body)


    expect(res.status).toEqual(201);
    // expect(res.body.length).toBeGreaterThan(0);
    done();
  });

  // when inserting duplicate user
  it("should return status 409 and message contain duplicate data", async(done)=>{
    const newUser = {
        name: "pratik2",
        email: "pratik5@mobifyi.com",
        password: "12345678",
        repeat_password: "12345678"
      };
      const res = await request('http://localhost:3000').post('/signup').send(newUser)
    //   console.log("res.body",res.body);
      expect(res.status).toEqual(409)
      done()
  })

});


describe("GET/ getting personal detail of user",()=>{
    
    // gettting user detials
    it("should return status 200", async (done) =>{
        const res = await request('http://localhost:3000')
                .get('/signup')
                .set(
                    "auth",
                    rightToken
                  );
        expect(res.status).toEqual(200);
    //   console.log("res.body",res.body);
        done();
    })

    // gettting user detials but wrong token
    it("should return status 401", async (done) =>{
        const res = await request('http://localhost:3000')
                .get('/signup')
                .set(
                    "auth",
                    falseToken
                  );
        expect(res.status).toEqual(401);
        console.log("res.body",res.body);
        done();
    })
})


