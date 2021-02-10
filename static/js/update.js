// UPDATE DATA
var id = 0; // changes id

window.onload = updateStream;
setInterval(updateStream, 6000);

var streamObject = new XMLHttpRequest();

function updateStream () {
    streamObject.open("GET", "/api/browser", true);
    streamObject.onreadystatechange = getData;
    streamObject.send(null);
}

function getData () {

    if (streamObject.status == 200) {
        if (streamObject.readyState == 4) {
            var serverResponse = JSON.parse(streamObject.responseText); // id, foto, locatie, grootte
            var new_id = parseInt(serverResponse[0].id);
            if(id != new_id){
                id = new_id;

                var foto = serverResponse[0].foto;
                var locatie = serverResponse[0].locatie;
                var grootte = serverResponse[0].grootte;

                var htmlFoto = document.getElementById("logoshow");
                htmlFoto.classList = [];
                switch(locatie){
                    case "TL":
                        htmlFoto.classList = ["top left"];
                    break;
                    case "TR":
                        htmlFoto.classList = ["top right"];
                    break;
                    case "BL":
                        htmlFoto.classList = ["bottom left"];
                    break;
                    default:
                        htmlFoto.classList = ["bottom right"];
                }
                htmlFoto.style.width = grootte+'px';
                document.getElementById("logoshow_img").src = foto;
            }
            
        }
    }
}