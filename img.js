//-----------------auther

let canvasI = document.querySelector("#img");
let canvasG = document.querySelector("#grille");
let ctxI = canvasI.getContext('2d');
let ctxG = canvasG.getContext('2d');
var isDownImg = false;
let ax=0;
let ay=0;
let bx=0;
let by=0;
let algo = ()=>{imgCenter(); };
let action;

canvasG.addEventListener('mousedown',e=>{
	 isDownImg = true;
	 ax = e.layerX;
	 ay = e.layerY;
});

canvasG.addEventListener('mouseup',e=>{
	 isDownImg = false;
	 bx = e.layerX;
	 by = e.layerY;
	 cadrillage(e.ctrlKey);
});

canvasG.addEventListener("mousemove", (e)=>{
	if(isDownImg){
		bx = e.layerX;
		by = e.layerY;
		cadrillage(e.ctrlKey);
	}
});

canvasG.addEventListener("mousemove", (e)=>{
	if(isDownImg){
		bx = e.layerX;
		by = e.layerY;
		cadrillage(e.ctrlKey);
	}
});

canvasG.addEventListener("dblclick", (e)=>{
	ax = e.layerX;
	ay = e.layerY;
	bx = ax + pasX*w;
	by = ay + pasY*h;
	cadrillage(e.ctrlKey);
});

document.querySelector("#full").addEventListener("click", (e)=>{
	ax = 0;
	ay = 0;
	bx = canvasI.width;
	by = canvasG.height;
	
	cadrillage(e.ctrlKey);
});

function loadImage(url) {
	return new Promise(r => { 
		let i = new Image(); 
		i.onload = (() => r(i)); 
		i.src = url; 
		i.crossOrigin = "Anonymous";
	});
}

async function load(url, ){
	let img = await loadImage(url);
	
	canvasI.width = img.width;
	canvasG.width = img.width;
	canvasI.height = img.height;
	canvasG.height = img.height;	
	document.querySelector("#canvas").style.width = canvasI.width = img.width;
	document.querySelector("#canvas").style.height = canvasI.height = img.height;

	ctxI.drawImage(img, 0, 0);
	bx=pasX*w;
	by=pasY*h;
	cadrillage(false);
	
	document.querySelector("#convertV").style.display = "none";
	document.querySelector("#convert").style.display = "inline";
	$("#slider").css({display:"none"});
	video.style.display = "none";
	
	$("#containerImg").css ({width : img.width+"px"}); 
	//$("#containerImg").center(); 
	$("#containerImg").fadeIn();
}

function cadrillage(prop){
	ctxG.clearRect(0,0,canvasI.width,canvasI.height);
	ctxG.strokeStyle = "#000";
	

	
	let stepX = (bx-ax)/w;
	
	if(prop){
		by = ay + h * ((stepX/pasX) * pasY);
	}

	let stepY = (by-ay)/h;
	
	if(stepX<1)
		stepX=1;
	if(stepY<1)
		stepY=1;
	
	if(bx-ax < w)
		bx=ax+w;
		
	if(by-ay < h)
		by=ay+h;
	
	pw=stepX;
	ph=stepY;

	//ligne
	for(var i = 0; i < h; i++){
		ctxG.beginPath();
		ctxG.moveTo(ax, ay+stepY*i);
		ctxG.lineTo(bx, ay+stepY*i);
		ctxG.stroke();
	}
	
	//colone
	for(var j = 0; j < w; j++){
		ctxG.beginPath();
		ctxG.moveTo(ax+stepX*j, ay);
		ctxG.lineTo(ax+stepX*j, by);
		ctxG.stroke();
	}
	ctxG.strokeRect(ax,ay,bx-ax,by-ay);
}

//load("1.jpg");

//-------------*********************-------------*********************-------------*********************-------------*********************
//--------------------------*********************-------------*********************-------------*********************-------------*********************
//--------------------------*********************-------------*********************-------------*********************-------------*********************
//-------------



let pw = 8; //pixel width
let ph = 16; //pixel width

document.querySelector("#selectAlgo").addEventListener('change',function(){
	
	if(this.value == "center"){
		algo = imgCenter();
	}
	if(this.value == "moyen"){
		algo = imgToAvgColor();
	}
	if(this.value == "max"){
		algo = imgToMaxColor();
	}
	if(this.value == "maxavg"){
		algo = imgToMaxColorAvg(); 
	}	
});

