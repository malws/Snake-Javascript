function showScreen (active, inactive){
	document.getElementById(active).style.display = "none";
	document.getElementById(inactive).style.display = "block";
	if (inactive === 'start-screen') {
		end();
		document.getElementById("name").style.top = "100px";
		document.getElementById("name").style.display = "block";
	}
	if (inactive === 'game-screen') {
		document.getElementById("bgquit").style.display = "none";
		document.getElementById("name").style.display = "none";
		document.getElementById("bgstart").style.display = "none";
		document.getElementById("bgscores").style.display = "none";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		init();
	}
	if(inactive === 'high-scores') {
		var hsc = new Array();
		if (typeof(Storage) !== "undefined") {
			// Store
			if (localStorage.getItem("hss") != null) {
				hsc = JSON.parse(window.localStorage.getItem("hss"));
				document.getElementById("tablecont").innerHTML = null;
				for (var i = 0; i < hsc.length; i++) {
					document.getElementById("tablecont").innerHTML += "<tr><td>" + hsc[i].name + "</td><td>" + hsc[i].score + "</td></tr>";
				}	
			}	
		}
		else {
			document.getElementById("scores").innerHTML = "Sorry, your browser does not support Web Storage...";
		}
		document.getElementById("name").style.top = "310px";
		document.getElementById("name").style.display = "block"; 		
	}
}

function addScore (name, score) {
	var hs = new Array();
	var newscore = {"name": name, "score": applesEaten};
	// Check browser support
	try {
		// Store
		if (window.localStorage.getItem("hss") === null) {
			hs.push(newscore);
		}
		else {
		// Retrieve
			hs = JSON.parse(window.localStorage.getItem("hss"));
			hs.push(newscore);
		}
		hs.sort(function(a,b) {return (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0);});
		if(hs.length > 5)
		{
			for(var j = hs.length; j > 5; j--){
				hs.pop();
			}
		}
		window.localStorage.setItem("hss", JSON.stringify(hs));
	} catch (e) {
		document.getElementById("scores").innerHTML = "Sorry, your browser does not support LocalStorage...";
	}
}
function end () {
	clearInterval(loop);
	clearInterval(mines);
	loop = null;
	document.getElementById("bgstart").style.display = "block";
	document.getElementById("bgscores").style.display = "block";
	var name = document.getElementById("player").value;
	if (applesEaten > 0) addScore(name, applesEaten);
}
