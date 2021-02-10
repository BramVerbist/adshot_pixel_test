// UPDATE DATA

window.onload = updateStream;
setInterval(updateStream, 20000);

var streamObject = new XMLHttpRequest();

function updateStream () {
    streamObject.open("GET", "/api/check", true);
    streamObject.onreadystatechange = getData;
    streamObject.send(null);
}

function getData () {

    if (streamObject.status == 200) {
        if (streamObject.readyState == 4) {
            
            // {online: false, views: 0, screen: '', verified: false}
            var serverResponse = JSON.parse(streamObject.responseText); // id, foto, locatie, grootte
            
            var online = serverResponse["online"];
            var views = serverResponse["views"];
            var screen = serverResponse["screen"];
            var verified = serverResponse["verified"];
            

            document.getElementById("verified").innerText = verified;
            document.getElementById("screen").src = screen;
            document.getElementById("views").innerText = views;
            document.getElementById("online").innerText = online;

            console.log(online,views,screen,verified);

            
        }
    }
}