document.querySelector("#convert").addEventListener('click',e=>{
	algo();
	pushCtab();
});

document.querySelector("#convertV").addEventListener('click',e=>{
	goVideo();
});

document.querySelector("#close").addEventListener('click',e=>{
	$("#containerImg").fadeOut();
	//pushCtab();
});

document.querySelector("#load").addEventListener('change',e=>{
		var file_data = $('#load').prop('files')[0];   
		var form_data = new FormData();                  
		form_data.append('file', file_data);
		$.ajax({
			url: 'upload.php', // point to server-side PHP script 
			dataType: 'text',  // what to expect back from the PHP script, if anything
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,                         
			type: 'post',
			success: function(php_script_response){
				if(format(php_script_response) == "v"){
					action = goVideo;
					loadVideo(php_script_response)
				}
				else if(format(php_script_response) == "i"){
					load(php_script_response);
					action = algo;
				}
				else{
					alert("format non supporter");
				}
			}
		 });
});

function format(file){
	let res = false;
	var patt1=/\.[0-9a-z]+$/i;
	let acceptedFormatVideo = ["ogg","webm","mp4"];	
	let ext = file.substring(file.lastIndexOf(".")+1);
	ext = ext.toLowerCase();
	for (var i=0; i< acceptedFormatVideo.length && res == false; i++){
		if(acceptedFormatVideo[i] == ext)
			res = "v";
	}
	
	let acceptedFormatImage = ["jpeg","jpg","webp","gif","png","apng","svg", "pdf","xbm","bmp","ico"];
	for (var i=0; i< acceptedFormatImage.length && res == false; i++){
		if(acceptedFormatImage[i] == ext)
			res = "i";
	}
	
	
	return res; 
}

function imgCenter(){
	
	var x=0;
	var y=0;
	
	for(var i = ay; i< by; i+=ph){
		for (var j = ax; j < bx; j+=pw){
			var data = ctxI.getImageData(j+pw/2,i+ph/2,1,1).data;
	
			var cOut = closer({r:data[0], g:data[1], b:data[2]});

			ctx.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctx.fillRect(x*pasX, y*pasY, pasX, pasY);
			x++;
		}
		////console.log("line "+i);
		y++;
		x=0;
	}
}

function imgToAvgColor(){
	
	
	var x=0;
	var y=0;
	
	for(var i = ay; i< by; i+=ph){
		for (var j = ax; j < bx; j+=pw){
			var data = ctxI.getImageData(j,i,pw,ph).data;
			
			var colorObj = average(data);
			var cOut = closer(colorObj);

			ctx.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctx.fillRect(x*pasX, y*pasY, pasX, pasY);
			x++;
		}
		loader((i+ph)/by);
		y++;
		x=0;
	}
}

function imgToMaxColor(){

	for (var i = ay; i< by; i++){
		for (var j = ax; j< bx; j++){
			var data = ctxI.getImageData(j,i,1,1).data;
			
		var cOut = closer({r:data[0], g:data[1], b:data[2]});
			//var cOut = colorObj;
			ctxI.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctxI.fillRect(j, i, 1, 1);
		}
		loader((i+ph)/by);
	}
	
	var x=0;
	var y=0;
	for(var i = ay; i< by; i+=ph){
		for (var j = ax; j < bx; j+=pw){
			var data = ctxI.getImageData(j,i,pw,ph).data;//<-------------------------------------ERROR
			var cOut = maxColor(data);
			ctx.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctx.fillRect(x*pasX, y*pasY, pasX, pasY);
			x++;
		}
		y++;
		x=0;
		loader((i+ph)/by);
	}
}


function imgToMaxColorAvg(){

	for (var i = ay; i< by; i++){
		for (var j = ax; j< bx; j++){
			var data = ctxI.getImageData(j,i,1,1).data;
			
			var cOut = closer({r:data[0], g:data[1], b:data[2]});
			ctxI.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctxI.fillRect(j, i, 1, 1);
		}
		loader((i+ph)/by);
	}
	
	var x=0;
	var y=0;
	for(var i = ay; i< by; i+=ph){
		for (var j = ax; j < bx; j+=pw){
			var data = ctxI.getImageData(j,i,pw,ph).data;
			
			var cOut = maxColorAvg(data);
			ctx.fillStyle="rgb("+cOut.r+","+cOut.g+","+cOut.b+")";
			ctx.fillRect(x*pasX, y*pasY, pasX, pasY);
			x++;
		}
		y++;
		x=0;
		loader((i+ph)/by);
	}
}


