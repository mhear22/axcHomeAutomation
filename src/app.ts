import express, { Application, Request, Response } from 'express'
import { ResourceService } from './services/ResourceService'
import { EventRequest } from './models/eventRequest';

const app: Application = express()
const port: number = 3001
const resourceService = new ResourceService();
var lastEvent:EventRequest|null = null;

app.get('/event', (req, res) => {
    var responseBody = resourceService.FetchResources()

    res.send(responseBody);
})

app.post('/event', (req, res) => {
    var body = req.body;
    if(!body || !body.Name || !body.TargetState) {
        res.send(400, "Badly formed request, no body with a Name and TargetState")
        return
    }
    else if (!resourceService.FetchForName(body.Name)?.SupportedEvents.includes(body.TargetState)??false) {
        res.send(400, "Badly formed request, TargetState not accepted by this resource")
        return
    }

    lastEvent = body;

    resourceService.TriggerEvent(body)

    res.send("Received");
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