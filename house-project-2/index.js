console.log('hello');
//create a class of house that has name and different rooms.
class school {
    constructor(name){
        this.name = name;
        this.rooms = [];
    }
    //create a method to add a room.
    addRoom (name, area){
        this.rooms.push(new room(name, area));
    }
}
//create the rooms that have name and an area.
class room {
    constructor(name, area){
        this.name = name;
        this.area = area;
    }
}
//create the actual service.
class schoolService {
    //create a static variable that calls the url in api.
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';
    //Create a method to call all the houses.
    static getAllSchools(){
        return $.get(this.url);
    }
    //create a method to get a specific house. take the id from api.
    static getSchool(id){
        return $.get(this.url + `/${id}`);
    }
    //create a method to take a house that has a name and post it to api.
    static createSchool(school){
        //return $.post(this.url, house);
        const responsePromise = $.ajax({
            url: this.url,
            data: JSON.stringify(school),
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
    static updateSchool(school){
        return $.ajax({
            url: this.url + `/${school._id}`,
            dataType: "json",
            //take the data and convert it to json string type.
            data: JSON.stringify(school),
            contentType: "application/json",
            type: "PUT"
        });
    }
    //create a method to delete the house.
    static deleteSchool(id){
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
    static schools;

    static getAllSchools(){
        //call all the methods
        schoolService.getAllSchools().then(schools => this.render(schools));
    }

    static createSchool (name) {
        schoolService.createSchool(new school(name)).then(() => {
            schoolService.getAllHouses().then((schools) => this.render(schools));
             //Re-renders the DOM
            return console.log("createSchool Name:", name); //
          });
    }
// a method to update the houses while deleting, get all houses back.
    static deleteSchool(id){
        schoolService.deleteSchool(id)
        .then(() => {
            return schoolService.getAllSchools();
        })
        .then((schools) => this.render(schools));
    }
    static addRoom(id){
        for (let school of this.schools){
            if(school._id == id){
                school.rooms.push (new room($(`#${school._id}-room-name`).val(), $(`#${school._id}-room-area`).val()));
                schoolService.updateSchool(school)
                .then(() => {
                    return schoolService.getAllSchools();
                })
                .then((schools) => this.render(schools));
                
            }
        }
    }
    static deleteRoom(schoolId, roomId){
        for (let school of this.schools){
            if (school._id == schoolId){
                for (let room of school.rooms){
                    if (room._id == roomId){
                        school.rooms.splice(school.rooms.indexOf(room),1);
                        schoolService.updateHouse(school)
                        .then(()=>{
                            return schoolService.getAllSchools();
                        })
                        .then((schools)=> this.render(schools));
                    }
                }
            }
        }
    }
    //create a method to manage or render the DOM.
    static render(schools){
        this.schools = schools;
        //every single time empty it and then rerender it.
        $('#app').empty();
        //create a for loop to go over houses and rerender it.
        for(let school of schools){
            //prepend the houses to show on top each time created.
            $('#app').prepend(
                //build the html for every single house.
                //give it a unique id.
                `<div id="${school._id}" class = "card">
                    <div class="card-header">
                        <h2>${school.name}</h2>
                        <button class="btn btn-danger" onclick = "DOMManager.deleteSchool('${school._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class= "card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${school._id}-room-name" class= "form-control" placeholder= "Room Name">
                                </div>
                                <div class="col-sm">
                                    <input type="number" id="${school._id}-room-area" class= "form-control" placeholder= "Room Area">
                                </div>
                            </div>
                            <button id="${school._id}-new-room" onclick="DOMManager.addRoom('${school._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`
            );
            //create a for loop to render each room inside houses.
            for (let room of school.rooms){
                $(`#${school._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                        <span id="area-${room._id}"><strong>Area: </strong> ${room.Area}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${school._id}', '${room._id}')">Delete Room</button>`
                );
            }
        }
    }

}
$("#create-new-school").click(() => {
    console.log('test');
    DOMManager.createSchool($('#new-school-name').val());
    $("new-school-name").val('');
})
//write a code to test it.
DOMManager.getAllSchools();