function maxColor(data){
	var colors = {};
	var r = 0;
	var g = 0;
	var b = 0;
	var max = 0;
	var maxColor;
	
	for(var k = 0; k < data.length; k++){
		if(k%4 == 0){
			r=data[k];
		}
		else if (k%4 == 1){
			g=data[k];
		}
		else if (k%4 == 2){
			b=data[k];
		}
		
		else if (k%4 == 3){
			var color = rgbToHex(r,g,b);
			if(colors[color]){
				colors[color]++;
			}
			else{
				colors[color] = 1;
			}
			
			if(	colors[color] > max ){
				maxColor = color;
				max = colors[color];
			}
		}
	}
	//////console.log(colors);
	return hexToRgb(maxColor);
}

function maxColorAvg(data){
	var colors = {};
	var r = 0;
	var g = 0;
	var b = 0;
	var max = 0;
	var maxColor;
	
	for(var k = 0; k < data.length; k++){
		if(k%4 == 0){
			r=data[k];
		}
		else if (k%4 == 1){
			g=data[k];
		}
		else if (k%4 == 2){
			b=data[k];
		}
		
		else if (k%4 == 3){
			var color = rgbToHex(r,g,b);
			if(colors[color]){
				colors[color]++;
			}
			else{
				colors[color] = 1;
			}
			
			if(	colors[color] > max ){
				maxColor = color;
				max = colors[color];
			}
		}
	}
	
	var seuil = max * 1;
	//////console.log(colors);
	var colorsName = Object.keys(colors);
	colorsName.forEach (e=>{
		if(colors[e] < seuil){
			delete colors[e];
		}
	});
	
	//avg colors
	r=g=b=0;
	
	
	
	colorsName = Object.keys(colors);
	//////console.log(colors);
	colorsName.forEach (e=>{
		var c = hexToRgb(e);
		r+=c.r;
		g+=c.g;
		b+=c.b;
	});
	
	
	
	r=parseInt(r/(colorsName.length));
	g=parseInt(g/(colorsName.length));
	b=parseInt(b/(colorsName.length));
	
	var res = closer({r:r,g:g,b:b});
	////console.log(res)
	return res;
}

function average(data){
	var r = 0;
	var g = 0;
	var b = 0;
	
	for(var k = 0; k < data.length; k++){
		if(k%4 == 0){
			r+=data[k];
		}
		else if (k%4 == 1){
			g+=data[k];
		}
		else if (k%4 == 2){
			b+=data[k];
		}
	}
	
	r=parseInt(r/(data.length/4));
	g=parseInt(g/(data.length/4));
	b=parseInt(b/(data.length/4));
	
	//
	var colorObj = {r:r,g:g,b:b};
	return colorObj;
}


