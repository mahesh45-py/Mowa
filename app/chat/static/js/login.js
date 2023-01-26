const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


function getName() {
  var name = localStorage.getItem('mowaPeru', name)
  while (!name) {
    name = prompt("ne peru enti mowa?")
    if (name) {
      localStorage.setItem('mowaPeru', name)
    }

  }
  return name
}




const BOT_MSGS = [
  "Hi, how are you?",
  "Ohh... I can't understand what you trying to say. Sorry!",
  "I like to play games... But I don't know how to play!",
  "Sorry if my answers are not relevant. :))",
  "I feel sleepy! :("
];
// var baseURL = 'http://192.168.65.230:5000'
var baseURL = 'https://mowa.onrender.com'
// var socket = io.connect('https://mowa.onrender.com');
// var socket = io.connect('http://192.168.65.230:5000');

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;


  msgerInput.value = "";
  if (getName()) {
    postMessage(getName(), msgText)
  }

  // socket.emit( 'my event', {
  //   user_name : getName(),
  //   message : msgText
  // })
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
  }, delay);
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// socket.on( 'connect', function() {
//   socket.emit( 'my event', {
//     data: 'User Connected'
//   })
//   var form = $( 'form' ).on( 'submit', function( e ) {
//     e.preventDefault()
//     let user_name = $( 'input.username' ).val()
//     let user_input = $( 'input.message' ).val()
//     socket.emit( 'my event', {
//       user_name : user_name,
//       message : user_input
//     })
//     $( 'input.message' ).val( '' ).focus()
//   })

//   socket.on( 'my response', function( msg ) {
//     console.log( msg )
//     if( typeof msg.user_name !== 'undefined' ) {
//       var direction = msg.user_name == getName() ? "right" : "left";
//       appendMessage(msg.user_name,BOT_IMG, direction, msg.message)
//     }
//   })
// })


$(document).ready(function () {
  getMessages()
})
var lastid = 0

i=0


var source = new EventSource(`/getNewMessages?i=${i}`);

source.onmessage = function (e) {
  var messages = JSON.parse(e.data ? e.data.replace(/'/g, '"'): []);
  if(messages.length && messages[0].id>lastid){
    
    const i = messages.findIndex(o => o.id === lastid)
    var newMessages = messages.slice(0,i)
    newMessages.map((obj)=>{
      var direction = obj.username == getName() ? "right" : "left";
      appendMessage(obj.username, BOT_IMG, direction, obj.message)
    })
    lastid = messages[0].id
  }

};



function getMessages() {
  $.ajax({
    method: 'GET',
    url: `${baseURL}/record`,
    success: function (response) {
      displayMessaged(response.data)
      if (response.data.length) {
        lastid = response.data.slice(-1)[0].id
      }
    }
  })
}

function postMessage(user, message) {

  $.ajax({
    type: "POST",
    url: `${baseURL}/record`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ username: user, message: message }),
    contentType: 'application/json',
    success: function (response) {
      // Do something with the response
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.log("Error: " + error);
    }
  });
}

function displayMessaged(data) {
  data.map((obj) => {
    var direction = obj.username == getName() ? "right" : "left";
    appendMessage(obj.username, BOT_IMG, direction, obj.message)
  })
}

