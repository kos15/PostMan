function InitialConfig() {
    document.getElementById("jsonParam").style.display = "none";
    document.getElementById("customParam").style.display = "none";
    document.getElementById("parameterTypeDiv").style.display="none";
    document.querySelector(".progress").style.display="none";
    document.getElementById("response").value = "";
    document.getElementById("url").value = "";
}


// Variable declarions..
let url = document.getElementById("url");                   //URL textBox
let radiojson = document.getElementById("json");            //JSON radio button
let radioparam = document.getElementById("param");          //custom radio button
let get = document.getElementById("get");                   //GET radio button
let post = document.getElementById("post");                 //POST radion button
let addCustom = document.getElementById("addCustom")        //add Custom Parameter button
let submit = document.getElementById("submit");             //submit button to perform request
let customParamCount = 1;                                   //count the number of custom Parametr.Initial value is 1 by default
let requestType = "";                                       //track the type of the request to be perform
let requestParamType = "";                                  //track the type of the request Paramter to be send
let responseText = document.getElementById("response");     //response textArea

//Event handlings..
radiojson.addEventListener("click", jsonParam);     //on selecting JSON radio button
radioparam.addEventListener("click", customParam);  //on selecting custom parameter button
get.addEventListener("click", getRequest);           //on selecting get button
post.addEventListener("click", postRequest);         //on selecting post button
addCustom.addEventListener("click", add);            //on clicking add customer 
submit.addEventListener("click", submitRequest);            //on selecting submit button
url.addEventListener("blur", urlBlur);

//Functions..
//Sets the view to the JSON parameter adding and disable the custom Parameter
function jsonParam() {
    requestParamType = "JOSN";
    let jsonTxtBox = document.getElementById("jsonParam").style.display = "block";
    let customTxtBox = document.getElementById("customParam").style.display = "none"
}

//Sets the view to the custom Parameter parameter adding and disable the JSON
function customParam() {
    requestParamType = "Custom";
    let jsonTxtBox = document.getElementById("jsonParam").style.display = "none";
    let customTxtBox = document.getElementById("customParam").style.display = "block"
}

//Populate dynamically the Custom parameter blocks by adding elements
function add() {
    event.preventDefault();
    let addExtra = document.getElementById("addExtra");
    let newDiv = document.createElement("div");
    let string = `<div class="row my-2 P" id="Param${customParamCount + 1}">
                        <label for="customParam" class="col-sm-2 col-form-label"></label>
                        <div class="col">
                        <input id="key${customParamCount + 1}" type="text" class="form-control key" placeholder="Parameter ${customParamCount + 1} Key">
                        </div>
                        <div class="col">
                        <input id="value${customParamCount + 1}" type="text" class="form-control value" placeholder="Parameter ${customParamCount + 1} Value">
                        </div>
                        <button id="removeCustom${customParamCount + 1}" class="btn btn-outline-primary" onclick="removeCustom(${customParamCount + 1})"> - </button>
                    </div>`;
    newDiv.innerHTML += string;
    addExtra.appendChild(newDiv);
    customParamCount++;
}

//Populate dynamically the Custom parameter blocks by removing elements
function removeCustom(id) {
    event.preventDefault();
    console.log(id + "removeed")
    document.getElementById("Param" + id).remove();
    customParamCount--;

}

//Sets the request type to get request
function getRequest() {
    requestType = "GET";
    document.getElementById("parameterTypeDiv").style.display="none";
    document.getElementById("jsonParam").style.display = "none";
    document.getElementById("customParam").style.display = "none";
}

//Sets the request type to post request
function postRequest() {
    requestType = "POST";
    document.getElementById("parameterTypeDiv").style.display="block";
}

function urlBlur() {
    if (url.value === "") {
        url.style.border = "solid red 2px";
    } else {
        url.style.border = "";
    }
}

function submitRequest() {
    event.preventDefault();     //prevent the default behaviour of the submit button  i.e. refreshing page.
    document.querySelector(".progress").style.display="flex";
    if (requestType === "GET") {
        fetchGetRequest(url);
    } else {
        // Perform POST request
        if (requestParamType === "Custom") {
            let data={};
            data[document.getElementById("key0").value] = document.getElementById("value0").value;
            for (let index = 1; index <= document.querySelectorAll(".key").length; index++) {
                let Akey = `key${index}`;
                let Avalue = `value${index}`;
                if (document.getElementById(Akey) != null) {
                    data[document.getElementById(Akey).value] = document.getElementById(Avalue).value;
                } else {
                    continue;
                }
            }
            fetchPostRequest(url,data);
        } else {
            let data = document.getElementById("jsonParamtext").value;
            fetchPostRequest(url,data);
            
        }
    }

}

function fetchPostRequest(url,data){
    fetch(url.value, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: data
    }).then((response) => {
        if (response.status != 404 || response.status != 400 || response.status != 500) {
            responseText.style.border = "groove green 2px";
        } else {
            responseText.style.border = "groove red 2px";
        }
        return response.text()
    }).then((text) => {
        document.querySelector(".progress").style.display="none";
        responseText.value = text;
    });
}

function fetchGetRequest(url){
    fetch(url.value, {
        method: "GET"
    }).then((response) => {
        if (response.status != 404 || response.status != 400 || response.status != 500) {
            responseText.style.border = "groove green 2px";
        } else {
            responseText.style.border = "groove red 2px";
        }
        return response.text()
    }).then((text) => {
        document.querySelector(".progress").style.display="none";
        responseText.value = text;
    });
}