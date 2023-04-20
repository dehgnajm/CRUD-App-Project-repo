console.log('hello');
//create a class of house that has name and different rooms.
class house {
    constructor(name){
        this.name = name;
        this.rooms = [];
    }
    //create a method to add a room.
    addRoom (name, number){
        this.rooms.push(new room(name, number));
    }
}
//create the rooms that have name and an area.
class room {
    constructor(name, number){
        this.name = name;
        this.number = number;
    }
}
//create the actual service.
class houseService {
    //create a static variable that calls the url in api.
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';
    //Create a method to call all the houses.
    static getAllHouses(){
        return $.get(this.url);
    }
    //create a method to get a specific house. take the id from api.
    static getHouse(id){
        return $.get(this.url + `/${id}`);
    }
    //create a method to take a house that has a name and post it to api.
    static createHouse(house){
        //return $.post(this.url, house);
        const responsePromise = $.ajax({
            url: this.url,
            data: JSON.stringify(house),
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            crossDomain: true,
          });
          console.log("responsePromise:", responsePromise);
          return responsePromise;
    }
    //create a  method to update the house/
    //take the object with multiple features and grab it.
    static updateHouse(house){
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: "json",
            //take the data and convert it to json string type.
            data: JSON.stringify(house),
            contentType: "application/json",
            type: "PUT"
        });
    }
    //create a method to delete the house.
    static deleteHouse(id){
        //use an ajax method on jquery object.
        return $.ajax({
            url: this.url + `/${id}`,
            type: "Delete"
        });
    }
}
//create a class of DOM that
//each time you take action it adds to the class.
class DOMManager {
    static houses;

    static getAllHouses(){
        //call all the methods
        houseService.getAllHouses().then(houses => this.render(houses));
    }

    static createHouse (name) {
        houseService.createHouse(new house(name)).then(() => {
            houseService.getAllHouses().then((houses) => this.render(houses));
             //Re-renders the DOM
            return console.log("createHouse Name:", name); //
          });
    }
// a method to update the houses while deleting, get all houses back.
    static deleteHouse(id){
        houseService.deleteHouse(id)
        .then(() => {
            return houseService.getAllHouses();
        })
        .then((houses) => this.render(houses));
    }
    static addRoom(id){
        for (let house of this.houses){
            if(house._id == id){
                house.rooms.push (new room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()));
                houseService.updateHouse(house)
                .then(() => {
                    return houseService.getAllHouses();
                })
                .then((houses) => this.render(houses));
                
            }
        }
    }
    static deleteRoom(houseId, roomId){
        for (let house of this.houses){
            if (house._id == houseId){
                for (let room of house.rooms){
                    if (room._id == roomId){
                        house.rooms.splice(house.rooms.indexOf(room),1);
                        houseService.updateHouse(house)
                        .then(()=>{
                            return houseService.getAllHouses();
                        })
                        .then((houses)=> this.render(houses));
                    }
                }
            }
        }
    }
    //create a method to manage or render the DOM.
    static render(houses){
        this.houses = houses;
        //every single time empty it and then rerender it.
        $('#app').empty();
        //create a for loop to go over houses and rerender it.
        for(let house of houses){
            //prepend the houses to show on top each time created.
            $('#app').prepend(
                //build the html for every single house.
                //give it a unique id.
                `<div id="${house._id}" class = "card">
                    <div class="card-header">
                        <h2>${house.name}</h2>
                        <button class="btn btn-danger" onclick = "DOMManager.deleteHouse('${house._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class= "card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${house._id}-room-name" class= "form-control" placeholder= "Room Name">
                                </div>
                                <div class="col-sm">
                                    <input type="number" id="${house._id}-room-number" class= "form-control" placeholder= "Room number">
                                </div>
                            </div>
                            <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            //create a for loop to render each room inside houses.
            for (let room of house.rooms){
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                        <span id="number-${room._id}"><strong>number: </strong> ${room.number}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>`
                );
            }
        }
    }

}
$("#create-new-house").click(() => {
    console.log('test');
    DOMManager.createHouse($('#new-house-name').val());
    $("new-house-name").val('');
})
//write a code to test it.
DOMManager.getAllHouses();