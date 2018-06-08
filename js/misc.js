function showScreen (active, inactive){
	document.getElementById(active).style.display = "none";
	document.getElementById(inactive).style.display = "block";
	if (inactive === 'game-screen') {
		document.getElementById("name").style.display = "none";
		document.getElementById("bstart").style.display = "none";
		document.getElementById("bscores").style.display = "none";
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
		if(hs.length > 10)
		{
			for(var j = hs.length; j > 10; j--){
				hs.pop();
			}
		}
		window.localStorage.setItem("hss", JSON.stringify(hs));
	} catch (e) {
		document.getElementById("scores").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}
function end () {
	clearInterval(loop);
	clearInterval(mines);
	document.getElementById("bstart").style.display = "block";
	document.getElementById("bscores").style.display = "block";
	var name = document.getElementById("player").value;
	addScore(name, applesEaten);
}
