import express, { Application, Request, Response } from 'express'
import { ResourceService } from './services/ResourceService'
import { EventRequest } from './models/eventRequest';

const app: Application = express()
const port: number = 3001
const resourceService = new ResourceService();
var lastEvent:EventRequest|null = null;
app.use(express.json() as any)


app.get('/event', (req, res) => {
    var responseBody = resourceService.FetchResources()

    res.send(responseBody);
})

app.post('/event', (request, response) => {
    var body = request.body;
    if(!body || !body.Name || !body.TargetState) {
        response.send(400, "Badly formed request, no body with a Name and TargetState")
        return
    }
    else if (!resourceService.FetchForName(body.Name)?.SupportedEvents.includes(body.TargetState)??false) {
        response.send(400, "Badly formed request, TargetState not accepted by this resource")
        return
    }

    lastEvent = body;

    resourceService.TriggerEvent(body)

    response.send("Received");
})

app.post('/undo', (req, res) => {
    if(!lastEvent) {
        res.send("Received")
        return
    }


    var newEvent = lastEvent
    var resource = resourceService.FetchForName(newEvent.Name)
    newEvent.TargetState = resource?.SupportedEvents.filter(x=>x==newEvent.TargetState)[0]??""

    resourceService.TriggerEvent(newEvent)

    res.send("Received")
})

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

export const server = app;