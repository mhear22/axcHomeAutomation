import request from 'supertest'
import { server } from "../src/app";


describe("App", () => {
    test("Fetch Resources", async () => {
        const response = await request(server).get("/event");
        const objBody = response.body

        expect(response.statusCode).toBe(200)
        expect(objBody.length).toBe(3)
    })

    test("Send update", async () => {
        const response = await request(server)
            .post("/event").send({Name:"Dishwasher", TargetState:"On"})

        expect(response.statusCode).toBe(200)
        expect(response.text).toBe("Received")
    })

    test("Send update with bad target state", async () => {
        const response = await request(server)
            .post("/event")
            .send({Name:"Dishwasher", TargetState:"Open"});

        expect(response.statusCode).toBe(400)
        expect(response.text).toBe("Received")
    })

    test("Send no body on update gets 400", async () => {
        const response = await request(server).post("/event");

        expect(response.statusCode).toBe(400)
    })

    test("Send Undo with no default logs nothing", async () => {
        const response = await request(server).post("/undo");
        expect(response.statusCode).toBe(200)
    })

    test("Send Undo with no default logs nothing", async () => {
        const response = await request(server).post("/undo");
        expect(response.statusCode).toBe(200)
    })
})