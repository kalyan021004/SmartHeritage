jest.setTimeout(30000);
const axios = require("axios");

const BASE_URL = "https://genai-project-65m3.onrender.com";

describe("Render Authentication Test", () => {
/*
    test("Register user on deployed server", async () => {

        const email = `user${Date.now()}@gmail.com`;

        const res = await axios.post(
            `${BASE_URL}/api/auth/register`,
            {
                name: "Kalyan",
                email: email,
                password: "12345678"
            }
        );

        console.log("STATUS:", res.status);
        console.log("BODY:", res.data);

        expect(res.status).toBe(201);

        expect(res.data).toHaveProperty("message");

    });
    */
   
    test("Login user on deployed server", async () => {

    const email = `login${Date.now()}@gmail.com`;

    // register first
    await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
            name: "Test",
            email: email,
            password: "12345678"
        }
    );

    const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
            email: email,
            password: "12345678"
        }
    );

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty("token");

});

});