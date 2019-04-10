//JSON
// http://api.openweathermap.org/data/2.5/forecast?q=Atlanta&appID=0d3ff1f2a2f60e0f3aa9afc043509206&units=imperial


/* <i class="fas fa-sun"></i>  sunny*/
/* <i class="fas fa-cloud-showers-heavy"></i> raining */
/* <i class="fas fa-cloud-sun"></i> Cloudy */

let apiID = '0d3ff1f2a2f60e0f3aa9afc043509206';
var city = "dsd";
var theJSON = "";
var someJSON;
var call_type;

//Date Formatter ~ takes in date and returns string format
//similar to openweahterapi JSON date format
function dateString(date) {
    // var today = new Date();
    var month;
    var day;
    if ((date.getMonth() + 1).toString().length === 1) {
        month = 0 + '' + (date.getMonth() + 1);
    } else {
        month = '' + (date.getMonth() + 1);
    }

    if ((date.getDate() + 1).toString().length === 1) {
        day = 0 + '' + (date.getDate());
    } else {
        day = '' + (date.getDate());
    }
    var DateString = date.getFullYear() + '-' + month + '-' + day;
    return DateString;
}

$('button#search').click(function () {
    city = document.getElementById('city-name').value;
    // city = $('city-name').val();

    //Error
    if (city === "") {
        alert('Please select a city');
    }
    //search by zip code
    if (city.length === 5 && Number.parseInt(city) + '' === city) {
        call_type = 'zip';
    } else { //call by city
        call_type = 'q';
    }

    forecast(city, call_type);
    weather(city, call_type);
});

$('button#search').click(function () {
    $('div.forecast').addClass('animation');
    $('div.weather').addClass('animation');
})

//API call methods
//5 day forecast
function forecast(city, call_type) {
    if (location.protocol === 'http:') {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?${call_type}=${city}&appID=${apiID}&units=imperial`).then(function (response) {
            return response.json();
        }).then(response => {
            divide(response)
        });
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?${call_type}=${city}&appID=${apiID}&units=imperial`).then(function (response) {
            return response.json();
        }).then(response => {
            divide(response)
        });
    }

}

// current weather
function weather(city, call_type) {
    if (location.protocol === 'http:') {
        fetch(`http://api.openweathermap.org/data/2.5/weather?${call_type}=${city}&appID=${apiID}&units=imperial`).then(function (response) {
            return response.json();
        }).then(response => {
            today(response)
        });
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?${call_type}=${city}&appID=${apiID}&units=imperial`).then(function (response) {
            return response.json();
        }).then(response => {
            today(response)
        });
    }
}

// today's weather
function today(json) {
    someJSON = json;
    //todays date
    var today = new Date();
    $('div.day h2#today').text(dateString(today));

    //temperature
    $('div.weather #temperature').text(Math.round(json.main.temp));
    colorTemp((Math.round(json.main.temp)), 'div.weather #temperature');
    //high
    $('div.weather #high').text(Math.round(json.main.temp_max));
    colorTemp((Math.round(json.main.temp_max)), 'div.weather #high');
    //low
    $('div.weather #low').text(Math.round(json.main.temp_min));
    colorTemp((Math.round(json.main.temp_min)), 'div.weather #low');

    //wind
    $('div.weather #wind-mph').text(Math.round(json.wind.speed) + ' mph');


    switch (json.weather[0].main) {
        case 'Clear':
            $('div.weather div.icon').html('<i class="fas fa-sun"></i>');
            break;

        case 'Clouds':
            $('div.weather div.icon').html('<i class="fas fa-cloud-sun"></i>');
            break;

        case 'Rain':
        case 'Drizzle':
        case 'Mist':
            $('div.weather div.icon').html('<i class="fas fa-cloud-rain"></i>');
            break;

        case 'Thunderstorm':
            $('div.weather div.icon').html('<i class="fas fa-cloud-showers-heavy"></i>');
            break;

        case 'Snow':
            $('div.weather div.icon').html('<i class="fas fa-snowman"></i>');
            break;

        default:
            break;
    }

}

//5 Day Forecast
function divide(json) {

    theJSON = json;

    var today = new Date();

    var dayNum = 1;
    var item = 0;
    var date = dateString(today); //day 2


    


    for (var x = 1; x <= 5; x++) {
        //day increment
        while (json.list[item].dt_txt.substring(0, 10).valueOf() == date) {
            item++;
        }

        // today.setDate(today.getDate()+1);
        date = (json.list[item].dt_txt).substring(0, 10);

        $('div.day' + dayNum + ' #day').text(date);

        //temperature
        $('div.day' + dayNum + ' #temperature').text(Math.round(json.list[item].main.temp));
        colorTemp((Math.round(json.list[item].main.temp)), 'div.day' + dayNum + ' #temperature');

        //wind
        $('div.day' + dayNum + ' #wind-mph').text(Math.round(json.list[item].wind.speed) + ' mph');

        //weather icon
        switch (json.list[item].weather[0].main) {
            case 'Clear':
                $('div.day' + dayNum + ' div.icon').html('<i class="fas fa-sun"></i>');
                break;

            case 'Clouds':
                $('div.day' + dayNum + ' div.icon').html('<i class="fas fa-cloud-sun"></i>');
                break;

            case 'Rain':
            case 'Drizzle':
            case 'Mist':
                $('div.day' + dayNum + ' div.icon').html('<i class="fas fa-cloud-rain"></i>');
                break;


            case 'Thunderstorm':
                $('div.day' + dayNum + ' div.icon').html('<i class="fas fa-cloud-showers-heavy"></i>');
                break;

            case 'Snow':
                $('div.day' + dayNum + ' div.icon').html('<i class="fas fa-snowman"></i>');
                break;


            default:
                break;
        }


        dayNum++;

    }
}





//Temperature Colors
function colorTemp(temp, selector) {

    switch (true) {
        case (temp < 0):
            //blue - #22316C	
            $(selector).css('color', ' #22316C');

            break;

        case (temp >= 0 && temp <= 20):
            //dark blue - #00008B
            $(selector).css('color', ' #00008B');

            break;

        case (temp > 20 && temp <= 40):
            //blue - #0000CD
            $(selector).css('color', ' #0000CD');

            break;

        case (temp > 40 && temp <= 60):
            //light blue - #003EFF	
            $(selector).css('color', ' #003EFF');

            break;

        case (temp > 60 && temp <= 80):
            //orange - #FF7F50
            $(selector).css('color', ' #FF7F50');

            break;

        case (temp > 80 && temp <= 100):
            //red orange - #FF4500
            //red orange - #FF4500
            $(selector).css('color', ' #FF4500');
            break;

        case (temp > 100):
            //red - #FC1501
            $(selector).css('color', '#FC1501');
            break;

        default:
            break;




    }

}