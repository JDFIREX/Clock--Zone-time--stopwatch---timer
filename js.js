// var
var arrowSec =  document.querySelector("#Sec");
var arrowMin =  document.querySelector("#Min");
var arrowHour =  document.querySelector("#Hour");

var miasto = document.getElementById("miasto");
var powiat = document.getElementById("powiat");
var wojewodztwo = document.getElementById("wojewodztwo");
var kraj = document.getElementById("Kraj");
var KJ = document.getElementById("KJ");
var KJInnerHTML = "";

const cities = [];

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const citiesList =  document.querySelector('.cities-list')

const iconMain =  document.querySelector('.icon_main')
const iconSecond = document.querySelector(".icon_second")
const iconThird = document.querySelector(".icon_third")

const section_2 = document.getElementById('section-2')
const section_3 = document.getElementById('section-3');
const section_4 = document.getElementById('section-4');

const section_3_main =  document.querySelector('.section_3_main')
const section_4_main =  document.querySelector('.section_4_main')

// menu button
iconMain.addEventListener('click', (e) => {
  section_3_main.style.opacity = "0";
  section_3.style.transform = `scale(0)`;
  section_4_main.style.opacity = "0";
  section_4.style.transform = `scale(0)`;
})
iconSecond.addEventListener('click', (e) => {
  section_4.style.transform = `scale(0)`;
  section_4_main.style.opacity = "0";
  setTimeout(() => {
    section_3.style.transform = `scale(1)`;
    section_3_main.style.opacity = "1";
  }, 1000);
  
  section3();
})
iconThird.addEventListener('click', (e) => {
  section_3.style.transform = `scale(0)`;
  section_3_main.style.opacity = "0";
  setTimeout(() => {
    section_4.style.transform = `scale(1)`;
    section_4_main.style.opacity = "1";
  }, 1000);
  
  section4()
})


//clock

setInterval(() => {

var data = new Date();
var dataMinSec =  data.getMilliseconds() / 170;
var dataSec = data.getSeconds() / 60 * 360 + (dataMinSec);
var dataMin = data.getMinutes() / 60 * 360 + (dataSec / 60);
var dataHour = data.getHours() * 30 + (dataMin / 12);
 

  arrowSec.style.transform = `rotate(${dataSec + 180 }deg)`;
  arrowMin.style.transform = `rotate(${dataMin + 180 }deg)`;
  arrowHour.style.transform = `rotate(${dataHour + 180 }deg)`;

},1)

// location

function geocodeLocation(){

if(navigator.geolocation){

  navigator.geolocation.getCurrentPosition((data) => {

      var latitude = data.coords.latitude;
      var longitude = data.coords.longitude;

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://us1.locationiq.com/v1/reverse.php?key=8519192b6c7ad2&lat=${latitude}&lon=${longitude}&format=json`,
        "method": "GET"
      }
      
      $.ajax(settings).done(function (response) {


        if(response.address.town){
          miasto.innerHTML = response.address.town;
        }else if(response.address.city){
          miasto.innerHTML = response.address.city;
        }else{
          miasto.innerHTML = response.address.village;
        }

        powiat.innerHTML = response.address.county;
        wojewodztwo.innerHTML = response.address.state;
        kraj.innerHTML = response.address.country;
        KJ.innerHTML = response.address.country_code;
        KJInnerHTML = KJ.innerHTML;
    });
  })

};
}

window.addEventListener("onload", geocodeLocation());

 async function ipGelocation() {
  var VPNKJ = document.getElementById("VPN-KJ");
    


  await fetch('https://ipapi.co/json/')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    VPNKJ.innerHTML = data.languages;

    if(KJInnerHTML != VPNKJ.innerHTML){

      var VPNmiasto = document.getElementById("VPN-miasto");
      var VPNstolica = document.getElementById("VPN-stolica");
      var VPNwojewodztwo = document.getElementById("VPN-wojewodztwo");
      var VPNkraj = document.getElementById("VPN-Kraj");
      var VPNLocation = document.getElementById("VPN-Location");


      VPNLocation.style.visibility = "visible";


      VPNmiasto.innerHTML = data.city;
      VPNstolica.innerHTML = data.country_capital;
      VPNwojewodztwo.innerHTML = data.region;
      VPNkraj.innerHTML = data.country_name;
    }
  })
}
window.addEventListener("onload", ipGelocation());

