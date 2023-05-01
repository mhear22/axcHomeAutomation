# Home automation system

## Requirements

- Some kind of deployable webapi to act as a central controller
- a generic endpoint to handle 

## Design


### Endpoints
GET /event - Get the currently connected devices
- Response message: `
{ 
    "Resources": [
        {"Name": "Garage", "SupportedEvents":["Open","Close"]},
        {"Name": "Dishwaster", "SupportedEvents":["On","Off"]},
        {"Name": "Living Room Light", "SupportedEvents":["On","Off"]}
    ]
}
`

POST /event - Raise an event
- Request Body: `
{
    "Name": "Living Room Light",
    "TargetState": "On" 
}
`

POST /undo - Undo the last event

## Supported Events

I think as "On" and "Off" may not apply to some devices it might be best to provide the device with a unique named boolean value instead of passing True or False back and forth causing some confusion. The translation should be handled in the webapp for maximum flexibility.

## Undo functionality

To implement the undo functionality there is a problem. If a device is "on" and the "on" button is pressed followed by the "undo" button what should happen. 

#1 - If the state change is stored it would understand that the state hasnt changed and to do nothing. This would most closely match what the user expects however it would require additional complexity.

#2 - The simple approach is to simply store the last event raised and when the undo button is pressed, raise the last event with a toggled state.

Due to the assumptions page I will design with #2 in mind, but for productionising down the line it could be replaced with #1