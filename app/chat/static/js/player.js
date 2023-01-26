var source = new EventSource('/stream');
var img = document.getElementById("img");
source.onmessage = function(e) {
    img.src = "data:image/jpeg;base64," + e.data;
};