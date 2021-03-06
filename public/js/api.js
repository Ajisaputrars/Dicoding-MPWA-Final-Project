let base_url ="https://api.football-data.org/v2/";
const token = '23c408149d0144fda696df3f12a71ef1';
const id_liga = "2002";
let url_standings = `${base_url}competitions/${id_liga}/standings`;
let url_scorer =`${base_url}competitions/${id_liga}/scorers?limit=20`;
let url_team =`${base_url}teams/`;

let fetchApi = url => {
  return fetch(url, {
    method: "get",
    mode: "cors",
    headers: {
      'X-Auth-Token': token
    }
  });
}
//var base_url = "https://readerapi.codepolitan.com/";
// Blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json

function getStandings() {
    if ('caches' in window) {
    caches.match(url_standings).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          ToStandingsHtml(data);
        });
      }
    });
  }

	fetchApi(url_standings)
    .then(status)
    .then(json)
    .then(function(data) {
      // console.log(data)
      ToStandingsHtml(data)   
    })
    .catch(error);
}

function getTopScore() {
    if ('caches' in window) {
      caches.match(url_scorer).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            ToTopScrorerHtml(data);
            console.dir("getTopScore " + data);
          });
        }
      });
    }

  	fetchApi(url_scorer)
      .then(status)
      .then(json)
      .then(function(data) {
        // console.log(data);
        ToTopScrorerHtml(data);
       })
      .catch(error);
}

function getTeamsId(teamid) {
  // let urlParams = new URLSearchParams(window.location.search);
  // let teamid = urlParams.get("id");
  if ('caches' in window) {
    caches.match(url_team + teamid).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          ToTimHtml(data);
        });
      }
    });
  }
  fetchApi(url_team + teamid)
    .then(status)
    .then(json)
    .then(function(data) {
      // console.log(data) ;
      ToTimHtml(data);
    })
    .catch(error);
}

function getTeamsIdDetail(teamid) {
  // let urlParams = new URLSearchParams(window.location.search);
  // let teamid = urlParams.get("id");
    return new Promise(function (resolve, reject) {
      if ('caches' in window) {
        caches.match(url_team + teamid).then(function (response) {
          if (response) {
            response.json().then(function (data) {
              resolve(data);
            });
          }
        });
      }
      fetchApi(url_team + teamid)
        .then(status)
        .then(json)
        .then(function(data) {
          // console.log(data) ;
          resolve(data);
        })
        .catch(error);
  });
}

function getFavoritTeam() {
  // let urlParams = new URLSearchParams(window.location.search);
  // let teamid = urlParams.get("id");
  var dataIndexDb = getAllDataFavorit();
  dataIndexDb.then(function (data) {
    
  var timBodyHtml = '';
   data.forEach(function(tim) {
       timBodyHtml +=`
            <li class="collection-item avatar">
              <img src=${tim.crestUrl.replace(/^http:\/\//i, 'https://')} alt="" class="circle">
              <span class="title">${tim.name}</span>
                <p>Address: ${tim.address}<br>
                website: <a href=${tim.website}>${tim.website}</a></p>

            </li>
  `;
   });
   document.getElementById("timBody").innerHTML = timBodyHtml;                  
  });
  
}

function ToTimHtml(data){
  var timHeaderHtml = '';
  var timBodyHtml = '';

  timHeaderHtml=`
      <img src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="100" height="100">
      <span class="card-title">${data.name}</span>
      <hr>
  `;

  timBodyHtml =`
      <p> Name : ${data.name} </p>
      <p> Address : ${data.address} </p>
      <p> Email : ${data.email} </p>
      <p> Stadion: ${data.venue} </p>
      <p> Website : ${data.website} </p>

  `;

   document.getElementById("timHeader").innerHTML = timHeaderHtml;
   document.getElementById("timBody").innerHTML = timBodyHtml;
}

function ToStandingsHtml(data){
   var standingsHTML = '';
    var standingsCardContent ='';

    standingsCardContent =`
       <span class="card-title">${data.competition.name} ${data.competition.area.name} ${data.standings[0].stage} ${data.competition.id} </span>
    `;
    data.standings[0].table.forEach(function(team) {
      // console.log(team,team.position);
      standingsHTML += `
                <td>${team.position}</td>
                <td>
                  <a href="./team.html?tim=${team.team.id}">
                  <p class="hide-on-small-only">
                    <img class="responsive-img" width="20" height="20" src="${ team.team.crestUrl || '/images/img/no_image.png'}">${team.team.name}
                  </p>
                  </a>
                  <a href="./team.html?tim=${team.team.id}">
                   <p class="hide-on-med-and-up">
                    <img class="responsive-img" width="20" height="20" src="${ team.team.crestUrl || '/images/img/no_image.png'}">
                  </p>
                  </a>
                </td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td><b>${team.points}</b></td>

              </tr>
          `;
    });
    document.getElementById("standings").innerHTML = standingsHTML;
}


function ToTopScrorerHtml(data){
    var topScorerTML = '';
      data.scorers.forEach(function(player) {
      // console.log(team,team.position);
      topScorerTML += `
             
               <li class="collection-item">
                <a href="./team.html?tim=${player.team.id}">  
                     <p>${player.player.name}  <a href="#!" class="secondary-content">${player.numberOfGoals}</a> <br>
                        ${player.team.name}
                       
                      </p>
                </a>
              </li>
          `;
    });

    document.getElementById("topScorer").innerHTML = topScorerTML;
}
