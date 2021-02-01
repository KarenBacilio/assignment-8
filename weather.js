let myApiKey = `9995bbfa30ebc583c05a8c99d86b2608`; //knows I should hide my future keys
let cityId = document.getElementById('city');
let button = document.getElementById('search');
let htmlInfo = document.getElementById('info');
let citySection = document.createElement('section')
htmlInfo.appendChild(citySection);
let cityTable = document.createElement('table');
//let cityTableHeader =  `<table><th>Day</th><th>Min</th><th>Max</th><th>Weather</th></table>`
htmlInfo.appendChild(cityTable);
//cityTable.innerHTML = cityTableHeader


let urlCurrent ="https://api.openweathermap.org/data/2.5/weather?q=" //Current Weather API
let urlOneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" //One Call API

//karen's attempt to make a reusable fetch function
async function fetchData (url, city, urlTwo){
    try{
      let result = await fetch(`${url}${city}&appid=${myApiKey}`)
      let data = await result.json()
      cityHTML(data);
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      let next7Days = await fetch(`${urlTwo}${lat}&lon=${lon}&exclude=hourly,minutely&appid=${myApiKey}`)
      let data7days = await next7Days.json()
      tableHTML(data7days)
      console.log("What does our weather look like for next 7 days:", data7days)
      return data7days
    }catch(error){
      alert("CITY NOT FOUND", error.message);
    }
};

//function to convert kelvin to fahrenheit
function convertToF (kelvin){
  let f = (kelvin - 273.15) * (9/5) + 32;
  return f.toFixed(0);
}

// function to create info before table
async function cityHTML (data){
  citySection.innerHTML =`
  <p><b>City: </b>${data.name}</p>
  <p><b>Country: </b>${data.sys.country}</p>
  <p><b>Current Weather: </b>${data.weather[0].description}</p>
  `
};
//actual table information
async function tableHTML (data){
  cityTable.innerHTML = `<tr>
    <th>Day</th>
    <th>Min Temperature</th>
    <th>Max Temperature</th>
    <th>Weather</th>
    </tr>`
  for (let i = 0; i <data.daily.length; i++){
    cityTable.innerHTML +=`
    <tr><td>${i}</td><td>${convertToF(data.daily[i].temp.min)}</td><td>${convertToF(data.daily[i].temp.max)}</td><td><img src = http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png></td></tr>
    `
  }
}

//BUTTON HERE
button.addEventListener('click', ()=>{
    let userTyped = cityId.value.toLowerCase();
    console.log("the city the user typed is: ", userTyped);
    
    let cityData = fetchData(urlCurrent, userTyped, urlOneCall)
    console.log("CityData is:  >>", cityData);
}); 
