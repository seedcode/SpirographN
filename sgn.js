var sgn = (function(settings){
	'use strict'
	
	return {
		load:load,
	}
	
	//public function
	
	function load(sidebarId,canvasDivId){
		
		var v;
		var r;
		var t;
		var n;
		var c;
		var a;
		var d;
		var o;
		
		//establish sidebar and pad
		if(!sidebarId||!canvasDivId){
			alert("Error:Canvas and Sidebar not specified");
			return;
		}
		
		settings.sidebarDiv = document.getElementById(sidebarId);
		settings.divCanvas = document.getElementById(canvasDivId);
		
		//preserve ids specified in ininitial call
		settings.idNames.sidebar=sidebarId;
		settings.idNames.pad=canvasDivId;
		
		//set classes
		settings.sidebarDiv.className="sidebar";
		settings.divCanvas.className="pad";
		
		//create data object from url
		//load preset/favorote from settings if none retrieved from the URL
		var parms=location.search.substring(1).split("&");
		if(parms[0]){
			d={};
			for(c in parms){
				a=parms[c].split("=");
				d[a[0]]=decodeURIComponent(a[1]);
			}
			if(d["cl"]){
			//append hash to color
        d["cl"]="#"+d["cl"];
			}
			
			if(d["pre"]){
			//a preset was passed, so use that
				for(c in settings.presets){
					if(settings.presets[c].name===d["pre"]){
						d=settings.presets[c];
					}
				}
			}
			if(!d["st"]||!d["r1"]||!d["pen"]){
			//validate object properties or else load pre-set
				var preSet = Math.round(Math.random()*(settings.presets.length-1));
				d = settings.presets[preSet];
			}
			if(!d["sp"]){
				//set speed if not specified
				d["sp"]=1;
			}
		}
		else{
			//no parms specified
			var preSet = Math.round(Math.random()*(settings.presets.length-1));
			d = settings.presets[preSet];
		}
		
		//remove rotors to start clean
		while (settings.sidebarDiv.firstChild) {
		    settings.sidebarDiv.removeChild(settings.sidebarDiv.firstChild);
		}
				
		//add static elements and values from preset
		//add events to inputs
		var e = document.createElement("SPAN");
		e.className="title";
		e.innerHTML="Spirograph";
		e.innerHTML+='<span class="n">&#8319;</span>';
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="label";
		e.innerHTML="presets";
		settings.sidebarDiv.appendChild(e);
		
		var sel = document.createElement("SELECT");
		sel.className="preset";
		sel.setAttribute("name","presets");
		sel.setAttribute("id",settings.idNames.presets);
		for(c in settings.presets){
	    o=document.createElement("OPTION");
			o.setAttribute("value",settings.presets[c].name);
			o.innerHTML=settings.presets[c].name;
			sel.appendChild(o);
		}
		settings.sidebarDiv.appendChild(sel)
		presetEvent(settings.idNames.presets,"change");
		

		
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="label";
		e.innerHTML="stator";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="letterLabel";
		e.innerHTML="sr";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("INPUT");
		e.className="number";
		e.setAttribute("type","number");
		e.setAttribute("value",d.st);
		e.setAttribute("id",settings.idNames.stator);
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.stator,"input");
		
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="label";
		e.innerHTML="rotors";
		settings.sidebarDiv.appendChild(e);
		
		var b = document.createElement("BUTTON");
		b.className="add";
		b.setAttribute("id",settings.idNames.add);
		var i = document.createElement("IMG");
		i.className="add";
		i.setAttribute("src","img/add.png");
		b.appendChild(i);
		settings.sidebarDiv.appendChild(b);
		addButton(settings.idNames.add);
		
		e = document.createElement("SPAN");
		e.className="buttonLabel";
		e.innerHTML="add rotor";
		e.setAttribute("id",settings.idNames.addLabel);
		settings.sidebarDiv.appendChild(e);
		addButton(settings.idNames.addLabel);
		
		e = document.createElement("DIV");
		e.className="rotors";
		e.setAttribute("id",settings.idNames.rotors);
		settings.sidebarDiv.appendChild(e);
		
		//add delete block
		e = document.createElement("DIV");
		e.setAttribute("id",settings.idNames.deleteBlock);
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		//add pen block first as rotor routine appends values;
		e = document.createElement("SPAN");
		e.className="label";
		e.innerHTML="pen";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="letterLabel";
		e.innerHTML="r";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("INPUT");
		e.className="number";
		e.setAttribute("type","number");
		e.setAttribute("id",settings.idNames.pen);
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.pen,"input");
		
		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="letterLabel";
		e.innerHTML="w";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("INPUT");
		e.className="number";
		e.setAttribute("type","number");
		e.setAttribute("id",settings.idNames.width);
		e.setAttribute("step",".01");
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.width,"input");
		
		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="letterLabel";
		e.innerHTML="c";
		settings.sidebarDiv.appendChild(e);
		
		if(colorInputOK()){
			//load color input 
			e = document.createElement("INPUT");
			e.className="color";
			e.setAttribute("type","color");
			e.setAttribute("id",settings.idNames.color);
			settings.sidebarDiv.appendChild(e);
			inputEvent(settings.idNames.color,"input");
		}
		else{
		  //load select color list if color input unavailable
			var e = document.createElement("SELECT");
			e.className="text";
			e.setAttribute("name","colors");
			e.setAttribute("id",settings.idNames.color);
			for(c in settings.penColors){
		    o=document.createElement("OPTION");
				o.setAttribute("value",settings.penColors[c].hex);
				o.innerHTML=settings.penColors[c].name;
				e.appendChild(o);
			}
			settings.sidebarDiv.appendChild(e)
			inputEvent(settings.idNames.color,"change");
	  }
		
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="label";
		e.innerHTML="speed";
		settings.sidebarDiv.appendChild(e);
		
		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);
		
		var e = document.createElement("SELECT");
		e.className="preset";
		e.setAttribute("name","speeds");
		e.setAttribute("id",settings.idNames.speed);
		for(c in settings.speedSettings){
	    o=document.createElement("OPTION");
			o.setAttribute("value",settings.speedSettings[c].speed);
			o.innerHTML=settings.speedSettings[c].name;
			e.appendChild(o);
		}
		settings.sidebarDiv.appendChild(e)
		inputEvent(settings.idNames.speed,"change");
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		var b = document.createElement("BUTTON");
		b.className="draw";
		b.setAttribute("id",settings.idNames.draw);
    b.innerHTML="draw";
		settings.sidebarDiv.appendChild(b);
		drawButton(settings.idNames.draw);
				
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
    b = document.createElement("BUTTON");
		b.className="button";
		b.setAttribute("id",settings.idNames.clear);
    b.innerHTML="clear drawing";
		settings.sidebarDiv.appendChild(b);
		clearButton(settings.idNames.clear);
		
    b = document.createElement("BUTTON");
		b.className="button";
		b.setAttribute("id",settings.idNames.reset);
    b.innerHTML="reset position";
		settings.sidebarDiv.appendChild(b);
		resetButton(settings.idNames.reset);
		
    b = document.createElement("BUTTON");
		b.className="button";
		b.setAttribute("id",settings.idNames.hide);
    b.innerHTML="hide circles";
		settings.sidebarDiv.appendChild(b);
		hideButton(settings.idNames.hide);
		
		e = document.createElement("DIV");
		e.className="divSeparator";
		settings.sidebarDiv.appendChild(e);
		
		
		//load canvas		
		setValues();
		
		//add canvas
		drawCanvas();
		
		//load values into inputs
    var lr=loadValues(d);
		
		window.onresize = function(e){
			resizeCanvas(e);
		};
	}
	
	//private functions
	
	function loadValues(d){
		
		//set values from d. d is either a loaded preset or created from the url		
		document.getElementById(settings.idNames.stator).value=d.st;
		document.getElementById(settings.idNames.pen).value=d.pen;
		document.getElementById(settings.idNames.width).value=d.wd;
		document.getElementById(settings.idNames.color).value=d.cl;
		document.getElementById(settings.idNames.speed).value=d.sp;
		document.getElementById(settings.idNames.presets).value=d.name;
		
		//remove rotors to start clean
		var rotors = document.getElementById(settings.idNames.rotors);
		while (rotors.firstChild) {
		    rotors.removeChild(rotors.firstChild);
		}
		
		//loop to add rotors
		var c = 1;
		var v;
		var r;
		var t;
		while(d["r"+c]){
			v=d["r"+c];
			r=v.substring(0,v.length-1);
			t=v.substring(v.length-1);
			addRotor(c,r,t);
			c++;
		}
		
		//track (and maintain) number of rotors
		settings.numRotors=c-1;
		
		//if we only have one rotor, then we don't want the delete button.
		if(settings.numRotors===1&&document.getElementById(settings.idNames.deleteLine)){
			var element = document.getElementById(settings.idNames.deleteLine);
			element.parentNode.removeChild(element);
			var element = document.getElementById(settings.idNames.deleteSep);
			element.parentNode.removeChild(element);
		};

    //create delete button if we need and don't have
		if(settings.numRotors>1&&document.getElementById(settings.idNames.delete)===null){
			addDeleteButton()
		}
		
		//write values from inputs to settings
		setValues();
		
		//if we're not drawing, then we'll show the circles on change
		if(!settings.draw){
			settings.circles="show";
			document.getElementById(settings.idNames.hide).innerHTML="hide circles";
		}
				
		//reset if we're not drawing	
		if(!settings.draw){
			reset();
      drawCircles();
		}
		
		//return number of rotors created
		return c-1;
	}
	
	function addRotor(num,r,type){

		var div = document.getElementById(settings.idNames.rotors);
					
		var item = document.createElement("DIV");
		item.setAttribute("id",settings.idNames.item+num);
		div.appendChild(item);
		
		var e = document.createElement("DIV");
		e.className = "divSeparator";
		item.appendChild(e);
		
		var e = document.createElement("SPAN");
		e.className="letterLabel";
		e.setAttribute("style","margin:0px");
		e.innerHTML="r"+num;
		item.appendChild(e);
		
    e = document.createElement("INPUT");
		e.className="number";
		e.setAttribute("type","number");
		e.setAttribute("id",settings.idNames.rotor+num);
		e.setAttribute("value",r);
		item.appendChild(e);
		inputEvent(settings.idNames.rotor+num,"input");
				
		//type					
    e = document.createElement("INPUT");
		e.setAttribute("type","radio");
		e.setAttribute("class","radio");
		e.setAttribute("id",settings.idNames.h+num);
		e.setAttribute("name","type"+num);
		e.setAttribute("value","hypotrochoid");
	  if(type==="h"){
		  e.setAttribute("checked",true);
		}
		item.appendChild(e);
		inputEvent(settings.idNames.h+num,"click");
		
    e = document.createElement("SPAN");
    e.className="letterLabel";
		e.innerHTML="h";
		item.appendChild(e);
					
    e = document.createElement("INPUT");
		e.setAttribute("type","radio");
		e.setAttribute("class","radio");
		e.setAttribute("id",settings.idNames.e+num);
		e.setAttribute("name","type"+num);
		e.setAttribute("value","epitrochoid");
	  if(type==="e"){
		  e.setAttribute("checked",true);
		}
		item.appendChild(e);
		inputEvent(settings.idNames.e+num,"click");
		
    e = document.createElement("SPAN");
    e.className="letterLabel";
		e.innerHTML="e";
		item.appendChild(e);
	}
	
	function setValues(){
				
		settings.radii=[document.getElementById(settings.idNames.stator).value];
    settings.curveColor=document.getElementById(settings.idNames.color).value;
		settings.curveWidth=document.getElementById(settings.idNames.width).value;
		settings.penRad=[document.getElementById(settings.idNames.pen).value];
		settings.speed=document.getElementById(settings.idNames.speed).value
	
		settings.types=[""];
		settings.pitches=[1];
		settings.drawPitches=[];
		settings.spinPitches=[]
		
		var c = 1;
	  var thisId = settings.idNames.rotor + c;
		var thisHId = settings.idNames.h + c;
		var thisEId = settings.idNames.e + c;
		
		var thisRotor;
		var thisType;
		var thisHId;
		var thisEId;
				
		//build arrays
		while(document.getElementById(thisId)){
			thisRotor = document.getElementById(thisId).value;
			settings.radii.push(thisRotor);
			
			if(document.getElementById(thisHId).checked){
				settings.types.push("h");
				if(c>1){
					settings.drawPitches.push(settings.spinPitches[c-2]);
					settings.spinPitches.push((settings.radii[c-1]/thisRotor)-1);
					if(settings.types[c-1]==="h"){
					  settings.directions.push(settings.directions[c-1]);
					}
					else{
						settings.directions.push(settings.directions[c-1]*-1);
					}
				}
				else{
					settings.directions=[1,1];
					settings.drawPitches.push(1);
					settings.spinPitches.push((settings.radii[c-1]/thisRotor)-1);
				}
			}
			else{
				settings.types.push("e");
				if(c>1){
					settings.drawPitches.push(settings.spinPitches[c-2]);
					settings.spinPitches.push((settings.radii[c-1]/thisRotor)+1);
					if(settings.types[c-1]==="h"){
					  settings.directions.push(settings.directions[c-1]);
				  }
					else(
						settings.directions.push(settings.directions[c-1]*-1)
					)				
				}
				else{
					settings.directions=[1,1];
					settings.drawPitches.push(1);
					settings.spinPitches.push((settings.radii[c-1]/thisRotor)+1);
					
				}
			}
			c++;
      thisId = settings.idNames.rotor + c;
			thisHId = settings.idNames.h + c;
			thisEId = settings.idNames.e + c;
	  }	 	

		settings.numRotors=c-1;
	} 
	
	function drawCanvas(){
		//create canvas elements then call resize routine
		settings.canvasCircles = document.createElement("canvas");
		settings.canvasCircles.id = settings.idNames.canvasCircles;
		settings.canvasPen = document.createElement("canvas");
		settings.canvasPen.id = settings.idNames.canvasPen;
		settings.divCanvas.appendChild(settings.canvasCircles);
		settings.divCanvas.appendChild(settings.canvasPen);
		resizeCanvas();
	}
	
	function resizeCanvas(){
		
		//capture current draw state and pause drawing.
		var drawing=settings.draw;
		settings.draw=false;
		 		
		//we need to capture the current drawing and redraw when set
		var ctx=settings.canvasPen.getContext("2d");
		var cd=ctx.getImageData(0,0,settings.canvasCircles.width,settings.canvasCircles.width);
		
		//fill window
		settings.windowWidth = window.innerWidth;
		settings.windowHeight = window.innerHeight;
		settings.divCanvasWidth = 98.5;
		settings.divCanvasHeight = settings.windowHeight-28;
		settings.sidebarWidth = settings.sidebarDiv.clientWidth;
		
		//set sidebar and pad sizes and store in settings
		settings.divCanvas.setAttribute("style","width:" + settings.divCanvasWidth + "%;height:" + settings.divCanvasHeight + "px;background:white");
		settings.sidebarDiv.setAttribute("style","min-height:" + settings.divCanvasHeight + "px;");
		settings.left = settings.divCanvas.offsetLeft + settings.sidebarWidth;
		settings.top = settings.divCanvas.offsetTop;
		
		//if we're resizing and we have a previous poisition, then track the offset, so we can redraw our canvases in position
		//round the coordinates for the center, otherwise the redraws are off.
		if(settings.a){
		  settings.offsetL=(Math.round((settings.divCanvas.clientWidth - settings.sidebarWidth)/2))-24-settings.a;
		  settings.offsetT=Math.round((settings.divCanvasHeight/2))-settings.b;
		}
		
		//now recenter
		settings.a = Math.round(((settings.divCanvas.clientWidth - settings.sidebarWidth)/2))-24 ;
		settings.b = Math.round((settings.divCanvasHeight/2));
		
		//resize canvases
		settings.canvasCircles.height = settings.divCanvasHeight;
		settings.canvasCircles.width = settings.divCanvas.clientWidth - settings.sidebarWidth;
		settings.canvasCircles.setAttribute("Style","left:"+settings.left+"px;top:"+settings.top+"px;position:absolute;z-index:10");
		settings.canvasPen.height = settings.divCanvasHeight;
		settings.canvasPen.width = settings.divCanvas.clientWidth - settings.sidebarWidth;
		settings.canvasPen.setAttribute("Style","left:"+settings.left+"px;top:"+settings.top+"px;position:absolute;z-index:20");

		
		
		//update coordinates based on new position
		if(settings.penStart.x!=0){
			settings.penStart.x=settings.penStart.x+settings.offsetL;
			settings.penStart.y=settings.penStart.y+settings.offsetT;
			settings.curvePoints[0].x=settings.curvePoints[0].x+settings.offsetL;
			settings.curvePoints[0].y=settings.curvePoints[0].y+settings.offsetT;
		}
		
		//redraw circles
		if(!settings.draw){
			drawCircles();
		}
		
		//redraw canvas
		ctx.putImageData(cd,settings.offsetL,settings.offsetT);		
		
		//restore drawing state
		settings.draw=drawing;
		
	}
	
	function circlePoint(a,b,r,ng){
		var rad = ng * (Math.PI / 180);
		var y = r*Math.sin(rad);
		var x = r*Math.cos(rad);
    x = a + x;
	  y = b - y;
		return {"x":x,"y":y}
	}
	
	function drawCircles(){
				
		var c = 1;
		var i = settings.i;
		
		var thisRad = 0;
		var prevRad = 0;
		var centerRad = 0;
		var thisPitch = 0;
		var prevPitch = 0;
		var prevSpinPitch = 0;
		var prevDrawPitch = 0;
		var pen;
			
		//clear circles canvas
		var ctx=settings.canvasCircles.getContext("2d");
		ctx.clearRect(0,0,settings.canvasCircles.width,settings.canvasCircles.height);
				
		//draw Stator
		if(settings.circles==="show"){
		  drawOneCircle(settings.canvasCircles,settings.a,settings.b,settings.radii[0]);
		}
		
		//start at the center
		var pt = {
			"x":settings.a,
			"y":settings.b,
		};
	
		c = 1;
		//draw rotor Circles
		while(c < (settings.radii.length)){
			
			thisRad=Number(settings.radii[c]);
			prevRad=Number(settings.radii[c-1]);
			if(settings.types[c]==="h"){
				//hypitrochoid: circle inside
				centerRad=prevRad-thisRad;
			}
			else{
				//eptrochoid: circle outside
				centerRad=prevRad+thisRad;
			}
			
			//pitches are cumulative, so extract previous from array.
			if(c>1){
				prevPitch=prevPitch + settings.pitches[c-2];
				prevSpinPitch=prevSpinPitch + settings.spinPitches[c-2];
				prevDrawPitch=prevDrawPitch + settings.drawPitches[c-2];
			}
			else{
				prevPitch=0;
				prevSpinPitch=0;
				prevDrawPitch=0;
			}
			
			//set travel direction
      var mult = settings.directions[c];
			
			//set draw pitch
			var thisPitch=(settings.drawPitches[c-1] + prevDrawPitch)*mult;
			
			//set pen pitch
			//physics here is subjective
			var os=(c>1) ? 1:0;
			if(settings.types[c]==="h"){
		    var penPitch=(settings.spinPitches[c-1] + prevSpinPitch)*mult*-1;
		  }
			else{
				var penPitch=(settings.spinPitches[c-1] + prevSpinPitch)*mult;
			}
			
			//draw this rotor
			var pt = circlePoint(pt.x,pt.y,centerRad,i*thisPitch);
			if(settings.circles==="show"){
			  drawOneCircle(settings.canvasCircles,pt.x,pt.y,thisRad);
			}
			
			//draw Pen
	    //pen pitch set in last circle iteration
			var penPt = circlePoint(pt.x,pt.y,thisRad,i*penPitch);
			if(settings.circles==="show"){
	      var ctx=settings.canvasCircles.getContext("2d");
				ctx.lineWidth=.3;
				ctx.lineStyle=settings.circleColor;
			  ctx.beginPath();
		  	ctx.moveTo(pt.x,pt.y);
		  	ctx.lineTo(penPt.x,penPt.y);
		  	ctx.stroke();
		  	ctx.closePath();
				//circle for pen Point
			}
			c++;
		}		
		
		//draw Pen
    //pen pitch set in last circle iteration
		var penPt = circlePoint(pt.x,pt.y,settings.penRad,i*penPitch);
		
		//mark our starting point
		if(settings.i===0){
		  settings.penStart = penPt;
		}
    
		//line from center to pen
		if(settings.circles==="show"){
      var ctx=settings.canvasCircles.getContext("2d");
			ctx.lineWidth=.2;
			ctx.lineStyle=settings.circleColor;
		  ctx.beginPath();
	  	ctx.moveTo(pt.x,pt.y);
	  	ctx.lineTo(penPt.x,penPt.y);
	  	ctx.stroke();
	  	ctx.closePath();

			//circle for pen Point
		  drawOneCircle(settings.canvasCircles,penPt.x,penPt.y,1,true);
		}
		
		//update curve points for drawCurve()
		//only maintain previous point, so we'll always plot previous to current.
		settings.curvePoints.push(penPt);
		if(settings.curvePoints.length>2){
			settings.curvePoints.shift();
		}		
	}
	
	function drawOneCircle(canvas,a,b,r,fill){
		var ctx=canvas.getContext("2d");
	  ctx.beginPath();
	  ctx.arc(a,b,r,0,2*Math.PI);
		var currentColor = ctx.strokeStyle;
		var currentWidth = ctx.lineWidth;
		ctx.strokeStyle=settings.circleColor;
		ctx.lineWidth=settings.circleStroke;
		if(fill){
      ctx.fillStyle = settings.curveColor;
			ctx.fill();
			ctx.strokeStyle = settings.curveColor;
		}
    ctx.stroke();
		ctx.closePath();
		ctx.strokeStyle = currentColor;
		ctx.strokeStyle = currentWidth;
	}
	
	function drawCurve(){
	  var ctx=settings.canvasPen.getContext("2d");
		ctx.beginPath();
		ctx.strokeStyle=settings.curveColor;
		ctx.lineWidth=settings.curveWidth;
		ctx.moveTo(settings.curvePoints[0].x,settings.curvePoints[0].y);
		ctx.lineTo(settings.curvePoints[1].x,settings.curvePoints[1].y);
		ctx.stroke();
		ctx.closePath();
	}
	
	function draw(){
		
		//if we've cycled back to the beginning, then pause
		if(
			settings.curvePoints[1] && settings.draw && settings.i>settings.iterator && 
			settings.curvePoints[1].x === settings.penStart.x && 
			settings.curvePoints[1].y.toFixed(1) === settings.penStart.y.toFixed(1)
		  ){
			var nd = new Date().getTime()/1000;
			settings.timer=nd-settings.timer;
			//console.log(settings.timer);
		  var button = document.getElementById(settings.idNames.draw);
			settings.draw=false;
			button.innerHTML="draw";
			settings.i=settings.iterator;
			return;
		}
		if(!settings.draw){
			return;
		}
		
		var c=0;
		var stu;
		
		if(settings.speed<1){
			stu = 1
		}
		else{
			stu=settings.speed;
		}
		
		//hide circles if we're going too fast
		if(settings.speed>50&&settings.circles==="show"){
			settings.circles="hide";
			settings.circleReset=true;
		}
				
		//run circles off for internal loop
		if(settings.circles==="show"){
			settings.circles="hide";
			var circles=true;
		}
		
		//flag that a drawing exists in settings
		//hard to detect if drawing is present on canvas otherwise.
		settings.drawing=true;
		
		//loop through the speed iterations without a frame
		//this should run at least once
		while(c<stu){
			//if we've cycled back to the beginning, then pause
			if(
				settings.curvePoints[1] && settings.draw && settings.i>settings.iterator && 
				settings.curvePoints[1].x === settings.penStart.x && 
				settings.curvePoints[1].y.toFixed(1) === settings.penStart.y.toFixed(1)
			  ){
				var nd = new Date().getTime()/1000;
				settings.timer=nd-settings.timer;
				//console.log(settings.timer);
			  var button = document.getElementById(settings.idNames.draw);
				settings.draw=false;
				button.innerHTML="draw";
				settings.i=0;
				if(settings.circleReset){
					settings.circles="show";
					settings.circleReset=false;
				}
				break;
			}
			if(!settings.draw){
				if(settings.circleReset){
					settings.circles="show";
					settings.circleReset=false;
				}
				break;
			}
			
			if(circles){
				settings.circles="show";
			}
			
			drawCircles();
			drawCurve();
			//if we've done 1000 iterations, then call frame here, so there's some initial feedback
			settings.i = settings.i + settings.iterator;
			c=c+settings.iterator;
		}
		
		//draw
		drawCircles();
		drawCurve();
		
		//if we're decimal on speed then create timeout
		if(settings.speed<1){
			setTimeout(draw,10/settings.speed);
		}
		else{
			//or just request frame
			requestAnimationFrame(draw);
		}

	}
	
	function colorInputOK(){
    var test = document.createElement("input");
		//throws an error on IE, so test in try block.
		try{
      test.type = "color";
	  }
		catch(e){
			return false;
		}
    test.value = "Hello World";
    return (test.value!=="Hello World");
	}
	
	//event binding functions
	
	function inputEvent(inputId,event){
		var input = document.getElementById(inputId);
		input.addEventListener(event,function(event){
			setValues();
			if(!settings.draw){
			  drawCircles();	
			}
		});
	}
	
	function presetEvent(inputId,event){
		var input = document.getElementById(inputId);
		input.addEventListener(event,function(event){
			var val=this.value;
			var c;
			var i;
			for (c in settings.presets){
				if(settings.presets[c].name===val){
					loadValues(settings.presets[c]);
				}
			};
			document.getElementById(settings.idNames.stator).focus()
		});	
	}
	
	function drawButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",function(){
			if(!settings.draw){
				if(settings.i===0){
					settings.timer=new Date().getTime()/1000;
				}
				settings.draw=true;
				button.innerHTML="pause";
				setValues();
				requestAnimationFrame(draw);
			}
			else{
				settings.draw=false;
				button.innerHTML="draw";
			}
		});
	}
	
	function hideButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",function(){
			if(settings.circles==="show"){
				settings.circles="hide";
			  button.innerHTML="show circles";
				setValues();
				drawCircles();
			}
			else{
				settings.circles="show";
				button.innerHTML="hide circles";
				setValues();
				drawCircles();
			}
		});
	}
	
	function clearButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",function(){
			var ctx = settings.canvasPen.getContext("2d");
			ctx.clearRect(0,0,settings.canvasPen.width,settings.canvasPen.height);
			settings.drawing=false;
		});
	}
	
	function resetButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",reset);
	}
	
	function deleteButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",function(){
			var element = document.getElementById(settings.idNames.item+settings.numRotors);
			element.parentNode.removeChild(element);
			if(settings.numRotors===2){
				var element = document.getElementById(settings.idNames.deleteLine);
				element.parentNode.removeChild(element);
				var element = document.getElementById(settings.idNames.deleteSep);
				element.parentNode.removeChild(element);
			};
			settings.numRotors--;
			document.getElementById(settings.idNames.pen).value=document.getElementById(settings.idNames.rotor+settings.numRotors).value;
				setValues();
			if(!settings.draw){
				drawCircles();
			}
			//scroll to the bottom
			var div=document.getElementById(settings.idNames.rotors);
			div.scrollTop = div.scrollHeight;
		});
	}
	
	function addButton(buttonId){
		var button = document.getElementById(buttonId);
		button.addEventListener("click",function(){
			
			//get current last rotor radius
			var newRad=document.getElementById(settings.idNames.rotor+settings.numRotors).value/2;
			
			//toggle types
			if(document.getElementById(settings.idNames.e+settings.numRotors).checked){
				var type="h";
			}
			else{
				var type="e";
			}

			settings.numRotors++;
			
			addRotor(settings.numRotors,newRad,type);
			
			//update pen radius
			document.getElementById(settings.idNames.pen).value=newRad;
		
			//if this is the second rotor we need our delete button.
			if(settings.numRotors===2){
        addDeleteButton();
			}
			
			//scroll to the bottom
			document.getElementById(settings.idNames.rotors).scrollTop = document.getElementById(settings.idNames.rotors).scrollHeight;
			
			setValues();
			if(!settings.draw){
				drawCircles();
			}
			
		});
	}

	function addDeleteButton(){
		var div=document.getElementById(settings.idNames.deleteBlock);
		var e=document.createElement("DIV");
		e.className="divSeparator";
		e.setAttribute("id",settings.idNames.deleteSep);
		div.appendChild(e);
		
	  var span = document.createElement("SPAN");
		span.setAttribute("id",settings.idNames.deleteLine);
		div.appendChild(span);
		var b = document.createElement("BUTTON");
		b.className="delete";
		b.setAttribute("id",settings.idNames.delete);
		span.appendChild(b);
		deleteButton(settings.idNames.delete);
		
		e = document.createElement("IMG");
		e.className="delete";
		e.setAttribute("src","img/delete.png");
		
		b.appendChild(e);
		
		e = document.createElement("SPAN");
		e.className="deleteLabel"
		e.innerHTML="delete last rotor"
		e.setAttribute("id",settings.idNames.deleteLabel)
		span.appendChild(e);
		deleteButton(settings.idNames.deleteLabel);
	}
		
	function reset(){
		settings.i=0;
		setValues();
		drawCircles();
	}
		
})(
	//settings object
	{
		"draw":false,
		"i":0,
		"iOffset":-90,
		"iterator":.25,
		"curvePoints":[],
		"circles":"show",
		"circleColor":"LightGrey",
		"circleStroke":3,
		"circleReset":false,
		"offsetT":0,
		"offsetL":0,
		"directions":[1],
		"penStart":{"x":0,"y":0},
		"drawing":false,
		"idNames":{
			"sidebar":"sidebar",
			"pad":"pad",
			"stator":"stator",
			"rotors":"rotors",
			"item":"item",
			"rotor":"rotor",
			"e":"e",
			"h":"h",
			"pen":"pen",
			"width":"width",
			"speed":"speed",
			"color":"color",
			"colors":"colors",
			"type":"type",
			"delete":"delete",
			"deleteLabel":"deleteLabel",
			"add":"add",
			"addLabel":"addLabel",
			"draw":"draw",
			"clear":"clear",
			"reset":"reset",
			"hide":"hide",
			"preset":"preset",
			"canvasCircles":"canvasCircles",
			"canvasPen":"canvasPen",
			"deleteLine":"deleteLine",
			"deleteSep":"deleteSep",
			"deleteBlock":"deleteBlock",
			"download":"download",
			"presets":"presets",
		},
		"presets":[
			
			{
				"name":"alien artifact",
				"st":"250",
				"r1":"125h",
				"r2":"66h",
				"r3":"33e",
				"r4":"11e",
				"r5":"22e",
				"pen":"5.5",  
				"wd":".2",
				"cl":"#4B0082",
				"sp":"1",
			},
			
			{
				"name":"benoit",
				"st":"250",
				"r1":"132h",
				"r2":"11e",
				"r3":"33e",
				"r4":"44h",
				"pen":"11",  
				"wd":".07",
				"cl":"#000000",
				"sp":"1",
			},

			{
				"name":"burgess shale",
				"st":"250",
				"r1":"99h",
				"r2":"75h",
				"r3":"50e",
				"r4":"25e",
				"pen":"25",
				"wd":".01",
				"cl":"#6A5ACD",
				"sp":"3000",
			},
						
			{
				"name":"cathederal",
				"st":"250",
				"r1":"132h",
				"r2":"11e",
				"pen":"11",
				"wd":".2",
				"cl":"#000080",
				"sp":"1",
			},
			
			{
				"name":"chrysanthemum",
				"st":"200",
				"r1":"66h",
				"r2":"72e",
				"pen":"36",
				"wd":".1",
				"cl":"#FF00FF",
				"sp":"1",
			},
			
			{
				"name":"classic plus",
				"st":"77",
				"r1":"11e",
				"r2":"72e",
				"pen":"72",
				"wd":".1",
				"cl":"#2E8B57",
				"sp":"1",
			},
						
			{
				"name":"dark knight",
				"st":"31",
				"r1":"77e",
				"r2":"66e",
				"r3":"33e",
				"r4":"16.5e",
				"pen":"16.5",
				"wd":".08",
				"cl":"#000000",
				"sp":"1",
			},
			
			{
				"name":"electric blue",
				"st":"140",
				"r1":"105e",
				"r2":"70h",
				"r3":"22h",
				"pen":"11",
				"wd":".1",
				"cl":"#0000FF",
				"sp":"1",
			},

			
			{
				"name":"habitrail",
				"st":"300",
				"r1":"150h",
				"r2":"125h",
				"r3":"54h",
				"pen":"13.5",
				"wd":".08",
				"cl":"#000000",
				"sp":"1",
			},


			{
				"name":"kaleidoscope",
				"st":"250",
				"r1":"12.5h",
				"r2":"72e",
				"pen":"36",
				"wd":".05",
				"cl":"#4B0082",
				"sp":"1",
			},
			{
				"name":"lily pad",
				"st":"250",
				"r1":"25h",
				"r2":"66e",
				"r3":"33e",
				"pen":"33",
				"wd":".1",
				"cl":"#8FBC8F",
				"sp":"1",
			},
			{
				"name":"liner",
				"st":"300",
				"r1":"150h",
				"pen":"150",
				"wd":"1",
				"cl":"#008000",
				"sp":"1",
			},

			{
				"name":"mandala",
				"st":"100",
				"r1":"4e",
				"r2":"100e",
				"pen":"50",
				"wd":".08",
				"cl":"#FF00FF",
				"sp":"1",
			},
			
			{
				"name":"manta",
				"st":"300",
				"r1":"150h",
				"r2":"75h",
				"r3":"37.5e",
				"r4":"18.75e",
				"pen":"18.75",
				"wd":"1",
				"cl":"#2E8B57",
				"sp":"1",
			},
			
			{
				"name":"maya code",
				"st":"200",
				"r1":"66h",
				"r2":"72e",
				"pen":"72",
				"wd":".1",
				"cl":"#800080",
				"sp":"1",
			},
			
			{
				"name":"pods",
				"st":"250",
				"r1":"66h",
				"r2":"11e",
				"pen":"66",
				"wd":".2",
				"cl":"#000080",
				"sp":"1",
			},	
			
			{
				"name":"pufferfish",
				"st":"160",
				"r1":"16h",
				"r2":"77h",
				"r3":"33h",
				"r4":"16.5e",
				"r5":"8.25e",
				"pen":"77",
				"wd":".1",
				"cl":"#0000FF",
				"sp":"1",
			},
				
			{
				"name":"true love",
				"st":"250",
				"r1":"99h",
				"r2":"66e",
				"r3":"22h",
				"pen":"33",
				"wd":".2",
				"cl":"#8B0000",
				"sp":"1",
			},
			
			{
				"name":"tubular",
				"st":"120",
				"r1":"60e",
				"r2":"120h",
				"r3":"22h",
				"pen":"5.5",
				"wd":".1",
				"cl":"#006400",
				"sp":"1",
			},
		],
		"penColors":[
			{
			  "name":"black",
				"hex":"#000000",
			},
			{
			  "name":"blue",
				"hex":"#0000FF",
			},
			{
			  "name":"cornflowerblue",
				"hex":"#6495ED",
			},
			{
			  "name":"crimson",
				"hex":"#DC143C",
			},
			{
			  "name":"darkgreen",
				"hex":"#006400",
			},
			{
		    "name":"darkred",
				"hex":"#8B0000",
			},
			{
			  "name":"darkseagreen",
				"hex":"#8FBC8F",
			},
			{
	      "name":"gold",
				"hex":"#FFD700",
			},
			{
        "name":"green",
				"hex":"#008000",
			},
			{
		    "name":"indigo",
				"hex":"#4B0082",
			},
			{
		    "name":"magenta",
				"hex":"#FF00FF",
			},
			{
		    "name":"navy",
				"hex":"#000080",
			},
			{
	      "name":"orange",
				"hex":"#FFA500",
			},
			{
	      "name":"powderblue",
				"hex":"#B0E0E6",
			},
			{
	      "name":"purple",
				"hex":"#800080",
			},
			{
	      "name":"red",
				"hex":"#FF0000",
			},
			{
	      "name":"seagreen",
				"hex":"#2E8B57",
			},
			{
				"name":"slateblue",
				"hex":"#6A5ACD",
			},
			{
	      "name":"steelblue",
				"hex":"#6A5ACD",
			},
			{
	      "name":"violet",
				"hex":"#EE82EE",
			},
			{
	      "name":"yellow",
				"hex":"#FFFF00",
			}
		],
		"speedSettings":[
			{
				"name":"slowest",
				"speed":.01,
			},
			{
				"name":"slower",
				"speed":.1,	
			},
			{
				"name":"slow",
				"speed":1,	
			},
			{
				"name":"fast",
				"speed":10,	
			},
			{
				"name":"faster",
				"speed":100,	
			},
			{
				"name":"fastest",
				"speed":3000,	
			},	
		]
	}
);


