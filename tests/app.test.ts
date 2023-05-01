import request from 'supertest'
import { server } from "../src/app";
import { ResourceService } from '../src/services/ResourceService';

describe("App", () => {
    beforeEach(() => {
        ResourceService.events = []
    })

    test("Fetch Resources", async () => {
        const response = await request(server).get("/event");
        const objBody = response.body
        expect(response.statusCode).toBe(200)
        expect(objBody.length).toBe(3)
    })

    test("Send update", async () => {
        const response = await request(server)
            .post("/event").send({"Name":"Dishwasher", "TargetState":"On"})

        expect(response.text).toBe("Received")
    })

    test("Send update with bad target state", async () => {
        const response = await request(server)
            .post("/event")
            .send({Name:"Dishwasher", TargetState:"Open"});
        expect(response.statusCode).toBe(400)
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
        expect(ResourceService.events.length).toBe(1)
    })
    
    test("Send Undo with default logs runs", async () => {
        const response1 = await request(server)
        .post("/event").send({"Name":"Dishwasher", "TargetState":"On"})
        
        const response2 = await request(server).post("/undo");
        expect(response2.statusCode).toBe(200)
        expect(ResourceService.events.length).toBe(2)
    })
})