// search cities and get time for his time zone 
// 'https://api.timezonedb.com/v2.1/list-time-zone?key=6TEV059X2R1P&format=json'

fetch('https://api.timezonedb.com/v2.1/list-time-zone?key=6TEV059X2R1P&format=json')
    .then(blob => blob.json())
    .then(data => {
        cities.push(...data.zones);
    }).then( () => {
      var form = document.querySelector(".search-form")
      form.style.opacity = "1";
    })

function findMatches(wordToMatch, cities){
    return cities.filter(place => {
        const regex = new RegExp(wordToMatch, "gi");
        return place.countryName.match(regex) || place.zoneName.match(regex)
    })
}

function displayMatches() {

    const match = findMatches(this.value, cities)
    const html =  match.map(place => {
        const regex = new RegExp(this.value, 'gi');
        const cityName = place.countryName
        const statName = place.zoneName
        const gmtOffset = place.gmtOffset;
        return `
            <li class="option">
                ${cityName}, ${statName} <br>
                <span class="name-2" style="opacity: 0; position: absolute; right: 20px;">${gmtOffset}</span>
            </li>
        `;    
    }).join('');
    suggestions.innerHTML = html;        
}

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches)
suggestions.addEventListener("click", (event) => {
  // console.log(event.path)
  var eventPath = event.path[0];

  citiesList.append(eventPath)
  eventPath.childNodes[3].style.opacity = "1";
  var EPIT = eventPath.childNodes[3].innerHTML;
  setInterval(() => {
    var now = new Date();
    // console.log(now.toUTCString())
    var UTC_Sec = now.getUTCSeconds() * 1000;
    var UTC_Min = now.getUTCMinutes() * 60000;
    var UTC_Hours = now.getUTCHours() * 3600000;
    var UTC_Time = UTC_Sec + UTC_Min + UTC_Hours;

    var offSet = parseInt(EPIT, 10)
    offSet = offSet * 1000

    var CTIZ = UTC_Time;
    CTIZ = CTIZ + offSet;  // current time in zone 

    var CTIZ_Hours = Math.floor(CTIZ / 3600000) ;
    CTIZ = CTIZ - (CTIZ_Hours * 3600000);
    if(CTIZ_Hours >= 24) {
      CTIZ_Hours = CTIZ_Hours - 24;
    }

    var CTIZ_Min = Math.floor(CTIZ / 60000);
    CTIZ = CTIZ - (CTIZ_Min * 60000);

    var CTIZ_Sec = Math.floor(CTIZ / 1000);

    var checkTime = CTIZ_Hours+":"+CTIZ_Min+":"+CTIZ_Sec;
    eventPath.childNodes[3].innerHTML = checkTime;
  }, 1);
  
})

function checkTime(offset){
  var now = new Date();

    var UTC_Sec = now.getUTCSeconds() * 1000;
    var UTC_Min = now.getUTCMinutes() * 60000;
    var UTC_Hours = now.getUTCHours() * 3600000;
    var UTC_Time = UTC_Sec + UTC_Min + UTC_Hours;

    var offSet = parseInt(offset, 10)

    var CTIZ = UTC_Time;
    CTIZ += offSet;  // current time in zone 

    var CTIZ_Hours = Math.floor(CTIZ / 3600000) ;
    CTIZ = CTIZ - (CTIZ_Hours * 3600000);

    var CTIZ_Min = Math.floor(CTIZ / 60000);
    CTIZ = CTIZ - (CTIZ_Min * 60000);

    var CTIZ_Sec = Math.floor(CTIZ / 1000);

    var checkTime = CTIZ_Hours+":"+CTIZ_Min+":"+CTIZ_Sec;


    return checkTime;
}