function closer(rgb){
	c=[{r:128,g:0,b:0}, {r:0,g:128,b:0}, {r:128,g:128,b:0}, {r:0,g:0,b:128}, {r:128,g:0,b:128}, {r:0,g:128,b:128}, {r:192,g:192,b:192}, {r:128,g:128,b:128}, {r:255,g:0,b:0}, {r:0,g:255,b:0}, {r:255,g:255,b:0}, {r:0,g:0,b:255}, {r:255,g:0,b:255}, {r:0,g:255,b:255}, {r:255,g:255,b:255}, {r:0,g:0,b:0}, {r:0,g:0,b:95}, {r:0,g:0,b:135}, {r:0,g:0,b:175}, {r:0,g:0,b:215}, {r:0,g:0,b:255}, {r:0,g:95,b:0}, {r:0,g:95,b:95}, {r:0,g:95,b:135}, {r:0,g:95,b:175}, {r:0,g:95,b:215}, {r:0,g:95,b:255}, {r:0,g:135,b:0}, {r:0,g:135,b:95}, {r:0,g:135,b:135}, {r:0,g:135,b:175}, {r:0,g:135,b:215}, {r:0,g:135,b:255}, {r:0,g:175,b:0}, {r:0,g:175,b:95}, {r:0,g:175,b:135}, {r:0,g:175,b:175}, {r:0,g:175,b:215}, {r:0,g:175,b:255}, {r:0,g:215,b:0}, {r:0,g:215,b:95}, {r:0,g:215,b:135}, {r:0,g:215,b:175}, {r:0,g:215,b:215}, {r:0,g:215,b:255}, {r:0,g:255,b:0}, {r:0,g:255,b:95}, {r:0,g:255,b:135}, {r:0,g:255,b:175}, {r:0,g:255,b:215}, {r:0,g:255,b:255}, {r:95,g:0,b:0}, {r:95,g:0,b:95}, {r:95,g:0,b:135}, {r:95,g:0,b:175}, {r:95,g:0,b:215}, {r:95,g:0,b:255}, {r:95,g:95,b:0}, {r:95,g:95,b:95}, {r:95,g:95,b:135}, {r:95,g:95,b:175}, {r:95,g:95,b:215}, {r:95,g:95,b:255}, {r:95,g:135,b:0}, {r:95,g:135,b:95}, {r:95,g:135,b:135}, {r:95,g:135,b:175}, {r:95,g:135,b:215}, {r:95,g:135,b:255}, {r:95,g:175,b:0}, {r:95,g:175,b:95}, {r:95,g:175,b:135}, {r:95,g:175,b:175}, {r:95,g:175,b:215}, {r:95,g:175,b:255}, {r:95,g:215,b:0}, {r:95,g:215,b:95}, {r:95,g:215,b:135}, {r:95,g:215,b:175}, {r:95,g:215,b:215}, {r:95,g:215,b:255}, {r:95,g:255,b:0}, {r:95,g:255,b:95}, {r:95,g:255,b:135}, {r:95,g:255,b:175}, {r:95,g:255,b:215}, {r:95,g:255,b:255}, {r:135,g:0,b:0}, {r:135,g:0,b:95}, {r:135,g:0,b:135}, {r:135,g:0,b:175}, {r:135,g:0,b:215}, {r:135,g:0,b:255}, {r:135,g:95,b:0}, {r:135,g:95,b:95}, {r:135,g:95,b:135}, {r:135,g:95,b:175}, {r:135,g:95,b:215}, {r:135,g:95,b:255}, {r:135,g:135,b:0}, {r:135,g:135,b:95}, {r:135,g:135,b:135}, {r:135,g:135,b:175}, {r:135,g:135,b:215}, {r:135,g:135,b:255}, {r:135,g:175,b:0}, {r:135,g:175,b:95}, {r:135,g:175,b:135}, {r:135,g:175,b:175}, {r:135,g:175,b:215}, {r:135,g:175,b:255}, {r:135,g:215,b:0}, {r:135,g:215,b:95}, {r:135,g:215,b:135}, {r:135,g:215,b:175}, {r:135,g:215,b:215}, {r:135,g:215,b:255}, {r:135,g:255,b:0}, {r:135,g:255,b:95}, {r:135,g:255,b:135}, {r:135,g:255,b:175}, {r:135,g:255,b:215}, {r:135,g:255,b:255}, {r:175,g:0,b:0}, {r:175,g:0,b:95}, {r:175,g:0,b:135}, {r:175,g:0,b:175}, {r:175,g:0,b:215}, {r:175,g:0,b:255}, {r:175,g:95,b:0}, {r:175,g:95,b:95}, {r:175,g:95,b:135}, {r:175,g:95,b:175}, {r:175,g:95,b:215}, {r:175,g:95,b:255}, {r:175,g:135,b:0}, {r:175,g:135,b:95}, {r:175,g:135,b:135}, {r:175,g:135,b:175}, {r:175,g:135,b:215}, {r:175,g:135,b:255}, {r:175,g:175,b:0}, {r:175,g:175,b:95}, {r:175,g:175,b:135}, {r:175,g:175,b:175}, {r:175,g:175,b:215}, {r:175,g:175,b:255}, {r:175,g:215,b:0}, {r:175,g:215,b:95}, {r:175,g:215,b:135}, {r:175,g:215,b:175}, {r:175,g:215,b:215}, {r:175,g:215,b:255}, {r:175,g:255,b:0}, {r:175,g:255,b:95}, {r:175,g:255,b:135}, {r:175,g:255,b:175}, {r:175,g:255,b:215}, {r:175,g:255,b:255}, {r:215,g:0,b:0}, {r:215,g:0,b:95}, {r:215,g:0,b:135}, {r:215,g:0,b:175}, {r:215,g:0,b:215}, {r:215,g:0,b:255}, {r:215,g:95,b:0}, {r:215,g:95,b:95}, {r:215,g:95,b:135}, {r:215,g:95,b:175}, {r:215,g:95,b:215}, {r:215,g:95,b:255}, {r:215,g:135,b:0}, {r:215,g:135,b:95}, {r:215,g:135,b:135}, {r:215,g:135,b:175}, {r:215,g:135,b:215}, {r:215,g:135,b:255}, {r:215,g:175,b:0}, {r:215,g:175,b:95}, {r:215,g:175,b:135}, {r:215,g:175,b:175}, {r:215,g:175,b:215}, {r:215,g:175,b:255}, {r:215,g:215,b:0}, {r:215,g:215,b:95}, {r:215,g:215,b:135}, {r:215,g:215,b:175}, {r:215,g:215,b:215}, {r:215,g:215,b:255}, {r:215,g:255,b:0}, {r:215,g:255,b:95}, {r:215,g:255,b:135}, {r:215,g:255,b:175}, {r:215,g:255,b:215}, {r:215,g:255,b:255}, {r:255,g:0,b:0}, {r:255,g:0,b:95}, {r:255,g:0,b:135}, {r:255,g:0,b:175}, {r:255,g:0,b:215}, {r:255,g:0,b:255}, {r:255,g:95,b:0}, {r:255,g:95,b:95}, {r:255,g:95,b:135}, {r:255,g:95,b:175}, {r:255,g:95,b:215}, {r:255,g:95,b:255}, {r:255,g:135,b:0}, {r:255,g:135,b:95}, {r:255,g:135,b:135}, {r:255,g:135,b:175}, {r:255,g:135,b:215}, {r:255,g:135,b:255}, {r:255,g:175,b:0}, {r:255,g:175,b:95}, {r:255,g:175,b:135}, {r:255,g:175,b:175}, {r:255,g:175,b:215}, {r:255,g:175,b:255}, {r:255,g:215,b:0}, {r:255,g:215,b:95}, {r:255,g:215,b:135}, {r:255,g:215,b:175}, {r:255,g:215,b:215}, {r:255,g:215,b:255}, {r:255,g:255,b:0}, {r:255,g:255,b:95}, {r:255,g:255,b:135}, {r:255,g:255,b:175}, {r:255,g:255,b:215}, {r:255,g:255,b:255}, {r:8,g:8,b:8}, {r:18,g:18,b:18}, {r:28,g:28,b:28}, {r:38,g:38,b:38}, {r:48,g:48,b:48}, {r:58,g:58,b:58}, {r:68,g:68,b:68}, {r:78,g:78,b:78}, {r:88,g:88,b:88}, {r:98,g:98,b:98}, {r:108,g:108,b:108}, {r:118,g:118,b:118}, {r:128,g:128,b:128}, {r:138,g:138,b:138}, {r:148,g:148,b:148}, {r:158,g:158,b:158}, {r:168,g:168,b:168}, {r:178,g:178,b:178}, {r:188,g:188,b:188}, {r:198,g:198,b:198}, {r:208,g:208,b:208}, {r:218,g:218,b:218}, {r:228,g:228,b:228}, {r:238,g:238,b:238}];
	var res;
	var a = new THREE.Vector3( rgb.r, rgb.g, rgb.b );
	var minD = 300;
	c.forEach((e)=>{
		const b = new THREE.Vector3(e.r,e.g,e.b);
		const d = a.distanceTo(b);
		if(d < minD){
			res = e;
			minD=d;
		}
	});
	return res;
}

//tools
function pushCtab(hist = true){
	var data = ctx.getImageData(0,0,can.width,can.height).data;
	//var pointer = 0;
	//console.log(data.length);
	for(var i = 0; i < h; i++){
		for(var j = 0; j < w; j++){
			var k = i * w * pasX  * pasY * 4;
			k+=j*pasX*4;
			
			var color = rgbToHex(data[k], data[k+1], data[k+2]);
			
			ctab[i][j] = mkColor(objColors[color]);
		}
	}
	if(hist)
		history.push(cloneTab(ctab));
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

function loader(i){
	//$("#loader").css({width:i*100+"%"});
	//console.log(parseInt(i*100)+"%");
}