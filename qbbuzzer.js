var socket = io();
var name = "";
var playsound = true;
var sound = "pop";
var audio = document.getElementById("sound");
var buzzed=false;
var timeoutID;
$("#container").hide();
$('.clear').hide();
window.addEventListener("keydown",function(a){
	if(a.which==32)
		if(!buzzed)
			buzz()
		else
			clearbuzzer();
});

function buzz(){
	socket.emit("buzz",name);
	buzzed=true;
	return false;
}

function clearbuzzer(){
	console.log("clearsss");
	clearTimeout(timeoutID);
	socket.emit("clear","");
	buzzed=false;
	return false;
}

function checkname(){
	name = prompt('What is your username');
	socket.emit("check name", name);
	return false;
}

function togglesound(){
	playsound = !playsound;
	if(playsound){
		$("#togglesound").text("Sound: On")
		$("#changesound").show();
	}
	else{
		$("#togglesound").text("Sound: Off")
		$("#changesound").hide();
	}
}

function playSound(){
	if (playsound){
		audio.play();
	}
}

function changesound(){
	if(sound == "pop"){
		sound = "buzz";
		audio = document.getElementById("sound2");
		$("#changesound").text("Sound: Buzz");
	}
	else if(sound == "buzz"){
		sound = "pop";
		audio = document.getElementById("sound");
		$("#changesound").text("Sound: Pop");
	}
}




socket.on('locked', function(msg){
	$('#buzzbutton').addClass('locked').removeClass('default').text('Locked').prop("disabled",true);
	$('#container').text(msg+ " has buzzed").show(250);
	$('.clear').hide();
	playSound();
});

socket.on('your buzz', function(msg){
	$('#buzzbutton').addClass('buzzed').removeClass('default').text('Your Buzz').prop("disabled",true);
	$('.clear').show();
	timeoutID=setTimeout(clearbuzzer,5000);
	playSound();
});

socket.on('clear', function(msg){
	$('#buzzbutton').addClass('default').removeClass('buzzed').removeClass('locked').text('Buzz').prop("disabled",false);
	$('#container').text("").hide(350);
	$('.clear').hide();
});

socket.on('good name', function(msg){
	$("#users").append("<p> Your username is: "+msg+"</p>");
	$(document).attr("title","QBBuzzer - "+msg)
});

socket.on('bad name', function(msg){
	alert("Username already taken");
	checkname();
});

socket.on('add name', function(msg){
	$("#users").append("<tr id='"+msg+"'><td>"+msg+"</td></tr>");
});

socket.on('remove name', function(msg){
	$("#"+msg).remove();
});

checkname();