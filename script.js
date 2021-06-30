//const User = Parse.Object.extend("User");
//const user = new User();
/*User.set("username", signup_username);
User.set("password", signup_password); */

async function signup(){
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const signup_username = document.getElementById("username-field").value;
  const signup_password = document.getElementById("password-field").value;
  const user = new Parse.User();
  user.set("username", signup_username);
  user.set("email", signup_username);
  user.set("password", signup_password);
  try {
    await user.signUp();
    document.getElementById("status-message").innerHTML = "Successfully Signed Up " + signup_username;
  }
  
    //console.log("Signed up user: ", user);
  catch (error) {
    document.getElementById("status-message").innerHTML = "Error: " + error.code + " " + error.message;
  }
}
async function login(){
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const login_username = document.getElementById("username-field").value;
  const login_password = document.getElementById("password-field").value;
  try{
    await Parse.User.logIn(login_username, login_password);
    document.getElementById("status-message").innerHTML = "Successfully Logged In: " + login_username;
    window.location.replace("contribute.html");
  } 
  catch (error) {
    document.getElementById("status-message").innerHTML = "Error: " + error.code + " " + error.message;
  }
}

var file; //makes this variable public
var link;
var healthy;
async function loadFile(){
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  //const fileUploadControl = $("#file")[0];
  //if (fileUploadControl.files.length > 0) {
  file = event.target.files[0]; //image put in by user
  //creating a imgur link with the file put in by the user
  const formdata = new FormData();
  formdata.append("image", file);
  fetch("https://api.imgur.com/3/image/", {
    method: "post",
    headers: {
      Authorization: "Client-ID 14e494303e30b2c"
    }
    , body: formdata
  }).then(data => data.json()).then(data => {
    link = data.data.link;
  })
  
  //}
  //
  var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
  const mainmodelURL = "https://teachablemachine.withgoogle.com/models/b2ldFt-gT/";
  const modelURL = mainmodelURL + "model.json";
  const metadataURL = mainmodelURL + "metadata.json"; 
  //document.getElementById("image-results").innerHTML = "helloB4";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const prediction = await model.predict(image);
  var classPrediction = "";
  //alert(parseFloat(prediction[0].probability.toFixed(2)));
  if (parseFloat(prediction[0].probability.toFixed(2))>=parseFloat(prediction[1].probability.toFixed(2))){
    classPrediction = prediction[0].className + ": " + prediction[0].probability.toFixed(2);
    healthy = "green";
  }
  else {
    classPrediction = prediction[1].className + ": " + prediction[1].probability.toFixed(2);
    healthy = "red";
  }
  document.getElementById("image-results").innerHTML = classPrediction;
  
  /*for (let i = 0; i < maxPredictions; i++) {
    classPrediction =
      classPrediction + prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    alert(maxPredictions);
    document.getElementById("image-results").innerHTML = classPrediction;
  }
  */
}  

function submitLocation(){
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const LocationObject = Parse.Object.extend("Location");
  const lat_input = document.getElementById("lat-field").value;
  const long_input = document.getElementById("long-field").value;
  const location = new LocationObject();
  location.set("latitude", lat_input);
  location.set("longitude", long_input);
  /*
  Saving Photo on Parse Server
  const name = "photo.jpg";
  const parseFile = new Parse.File(name, file);
  parseFile.save().then(function() {
  }, function(error) {
  });
  location.set("reefPhoto", parseFile);
  */
  location.set("photo_link", link);
  location.set("health", healthy);

  location.save()
      .then((location) => {
  // Execute any logic that should take place after the object is saved.
  alert('Response Submitted! Now you are being directed to our sitewide map.');
}, (error) => {
  // Execute any logic that should take place if the save fails.
  // error is a Parse.Error with an error code and message.
  alert('Failed to create new object, with error code: ' + error.message);
});
  window.location.replace("map.html");
}

let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 30, lng: 144.61 },
    zoom: 2,
  });
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const Location = Parse.Object.extend("Location");
  const query = new Parse.Query("Location");
  const results = await query.find();
  const icons = {
    "green": {
      icon: "green_marker.png",
    },
    "red": {
      icon: "red_marker.png",
    },
  };

  const features = [];
  
  
  for(var i = 0; i < results.length; i++){
    var dict = {"position": new google.maps.LatLng(results[i].get('latitude'), results[i].get('longitude')), "type":results[i].get('health'), "link":results[i].get('photo_link')};
    features.push(dict);
    
  }

  
  //alert(features[0]["type"]);
  for (let i = 0; i < features.length; i++) {
    const marker = new google.maps.Marker({
      position: features[i]["position"],
      icon: icons[features[i]["type"]].icon,
      map: map,
    });
    
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent('<p>' + features[i]['link'] + '</p>');                              
        infowindow.open(map, this);                        
});
  }
  
  /*
  for(var i = 0; i < results.length; i++){
    const marker = new google.maps.Marker({
    position: new google.maps.LatLng(results[i].get('latitude'), results[i].get('longitude')),
    icon: icons["green"].icon,
    map: map,
    });
    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.setContent('<p>' + results[i].get('photo_link') + '</p>');                              
        infowindow.open(map, this);                        
});
  }
*/

}
  
/*
    marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });
 

  }
  //alert(features[0]["position"]);
  //alert(results[0].get('latitude'));
}
 */
//Attempted to add location objects to each picture. Parse Object were not being sent to server.
/*
class Point extends Parse.Object {
  constructor() {
    // Pass the ClassName to the Parse.Object constructor
    super('Point');
    // All other initialization
    this.lat = 0;
    this.long = 0;
  }
  static set_location(input_lat, input_long) {
    const point = new Point();
    point.set('latitude', input_lat);
    point.set('longitude',input_long);
    return point;
  }
}
Parse.Object.registerSubclass('Point', Point);

function submitLocation(){
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const lat_input = document.getElementById("lat").value;
  const long_input = document.getElementById("long").value;
  Point.set_location(lat_input, long_input);
  document.getElementById("test-text").innerHTML = "h";
  
  /*var point = new Parse.Object("Point");
  
  const lat_input = document.getElementById("lat").value;
  const long_input = document.getElementById("long").value;
  point.set("latitude", lat_input);
  point.set("longitude", long_input);
  point.save();
  
}
*/
/*
function submitLocation(){
  const Parse = require('parse');
// ES6 Minimized
  Parse.initialize(
  "VmVG7QHqLMLl55A7HBS41M9VVEcHSBkOLRYPMFrV",
  "Fn00cz1HubhArl6Qe3htiqjSVFBRzzkPHfMGOFEY"
  );
  Parse.serverURL = 'https://pg-app-x0nn57scg4turute43zp66450ts38l.scalabl.cloud/1/';
  const CarObject = Parse.Object.extend("Car");
  
  const car = new CarObject();
  car.set("driver", "Sean Plo");

  car.save()
      .then((car) => {
  // Execute any logic that should take place after the object is saved.
  alert('New object created with objectId: ' + gameScore.id);
}, (error) => {
  // Execute any logic that should take place if the save fails.
  // error is a Parse.Error with an error code and message.
  alert('Failed to create new object, with error code: ' + error.message);
});
  document.getElementById("test-text").innerHTML = "h";
}
*/

