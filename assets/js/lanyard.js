var statusIcon = document.getElementById("statusIcon");
var discordStatus = document.getElementById("discordStatus");
var spotifyListening = document.getElementById("spotifyListening");
var visualStudioCodePlaying = document.getElementById("visualStudioCodePlaying");
var RamoIsReaLoL = document.getElementById("RamoIsReaLoL");
var activitiesStatus = document.getElementById("activitiesStatus");
var Status = document.getElementById("Status");

const lanyard = new WebSocket("wss://api.lanyard.rest/socket");

var api = {};
var received = false;

lanyard.onopen = function () {
  lanyard.send(
    JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: "881986210191523920",
      },
    })
  );
};

setInterval(() => {
  if (received) {
    lanyard.send(
      JSON.stringify({
        op: 3,
      })
    );
  }
}, 30000);

lanyard.onmessage = function (event) {
  received = true;
  api = JSON.parse(event.data);

  if (api.t === "INIT_STATE" || api.t === "PRESENCE_UPDATE") {
    update_presence();
  }
};

function update_presence() {
  if (statusIcon != null) {
    update_status(api.d.discord_status);
  }

  var RamoIsReaLoLAppID = "1019290522369671209"
  
  var RamoIsReaLoLActivity = api.d.activities.find(activity => activity.application_id == RamoIsReaLoLAppID)
  
    if (RamoIsReaLoLActivity) {
    RamoIsReaLoL.innerHTML = `
        <a href="javascript:void(0)">
        <div class="card rounded-xl h-full">
            <div class="p-3 flex space-x-2 items-center overflow-hidden">
                 <img src="https://cdn.discordapp.com/avatars/881986210191523920/a_fb93e962113018299075ff4b5668f792.png?size=1024" alt="IMG" class="rounded-xl"
                     width="50" height="50">
                 <p class="normalText ml-3 opacity-90">RamoIsReaLoL - Desktop</p>
                 <p class="thinText sectionTopRightText rounded-xl p-2 opacity-80">RamoIsReaLoL</p>
            </div>
       </div>
       </a>`;
     } else {
       RamoIsReaLoL.innerHTML = ``;
       document.getElementById("RamoIsReaLoL").style.display = "none";
     }

  var vsCodeAppID = "782685898163617802"
                    
  var vsCodeActivity = api.d.activities.find(activity => activity.application_id == vsCodeAppID)

  if (vsCodeActivity) {
    var vsCodeDetails = vsCodeActivity.details
    var vsCodeState = vsCodeActivity.state

    visualStudioCodePlaying.innerHTML = `
    <a href="javascript:void(0)">
    <div class="card rounded-xl h-full">
        <div class="p-3 flex space-x-2 items-center overflow-hidden">
            <img src="/assets/img/visualStudioCode.svg" alt="IMG" class="rounded-xl"
                width="50" height="50">
            <p class="normalText ml-3 opacity-90">VS Code<br><span class="smallText opacity-80">${vsCodeState || "<i>No data</i>"}</span></p>
            <p class="thinText sectionTopRightText rounded-xl p-2 opacity-80">${vsCodeDetails || "<i>No data</i>"}</p>
        </div>
    </div>
    </a>`;
  } else {
    visualStudioCodePlaying.innerHTML = ``;
    document.getElementById("visualStudioCodePlaying").style.display = "none";
  }
  setInterval(function () {

    if (api.d.listening_to_spotify == true) {

      var countDownDate = new Date(api.d.spotify.timestamps.end).getTime();
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      var spotify_time = minutes + "m " + seconds + "s "

      var artist = `${api.d.spotify.artist.split(";")[0].split(",")[0]
        }`;
      var song = `${api.d.spotify.song.split("(")[0]
        }`;
      spotifyListening.innerHTML = `
      <a href="https://open.spotify.com/track/${api.d.spotify.track_id}" target="_blank">
      <div class="card rounded-xl h-full">
          <div class="p-3 flex space-x-2 items-center overflow-hidden">
              <img src="${api.d.spotify.album_art_url}" alt="IMG" class="rounded-xl"
                  width="50" height="50">
              <p class="normalText ml-3 opacity-90">Spotify<br><span class="smallText opacity-80">${artist} - ${song || "<i>No data</i>"}</span></p>
              <p class="thinText sectionTopRightText rounded-xl p-2 opacity-80">left ${spotify_time || "0m 0s"}</p>
          </div>
      </div>
      </a>`;
    } else {
      spotifyListening.innerHTML = ``;
      document.getElementById("spotifyListening").style.display = "none";
    }

  }, 1000); //removed: animate__animated animate__flash

  if (api.d.discord_status === "dnd") {
    discordStatus.innerHTML = `<div class="discordStatusDnd"></div>`;

  } else if (api.d.discord_status === "idle") {
    discordStatus.innerHTML = `<div class="discordStatusIdle"></div>`;

  } else if (api.d.discord_status === "online") {
    discordStatus.innerHTML = `<div class="discordStatusOnline"></div>`;

  } else if (api.d.discord_status === "offline") {
    discordStatus.innerHTML = `<div class="discordStatusOffline"></div>`;

  } else {
    discordStatus.innerHTML = `<div class="discordStatusOffline"></div>`;

  }

  setInterval(function () {
    if (api.d.listening_to_spotify == false && api.d.activities.find(activity => activity.application_id == vsCodeAppID) == undefined && api.d.activities.find(activity => activity.application_id == RamoIsReaLoLAppID) == undefined) {
      activitiesStatus.innerHTML = `<i class="smallText opacity-80">Bir Aktivite Bulunamadı</i>`;
    } else {
      activitiesStatus.innerHTML = ``;
      document.getElementById("activitiesStatus").style.display = "none";
    }
  }, 1000) // biraz sıkıntılı gibi gibi

}
