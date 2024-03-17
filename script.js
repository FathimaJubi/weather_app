// var apiKey = '975bacee3cd1f11feac7ad792d3db09a'
const wrapper =  document.querySelector(".wrapper"),
inputpart = wrapper.querySelector(".input-part"),
infotxt = inputpart.querySelector(".info-txt"),
inputfield = inputpart.querySelector("input"),
locationBtn = inputpart.querySelector("button"),
wIcon = document.querySelector(".weather-part img");

let api;
let apiKey = '975bacee3cd1f11feac7ad792d3db09a';

inputfield.addEventListener("keyup", e =>{
    // if user pressed enter btn and input value not empty
    if(e.key == "Enter" && inputfield.value != ""){
        requestApi(inputfield.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }else{
        alert("your browser not support geolocation api")
    }
});

function onSuccess(position){
    const{latitude,longitude} = position.coords; //getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData()
}

function onError(error){
    infotxt.innerText = error.message;
    infotxt.classList.add("error");
}

function requestApi(city){
    
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData()
    // getting api response and returning it with parsing into js and in another
    // then function calling weatherDetails function with passing api result as an argument
    // fetch(api).then(response => response.json()).then(result => weatherDetails(result));
    
}

function fetchData(){
    
    
    infotxt.innerText = "Getting weather deatails...";
    infotxt.classList.add("pending");
    // getting api response and returning it with parsing into js and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infotxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infotxt.innerText = `${inputfield.value} isn't a valid city name.`;
    }else{

        //let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;
// using custom icon according to the id which api return us
        if(id == 800){
            wIcon.src = "clear.svg";
        }else if(id >= 200 && id <=232){
            wIcon.src = "storm.svg";
        }else if(id >= 600 && id <=622){
            wIcon.src = "snow.svg";
        }else if(id >= 701 && id <=781){
            wIcon.src = "haze.svg";
        }else if(id >= 801 && id <=804){
            wIcon.src = "cloud.svg";
        }else if(id >= 300 && id <=321 || (id >= 500 && id <= 531)){
            wIcon.src = "rain.svg";
        }

        //let's pass these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;


        infotxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        console.log(info);
    }
    
}
