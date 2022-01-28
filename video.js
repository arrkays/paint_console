var video = document.getElementById('video');
let fps = 10;
let startV = 0;
let endV = 50;
let sleep = "0.1";
let stop = false;
// set canvasV size = video size when known
video.addEventListener('loadedmetadata', function() {
	
	
	//dimentioner
	canvasI.width = video.videoWidth;
	canvasI.height = video.videoHeight;
	canvasG.width = video.videoWidth;
	canvasG.height = video.videoHeight;
  
	bx=pasX*w;
	by=pasY*h;
	cadrillage(false);
	
	$("#containerImg").css ({width : video.videoWidth+"px"}); 
	$("#canvas").css ({height : video.videoHeight+"px"	}); 
	
	//range
	initSlider();
	endV = video.duration;
	$("#slider").css({display:"block"});
	document.querySelector("#convertV").style.display = "inline";
	document.querySelector("#convert").style.display = "none";
	video.style.display = "block";
	
	//$("#containerImg").center(); 
	$("#containerImg").fadeIn();
	
	
});
/*
video.addEventListener('play', function() {
  var $this = this; //cache
  (function loop() {
    if (!$this.paused && !$this.ended) {
		
		//draw frame
		ctxI.drawImage($this, 0, 0);

		//convert to console
		imgCenter();
		pushCtab();

		//export
		document.querySelector("#res").value += exp()+ "clear\n";
		
		//setTimeout(loop, 1000 / fps); // drawing at 30fps
		video.currentTime
    }
  })();
}, 0);
*/

function goVideo(){
	exportVideo(startV, endV, ()=>{});
}


function exportVideo(time, end, callback){
	if(time < end && !stop){
		
		//draw frame
		ctxI.drawImage(video, 0, 0);

		//convert to console
		algo();
		pushCtab(false);

		//export
		$("#res2").append(exp2() + "sleep "+sleep+"<br/>");
		
		setTimeout(function(){exportVideo(time + 1/fps, end, callback)}, 100);
		video.currentTime = time;
	}
	else{
		stop = false;
		callback();
	}
}


function loadVideo(file){
	
	video.src = file;

}


///SLIDER
$("#slider").on("valuesChanging", function(e, data){
	if(data.values.min != startV){
		startV = data.values.min;
		video.currentTime = data.values.min;
	}
	
	if(data.values.max != endV){
		video.currentTime = data.values.max;
		endV = data.values.max;
	}
	
	ctxI.drawImage(video, 0, 0);
});

function initSlider(){
	$("#slider").rangeSlider({
		bounds: {min: 0, max: video.duration},
		defaultValues: {min: 0, max: video.duration}
	});
	
	$("#slider").rangeSlider({
		formatter:function(val){
			var minutes = parseInt(val/60);
			var secondes = parseInt(val%60);
			if (secondes < 10)
				secondes="0"+secondes;
			return minutes+":"+secondes;
		}
	});

}
