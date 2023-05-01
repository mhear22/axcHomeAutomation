import { ResourceModel } from "../models/resourceModel"
import { EventRequest } from "../models/eventRequest"

export class ResourceService {
    constructor() { }

    public static events:string[] = [] 

    public FetchResources(): ResourceModel[] {
        return [
            new ResourceModel("Dishwasher", ["On","Off"]),
            new ResourceModel("Garage", ["Open","Close"]),
            new ResourceModel("Living Room Light", ["On","Off"])
        ]
    }

    public FetchForName(name: string) {
        var item = this.FetchResources().filter(x=>x.Name == name)
        if(item.length == 0)
            return null;
        return item[0]
    }

    public TriggerEvent(iotEvent: EventRequest) {
        var message = `${iotEvent.Name} has been set to ${iotEvent.TargetState}`
        console.log(message)
        ResourceService.events.push(message);
    }
}