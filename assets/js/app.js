// The findIdentifier is used in the app to find unique identifiers
// (Basically my own version of the getElementById function for this app)
function findIdentifier(name) {
  var elements = document.querySelectorAll(`[app-identifier="${name}"]`)
  if (elements[0]) {return elements[0]}
}





/*
Find what lesson a client is looking for,
if the lesson's manifest & content is found, display it,
else, give them a 404 page.
*/


function loadLesson(lessonID) {
  getJsonFile(`/app/lessons/${lessonID}/manifest.json`, data => {
    // do something with your data
    if (data !== "404") {
      findIdentifier("title").innerText = data.title;
      findIdentifier("header").style.backgroundImage = `url("${data.image}")`;

      document.addEventListener('DOMContentLoaded', (event) => {
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block);
        });
      });


      if (data.next !== null) {
        findIdentifier('next').href = `#${data.next}`;
        findIdentifier('next').classList.remove('hidden')
        findIdentifier('next').style.display = "block"
      }else {
        findIdentifier('next').style.display = "none"
      }
      if (data.prev !== null) {
        findIdentifier('prev').href = `#${data.prev}`;
        findIdentifier('prev').classList.remove('hidden')
        findIdentifier('prev').style.display = "block"
      }else {
        findIdentifier('prev').style.display = "none"
      }

      getHTMLFile(`/app/lessons/${lessonID}/content.html`, data => {
        if (data !== "404") {
          findIdentifier('lessonContent').innerHTML = data;
        }else {
          alert("Error: Failed to load lesson content")
        }
      })

    }else {
      location.href = "/app"
    }
  });
}


function getJsonFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var data = JSON.parse(httpRequest.responseText);
      if (callback) callback(data);
    }
    if (httpRequest.readyState === 4 && httpRequest.status === 404) {
      if (callback) callback("404")
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}
function getHTMLFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var data = httpRequest.responseText;
      if (callback) callback(data);
    }
    if (httpRequest.readyState === 4 && httpRequest.status === 404) {
      if (callback) callback("404")
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}
