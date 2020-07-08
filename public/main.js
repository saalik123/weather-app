var form = document.querySelector("form");
var input = document.querySelector("input");
var temp = document.querySelector(".temp");
var desc = document.querySelector(".des");
var icon = document.querySelector("img");
var windSpeed = document.querySelector(".speed");
var humidity = document.querySelector(".humidity");
var pressure = document.querySelector(".pressure");
var tempMax = document.querySelector(".tempMax");
var tempMin = document.querySelector(".tempMin");
var loc = document.querySelector(".location");
var err = document.querySelector(".error");
var details = document.querySelector(".details");



form.addEventListener("submit", function(e) {
    e.preventDefault();
    fetch(`/api/weather?address=${input.value}`)
        .then(function(response) {
            return response.json()
        }).then(function(data) {
            if (data.error) {
                clearData();
                return err.textContent = data.error;
            }
            loadData(data);
        })
})


function loadData(data) {
    err.textContent = "";
    input.value = "";
    temp.textContent = data.temp + " °C"
    loc.textContent = data.location;
    desc.textContent = data.des
    icon.setAttribute("src", `https://openweathermap.org/img/w/${data.icon}.png`);
    details.textContent = "More details:"
    windSpeed.textContent = "Wind Speed: " + data.windSpeed + " m/s";
    humidity.textContent = "Humidity: " + data.humidity + " %";
    pressure.textContent = "Pressure: " + data.pressure + " hpa";
    tempMax.textContent = "Max Temperature: " + data.tempMax + " °C";
    tempMin.textContent = "Min Temperature: " + data.tempMin + " °C";
}


function clearData() {
    input.value = "";
    temp.textContent = "";
    loc.textContent = "";
    desc.textContent = "";
    windSpeed.textContent = "";
    pressure.textContent = "";
    humidity.textContent = "";
    tempMax.textContent = "";
    tempMin.textContent = "";
    details.textContent = "";
    icon.setAttribute("src", "")
}