//section 3 
function section3(){
  const stopperTime = document.querySelector(".stopper_time")
  const start = document.querySelector(".stopper_start");
  const pause = document.querySelector(".stopper_pause");
  const screen = document.querySelector(".stopper_screen");
  const reset = document.querySelector(".stopper_reset");
  var Interval;
  var time = 0;

    start.addEventListener('click', (e)=>{
      
      clearInterval(Interval);
      Interval = setInterval(() => {
        var hour = Math.floor(time / 3600);
        time = time - (hour * 3600);
        var min = Math.floor(time / 60);
        time = time - (min * 60);
        var sec = time;
        time ++;
        if(hour < 10){
          hour = "0"+hour
        }
        if(min < 10){
          min = "0"+min
        }
        if(sec < 10){
          sec = "0"+sec
        }
        var timer = hour + " : " + min + " : " + sec;
        stopperTime.innerHTML = timer;
      }, 1000);

    })

    pause.addEventListener('click', (e) => {

      clearInterval(Interval);

    })

    screen.addEventListener('click', (e) => {
      var list = document.querySelector('.stopper_screen_list')
      var li = document.createElement('li')
      var currentTime = stopperTime.innerHTML;
      li.textContent = currentTime;
      list.appendChild(li);
      console.log(list);
    })

    reset.addEventListener('click', (e) => {
      var list = document.querySelector('.stopper_screen_list')
      clearInterval(Interval);
      time = 0;
      stopperTime.innerHTML = "00 : 00 : 00"
      list.innerHTML = "";
    })


  }


// section 4
function section4(){
  var setHour = document.querySelector('.Hour');
  var setMin = document.querySelector('.Min');
  var setSec = document.querySelector('.Sec');
  var setStart = document.querySelector('.button_start');
  var setReset = document.querySelector('.button_reset');
  var setClock = document.querySelector('.set_clock');

  var getHour = 0 ;
  var getMin = 0 ;
  var getSec = 0 ;

  var getHourSec = 0;
  var getMinSec = 0;
  var getSecSec = 0;

  var setTime = 0;

  var TimeInterval;
  setTimeout(() => {
    setStart.style.transform = `scale(1)`;
  }, 2000);
  


  setHour.addEventListener('keyup', (e) => {
    var inner = setHour.value
    var reg = /[0-9]/gi;
    var result = inner.match(reg);
    var Hour = "";
    for(var i in result){
      Hour += result[i];
    }
    getHour = parseFloat(Hour, 10)
    getHourSec = getHour * 3600;
    setTime += getHourSec;
  })
  setMin.addEventListener('keyup', (e) => {
    var inner = setMin.value
    var reg = /[0-9]/gi;
    var result = inner.match(reg);
    var Min = "";
    for(var i in result){
      Min += result[i];
    }
    getMin = parseFloat(Min, 10)
    getMinSec = getMin * 60;
    setTime += getMinSec;
  })
  setSec.addEventListener('keyup', (e) => {
    var inner = setSec.value
    var reg = /[0-9]/gi;
    var result = inner.match(reg);
    var Sec = "";
    for(var i in result){
      Sec += result[i];
    }
    getSec = parseFloat(Sec, 10)
    getSecSec = getSec;
    setTime +=  getSecSec;
  })

  setStart.addEventListener('click' , () => {
    setStart.style.transform = `scale(0)`;
    setReset.style.transform = `scale(1)`;
    setTimeout(() => {
      clearInterval(TimeInterval)
      var time = setTime;
      

      TimeInterval = setInterval(() => {
        var getTime = time;

        var yourHour = Math.floor(getTime / 3600);
        getTime = getTime - (yourHour * 3600);

        var yourMin = Math.floor(getTime / 60);
        getTime = getTime - (yourMin * 60);

        var yourSec= getTime;

        
        if(yourHour <= 9){
          yourHour = "0" + yourHour;
        }
        if(yourMin <= 9){
          yourMin = "0" + yourMin;
        }
        if(yourSec < 10){
          yourSec = "0"+ yourSec;
        }
        
        var yourTime = yourHour + " : " + yourMin + " : " + yourSec;

        setClock.innerHTML = yourTime;

        if(time <= 0 ){
          clearInterval(TimeInterval);
          alert("stop")
        }

        time --;

      }, 1000)
    }, 1000);    
  })

  setReset.addEventListener('click', () => {
    clearInterval(TimeInterval);

    setStart.style.transform = `scale(1)`;
    setReset.style.transform = `scale(0)`;

    setClock.innerHTML = "00 : 00 : 00"

    setHour.value = "";
    setMin.value = "";
    setSec.value = "";

    getHour = 0 ;
    getMin = 0 ;
    getSec = 0 ;

    getHourSec = 0;
    getMinSec = 0;
    getSecSec = 0;

    setTime = 0;
  })

}
