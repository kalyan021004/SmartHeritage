const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");

describe("User Authentication Test", () => {

    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
    test("Register new user Successfully", async () => {

        const email = `user${Date.now()}@gmail.com`;

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Kalyan",
                email: email,
                password: "1234567"
            });

        console.log("STATUS:", res.statusCode);
        console.log("BODY:", res.body);

        expect(res.statusCode).toBe(201);

        expect(res.body).toHaveProperty("message");

    });

});