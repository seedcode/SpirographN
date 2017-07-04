/*
The MIT License (MIT)

Copyright (c) 2016 SeedCode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var sgn = (function(settings) {
	'use strict'

	return {
		load: load,
		spot: spot,
	}

	//public functions

	function load(sidebarId, canvasDivId) {

		var v;
		var r;
		var t;
		var n;
		var c;
		var a;
		var d;
		var o;
		var i;

		//establish sidebar and pad
		if (!sidebarId || !canvasDivId) {
			alert("Error:Canvas and Sidebar not specified");
			return;
		}

		settings.sidebarDiv = document.getElementById(sidebarId);
		settings.divCanvas = document.getElementById(canvasDivId);

		//preserve ids specified in ininitial call
		settings.idNames.sidebar = sidebarId;
		settings.idNames.pad = canvasDivId;

		//set classes
		settings.sidebarDiv.className = "sidebar";
		settings.divCanvas.className = "pad";

		//create data object from url
		//load preset/favorote from settings if none retrieved from the URL
		var parms = location.search.substring(1).split("&");
		if (parms[0]) {
			d = {};
			for (c in parms) {
				a = parms[c].split("=");
				d[a[0]] = decodeURIComponent(a[1]);
			}
			if (d["cl"]) {
				//append hash to color
				d["cl"] = "#" + d["cl"];
			}

			if (d["pre"]) {
				//a preset was passed, so use that
				for (c in settings.presets) {
					if (settings.presets[c].name === d["pre"]) {
						d = settings.presets[c];
					}
				}
			}
			if (!d["st"] || !d["r1"] || !d["pen"]) {
				//validate object properties or else load pre-set
				var preSet = Math.round(Math.random() * (settings.presets.length - 1));
				d = settings.presets[preSet];
			}
			if (!d["sp"]) {
				//set speed if not specified
				d["sp"] = 1;
			}
		} else {
			//no parms specified
			var preSet = Math.round(Math.random() * (settings.presets.length - 1));
			d = settings.presets[preSet];
		}

		//remove rotors to start clean
		while (settings.sidebarDiv.firstChild) {
			settings.sidebarDiv.removeChild(settings.sidebarDiv.firstChild);
		}

		//Begin creating sidebar elements

		//add static elements and values from preset
		//add events to inputs
		var e = document.createElement("SPAN");
		e.className = "title";
		e.innerHTML = "Spirograph";
		e.innerHTML += '<span class="n">&#8319;</span>';
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);


		e = document.createElement("SPAN");
		e.className = "label";
		e.innerHTML = "presets";
		settings.sidebarDiv.appendChild(e);

		var sel = document.createElement("SELECT");
		sel.className = "preset";
		sel.setAttribute("name", "presets");
		sel.setAttribute("id", settings.idNames.presets);
		for (c in settings.presets) {
			o = document.createElement("OPTION");
			o.setAttribute("value", settings.presets[c].name);
			o.innerHTML = settings.presets[c].name;
			sel.appendChild(o);
		}
		settings.sidebarDiv.appendChild(sel)
		presetEvent(settings.idNames.presets, "change");

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "label";
		e.innerHTML = "stator";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "sr";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("INPUT");
		e.className = "number";
		e.setAttribute("type", "text");
		e.setAttribute("value", d.st);
		e.setAttribute("id", settings.idNames.stator);
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.stator, "input");

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "label";
		e.innerHTML = "rotors";
		settings.sidebarDiv.appendChild(e);

		addButton();

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("DIV");
		e.className = "rotors";
		e.setAttribute("id", settings.idNames.rotors);
		settings.sidebarDiv.appendChild(e);

		//add delete block
		e = document.createElement("DIV");
		e.setAttribute("id", settings.idNames.deleteBlock);
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		//add pen block first as rotor routine appends values;
		e = document.createElement("SPAN");
		e.className = "label";
		e.innerHTML = "pen";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "r";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("INPUT");
		e.className = "number";
		e.setAttribute("type", "text");
		e.setAttribute("id", settings.idNames.pen);
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.pen, "input");

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "w";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("INPUT");
		e.className = "number";
		e.setAttribute("type", "text");
		e.setAttribute("id", settings.idNames.width);
		e.setAttribute("step", ".01");
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.width, "input");

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "c";
		settings.sidebarDiv.appendChild(e);

		if (colorInputOK()) {
			//load color input
			e = document.createElement("INPUT");
			e.className = "color";
			e.setAttribute("type", "color");
			e.setAttribute("id", settings.idNames.color);
			settings.sidebarDiv.appendChild(e);
			inputEvent(settings.idNames.color, "input");
		} else {
			//load select color list if color input unavailable
			var e = document.createElement("SELECT");
			e.className = "text";
			e.setAttribute("name", "colors");
			e.setAttribute("id", settings.idNames.color);
			for (c in settings.penColors) {
				o = document.createElement("OPTION");
				o.setAttribute("value", settings.penColors[c].hex);
				o.innerHTML = settings.penColors[c].name;
				e.appendChild(o);
			}
			settings.sidebarDiv.appendChild(e)
			inputEvent(settings.idNames.color, "change");
		}

		settings.sidebarDiv.appendChild(e);

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("SPAN");
		e.className = "label";
		e.innerHTML = "speed";
		settings.sidebarDiv.appendChild(e);

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		var e = document.createElement("SELECT");
		e.className = "preset";
		e.setAttribute("name", "speeds");
		e.setAttribute("id", settings.idNames.speed);
		for (c in settings.speedSettings) {
			o = document.createElement("OPTION");
			o.setAttribute("value", settings.speedSettings[c].speed);
			o.innerHTML = settings.speedSettings[c].name;
			e.appendChild(o);
		}
		settings.sidebarDiv.appendChild(e)
		inputEvent(settings.idNames.speed, "change");

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		drawButton();

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		//utility buttons

		clearButton();

		restartButton();

		hideButton();

		openImageButton();

		settingsURLButton();

		e = document.createElement("BR");
		settings.sidebarDiv.appendChild(e);

		zoomInButton();

		zoomOutButton();

		e = document.createElement("INPUT");
		e.className = "angle";
		e.setAttribute("type", "text");
		e.setAttribute("id", settings.idNames.angle);
		e.setAttribute("value", settings.iOffset);
		e.setAttribute("title", "rotation increment");
		settings.sidebarDiv.appendChild(e);
		inputEvent(settings.idNames.angle, "input");

		rotateButton();

		resetButton();

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);

		gitButton();

		e = document.createElement("DIV");
		e.className = "divSeparator";
		settings.sidebarDiv.appendChild(e);


		//load canvas
		setValues();

		//add canvas
		drawCanvas();

		//load values into inputs
		var lr = loadValues(d);

		window.onresize = function(e) {
			resizeCanvas(e);
		};
	}

	function spot(d) {
		var d = {
			"a": "600",
			"b": "600",
			"sz": "600",
			"canvasClass": "pad",
			"closeFunction": "close",
			"sr": "250",
			"r1": "125h",
			"pen": "125",



		}

	}

	// buttons

	function addButton() {

		var b = document.createElement("BUTTON");
		b.setAttribute("class", "button add");
		b.setAttribute("id", settings.idNames.add);
		var i = document.createElement("IMG");
		i.className = "add";
		i.setAttribute("src", "img/add.png");
		b.appendChild(i);
		var s = document.createElement("SPAN");
		s.className = "buttonTextSmall"
		s.innerHTML += "add rotor";
		b.appendChild(s);
		settings.sidebarDiv.appendChild(b);


		b.addEventListener("click", function() {

			//get current last rotor radius
			var newRad = document.getElementById(settings.idNames.rotor + settings.numRotors).value / 2;

			//toggle types
			if (document.getElementById(settings.idNames.e + settings.numRotors).checked) {
				var type = "h";
			} else {
				var type = "e";
			}

			settings.numRotors++;

			addRotor(settings.numRotors, newRad, type);

			//update pen radius
			document.getElementById(settings.idNames.pen).value = newRad;

			//if this is the second rotor we need our delete button.
			if (settings.numRotors === 2) {
				deleteButton();
			}

			//scroll to the bottom
			document.getElementById(settings.idNames.rotors).scrollTop = document.getElementById(settings.idNames.rotors).scrollHeight;

			setValues();
			if (!settings.draw) {
				drawCircles();
			}

		});

	}

	function deleteButton() {
		var div = document.getElementById(settings.idNames.deleteBlock);
		var e = document.createElement("DIV");
		e.className = "divSeparator";
		e.setAttribute("id", settings.idNames.deleteSep);
		div.appendChild(e);
		var span = document.createElement("SPAN");
		span.setAttribute("id", settings.idNames.deleteLine);
		div.appendChild(span);
		var b = document.createElement("BUTTON");
		b.className = "delete";
		b.setAttribute("id", settings.idNames.delete);
		span.appendChild(b);
		e = document.createElement("IMG");
		e.className = "delete";
		e.setAttribute("src", "img/delete.png");
		b.appendChild(e);
		e = document.createElement("SPAN");
		e.className = "buttonTextSmall"
		e.innerHTML = "delete last rotor"
		e.setAttribute("id", settings.idNames.deleteLabel)
		b.appendChild(e);
		b.addEventListener("click", function() {
			var element = document.getElementById(settings.idNames.item + settings.numRotors);
			element.parentNode.removeChild(element);
			if (settings.numRotors === 2) {
				var element = document.getElementById(settings.idNames.deleteLine);
				element.parentNode.removeChild(element);
				var element = document.getElementById(settings.idNames.deleteSep);
				element.parentNode.removeChild(element);
			};
			settings.numRotors--;
			document.getElementById(settings.idNames.pen).value = document.getElementById(settings.idNames.rotor + settings.numRotors).value;
			setValues();
			if (!settings.draw) {
				drawCircles();
			}
			//scroll to the bottom
			var div = document.getElementById(settings.idNames.rotors);
			div.scrollTop = div.scrollHeight;
		});

	}

	function makeButton(id, className, title, text) {
		var b = document.createElement("BUTTON");
		if (className) {
			b.setAttribute("class", className);
		}
		if (id) {
			b.setAttribute("id", id);
		}
		if (title) {
			b.setAttribute("title", title);
		}
		if (text) {
			b.innerHTML = text;
		}
		return b;
	}

	function makeImage(id, className, src) {
		var i = document.createElement("IMG");
		if (className) {
			i.setAttribute("class", className);
		}
		if (id) {
			i.setAttribute("id", id);
		}
		if (src) {
			i.setAttribute("src", src);
		}
		return i;
	}

	function makeSpan(id, className, content) {
		var s = document.createElement("SPAN");
		if (className) {
			s.setAttribute("class", className);
		}
		if (content) {
			s.innerHTML = content;
		}
		if (id) {
			s.setAttribute("id", id);
		}
		return s;
	}

	function drawButton() {
		var button = makeButton(settings.idNames.draw, "draw", false, "draw");
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			if (!settings.draw) {
				if (settings.i === 0) {
					settings.timer = new Date().getTime() / 1000;
				}
				settings.draw = true;
				button.innerHTML = "pause";
				setValues();
				requestAnimationFrame(draw);
			} else {
				settings.draw = false;
				button.innerHTML = "draw";
			}
		});
	}

	function clearButton() {
		var button = makeButton(settings.idNames.clear, false, "clear drawing", false);
		var image = makeImage(settings.idNames.clearIcon, "edit", "img/clear.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", clearCanvas);
	}

	function restartButton() {
		var button = makeButton(settings.idNames.restart, false, "reset pen to beginning position", false);
		var image = makeImage(settings.idNames.clearIcon, "edit", "img/restart.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", restart);
	}

	function hideButton() {
		var button = makeButton(settings.idNames.hide, false, "hide circles", false);
		var image = makeImage(settings.idNames.hideIcon, "edit", "img/hide.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			if (settings.circles === "show") {
				settings.circles = "hide";
				button.setAttribute("title", "show circles");
				setValues();
				drawCircles();
			} else {
				settings.circles = "show";
				button.setAttribute("title", "hide circles");
				setValues();
				drawCircles();
			}
		});
	}

	function openImageButton() {
		var button = makeButton(settings.idNames.open, false, "open drawing in new tab", false);
		var image = makeImage(settings.idNames.openIcon, "edit", "img/open.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			var d = settings.canvasPen.toDataURL();
			window.open(d);
		});
	}

	function settingsURLButton() {
		var button = makeButton(settings.idNames.link, false, "URL for drawing settings", false);
		var image = makeImage(settings.idNames.linkIcon, "edit", "img/link.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			window.open(settings.url);
		});
	}

	function zoomInButton() {
		var button = makeButton(settings.idNames.zoomIn, false, "zoom drawing tools in", false);
		var image = makeImage(settings.idNames.zoomInIcon, "edit", "img/zoomIn.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			zoom("in");
		});
	}

	function zoomOutButton() {
		var button = makeButton(settings.idNames.zoomOut, false, "zoom drawing tools out", false);
		var image = makeImage(settings.idNames.zoomOutIcon, "edit", "img/zoomOut.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			zoom("out");
		});
	}

	function rotateButton() {
		var button = makeButton(settings.idNames.rotate, false, "rotate drawing tools", false);
		var image = makeImage(settings.idNames.rotateIcon, "edit", "img/rotate.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", rotateDrawing);
	}

	function resetButton() {
		var button = makeButton(settings.idNames.reset, false, "clear zoom and rotation", false);
		var image = makeImage(settings.idNames.resetIcon, "edit", "img/reset.png");
		button.appendChild(image);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", reset);
	}

	function gitButton() {
		var button = makeButton(settings.idNames.git, false, "clear zoom and rotation", false);
		button.setAttribute("style", "width:100%");
		var image = makeImage(settings.idNames.gitIcon, "git", "img/gh.png");
		var span = makeSpan(settings.idNames.gitLabel, "buttonText", "download at github");
		button.appendChild(image);
		button.appendChild(span);
		settings.sidebarDiv.appendChild(button);
		button.addEventListener("click", function() {
			window.open("https://github.com/seedcode/SpirographN");
		});
	}

	// private functions

	function loadValues(d) {

		//set values from d. d is either a loaded preset or created from the url
		document.getElementById(settings.idNames.stator).value = d.st;
		document.getElementById(settings.idNames.pen).value = d.pen;
		document.getElementById(settings.idNames.width).value = d.wd;
		document.getElementById(settings.idNames.color).value = d.cl;
		document.getElementById(settings.idNames.speed).value = d.sp;
		document.getElementById(settings.idNames.presets).value = d.name;

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
		while (d["r" + c]) {
			v = d["r" + c];
			r = v.substring(0, v.length - 1);
			t = v.substring(v.length - 1);
			addRotor(c, r, t);
			c++;
		}

		//track (and maintain) number of rotors
		settings.numRotors = c - 1;

		//if we only have one rotor, then we don't want the delete button.
		if (settings.numRotors === 1 && document.getElementById(settings.idNames.deleteLine)) {
			var element = document.getElementById(settings.idNames.deleteLine);
			element.parentNode.removeChild(element);
			var element = document.getElementById(settings.idNames.deleteSep);
			element.parentNode.removeChild(element);
		};

		//create delete button if we need and don't have
		if (settings.numRotors > 1 && document.getElementById(settings.idNames.delete) === null) {
			deleteButton()
		}

		//write values from inputs to settings
		setValues();

		//if we're not drawing, then we'll show the circles on change
		if (!settings.draw) {
			settings.circles = "show";
			document.getElementById(settings.idNames.hide).setAttribute("title", "hide circles");
		}

		//reset if we're not drawing
		if (!settings.draw) {
			reset();
			drawCircles();
		}

		//return number of rotors created
		return c - 1;
	}

	function addRotor(num, r, type) {

		var div = document.getElementById(settings.idNames.rotors);

		var item = document.createElement("DIV");
		item.setAttribute("id", settings.idNames.item + num);
		div.appendChild(item);

		if (num > 1) {
			var e = document.createElement("DIV");
			e.className = "divSeparator";
			item.appendChild(e);
		}

		var e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.setAttribute("style", "margin:0px");
		e.innerHTML = "r" + num;
		item.appendChild(e);

		e = document.createElement("INPUT");
		e.className = "number";
		e.setAttribute("type", "text");
		e.setAttribute("id", settings.idNames.rotor + num);
		e.setAttribute("value", r);
		item.appendChild(e);
		inputEvent(settings.idNames.rotor + num, "input");

		//type
		e = document.createElement("INPUT");
		e.setAttribute("type", "radio");
		e.setAttribute("class", "radio");
		e.setAttribute("id", settings.idNames.h + num);
		e.setAttribute("name", "type" + num);
		e.setAttribute("value", "hypotrochoid");
		if (type === "h") {
			e.setAttribute("checked", true);
		}
		item.appendChild(e);
		inputEvent(settings.idNames.h + num, "click");

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "h";
		item.appendChild(e);

		e = document.createElement("INPUT");
		e.setAttribute("type", "radio");
		e.setAttribute("class", "radio");
		e.setAttribute("id", settings.idNames.e + num);
		e.setAttribute("name", "type" + num);
		e.setAttribute("value", "epitrochoid");
		if (type === "e") {
			e.setAttribute("checked", true);
		}
		item.appendChild(e);
		inputEvent(settings.idNames.e + num, "click");

		e = document.createElement("SPAN");
		e.className = "letterLabel";
		e.innerHTML = "e";
		item.appendChild(e);
	}

	function setValues() {

		settings.radii = [document.getElementById(settings.idNames.stator).value];
		settings.curveColor = document.getElementById(settings.idNames.color).value;
		settings.curveWidth = document.getElementById(settings.idNames.width).value;
		settings.penRad = [document.getElementById(settings.idNames.pen).value];
		settings.speed = document.getElementById(settings.idNames.speed).value;
		settings.iOffset = document.getElementById(settings.idNames.angle).value;

		settings.types = [""];
		settings.pitches = [1];
		settings.drawPitches = [];
		settings.spinPitches = []

		var c = 1;
		var thisId = settings.idNames.rotor + c;
		var thisHId = settings.idNames.h + c;
		var thisEId = settings.idNames.e + c;

		var thisRotor;
		var thisType;
		var thisHId;
		var thisEId;

		//build arrays
		while (document.getElementById(thisId)) {
			thisRotor = document.getElementById(thisId).value;
			settings.radii.push(thisRotor);

			if (document.getElementById(thisHId).checked) {
				settings.types.push("h");
				if (c > 1) {
					settings.drawPitches.push(settings.spinPitches[c - 2]);
					settings.spinPitches.push((settings.radii[c - 1] / thisRotor) - 1);
					if (settings.types[c - 1] === "h") {
						settings.directions.push(settings.directions[c - 1]);
					} else {
						settings.directions.push(settings.directions[c - 1] * -1);
					}
				} else {
					settings.directions = [1, 1];
					settings.drawPitches.push(1);
					settings.spinPitches.push((settings.radii[c - 1] / thisRotor) - 1);
				}
			} else {
				settings.types.push("e");
				if (c > 1) {
					settings.drawPitches.push(settings.spinPitches[c - 2]);
					settings.spinPitches.push((settings.radii[c - 1] / thisRotor) + 1);
					if (settings.types[c - 1] === "h") {
						settings.directions.push(settings.directions[c - 1]);
					} else(
						settings.directions.push(settings.directions[c - 1] * -1)
					)
				} else {
					settings.directions = [1, 1];
					settings.drawPitches.push(1);
					settings.spinPitches.push((settings.radii[c - 1] / thisRotor) + 1);

				}
			}
			c++;
			thisId = settings.idNames.rotor + c;
			thisHId = settings.idNames.h + c;
			thisEId = settings.idNames.e + c;
		}
		settings.numRotors = c - 1;

		//create url string for this config
		c = 0;
		var u = window.location.origin + window.location.pathname;
		for (c in settings.radii) {
			if (c == 0) {
				u += "?st=" + settings.radii[c];
			} else {
				u += "&r" + c + "=" + settings.radii[c] + settings.types[c];
			}
		}
		u += "&pen=" + settings.penRad;
		u += "&wd=" + settings.curveWidth;
		u += "&cl=" + settings.curveColor.substring(1);
		settings.url = u;
	}

	function drawCanvas() {
		//create canvas elements then call resize routine
		settings.canvasCircles = document.createElement("canvas");
		settings.canvasCircles.id = settings.idNames.canvasCircles;
		settings.canvasPen = document.createElement("canvas");
		settings.canvasPen.id = settings.idNames.canvasPen;
		settings.divCanvas.appendChild(settings.canvasCircles);
		settings.divCanvas.appendChild(settings.canvasPen);
		resizeCanvas();
	}

	function resizeCanvas() {

		var offscreen = 100;

		//capture current draw state and pause drawing.
		var drawing = settings.draw;
		settings.draw = false;

		//we need to capture the current drawing and redraw when set
		var ctx = settings.canvasPen.getContext("2d");
		var ctxCircles = settings.canvasCircles.getContext("2d");
		var cd = ctx.getImageData(0, 0, settings.canvasCircles.width, settings.canvasCircles.height);

		ctx.save();
		ctxCircles.save();

		//fill window
		settings.windowWidth = window.innerWidth;
		settings.windowHeight = window.innerHeight;
		settings.divCanvasWidth = 98.5;
		settings.divCanvasHeight = settings.windowHeight - 28;
		settings.sidebarWidth = settings.sidebarDiv.clientWidth;

		//set sidebar and pad sizes and store in settings
		settings.divCanvas.setAttribute("style", "width:" + settings.divCanvasWidth + "%;height:" + settings.divCanvasHeight + "px;background:white");
		settings.sidebarDiv.setAttribute("style", "min-height:" + settings.divCanvasHeight + "px;");
		settings.left = settings.divCanvas.offsetLeft + settings.sidebarWidth - offscreen;
		settings.top = settings.divCanvas.offsetTop - offscreen;

		//set rotor list height
		var rotors = document.getElementById(settings.idNames.rotors);
		rotors.setAttribute("style", "max-height:" + settings.divCanvasHeight * .20 + "px;")

		//if we're resizing and we have a previous poisition, then track the offset, so we can redraw our canvases in position
		//round the coordinates for the center, otherwise the redraws are off.
		if (settings.a) {
			settings.offsetL = (Math.round((settings.divCanvas.clientWidth - settings.sidebarWidth) / 2)) + offscreen - settings.a;
			settings.offsetT = Math.round((settings.divCanvasHeight / 2)) + offscreen - settings.b;
		}

		//now recenter
		settings.a = Math.round(((settings.divCanvas.clientWidth - settings.sidebarWidth) / 2)) + offscreen;
		settings.b = Math.round((settings.divCanvasHeight / 2)) + offscreen;

		//resize canvases
		settings.canvasCircles.height = settings.divCanvasHeight + offscreen * 2;
		settings.canvasCircles.width = settings.divCanvas.clientWidth - settings.sidebarWidth + offscreen * 2;
		settings.canvasCircles.setAttribute("Style", "left:" + settings.left + "px;top:" + settings.top + "px;position:absolute;z-index:10");
		settings.canvasPen.height = settings.divCanvasHeight + offscreen * 2;
		settings.canvasPen.width = settings.divCanvas.clientWidth - settings.sidebarWidth + offscreen * 2;
		settings.canvasPen.setAttribute("Style", "left:" + settings.left + "px;top:" + settings.top + "px;position:absolute;z-index:20");


		//update coordinates based on new position
		if (settings.penStart.x != 0) {
			settings.penStart.x = settings.penStart.x + settings.offsetL;
			settings.penStart.y = settings.penStart.y + settings.offsetT;
			settings.curvePoints[0].x = settings.curvePoints[0].x + settings.offsetL;
			settings.curvePoints[0].y = settings.curvePoints[0].y + settings.offsetT;
		}

		//restore rotation
		if (settings.iPosition != 0) {
			var posHolder = settings.iPosition;
			var offSetHolder = settings.iOffset;
			settings.iOffset = settings.iPosition * -1;
			rotateDrawing();
			settings.iOffset = offSetHolder;
			settings.iPosition = posHolder;
		}

		//redraw circles
		if (!settings.draw) {
			drawCircles();
		}

		//redraw canvas
		ctx.putImageData(cd, settings.offsetL, settings.offsetT);

		//restore drawing state
		settings.draw = drawing;

	}

	function circlePoint(a, b, r, ng) {
		var rad = ng * (Math.PI / 180);
		var y = r * Math.sin(rad);
		var x = r * Math.cos(rad);
		x = a + x;
		y = b - y;
		return {
			"x": x,
			"y": y
		}
	}

	function drawCircles() {

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


		var zoom = settings.currentZoom;

		//clear circles canvas
		var ctx = settings.canvasCircles.getContext("2d");
		ctx.clearRect(0, 0, settings.canvasCircles.width, settings.canvasCircles.height);

		//draw Stator
		if (settings.circles === "show") {
			drawOneCircle(settings.canvasCircles, settings.a, settings.b, settings.radii[0] * zoom );
		}

		//start at the center
		var pt = {
			"x": settings.a,
			"y": settings.b,
		};

		c = 1;
		//draw rotor Circles
		while (c < (settings.radii.length)) {


			//set radii, applying zoom
			thisRad = Number(settings.radii[c]) * zoom;
			prevRad = Number(settings.radii[c - 1]) * zoom;
			if (settings.types[c] === "h") {
				//hypitrochoid: circle inside
				centerRad = prevRad - thisRad;
			} else {
				//eptrochoid: circle outside
				centerRad = prevRad + thisRad;
			}

			//pitches are cumulative, so extract previous from array.
			if (c > 1) {
				prevPitch = prevPitch + settings.pitches[c - 2];
				prevSpinPitch = prevSpinPitch + settings.spinPitches[c - 2];
				prevDrawPitch = prevDrawPitch + settings.drawPitches[c - 2];
			} else {
				prevPitch = 0;
				prevSpinPitch = 0;
				prevDrawPitch = 0;
			}

			//set travel direction
			var mult = settings.directions[c];

			//set draw pitch
			var thisPitch = (settings.drawPitches[c - 1] + prevDrawPitch) * mult;

			//set pen pitch
			//physics here is subjective
			var os = (c > 1) ? 1 : 0;
			if (settings.types[c] === "h") {
				var penPitch = (settings.spinPitches[c - 1] + prevSpinPitch) * mult * -1;
			} else {
				var penPitch = (settings.spinPitches[c - 1] + prevSpinPitch) * mult;
			}

			//draw this rotor
			var pt = circlePoint(pt.x, pt.y, centerRad, i * thisPitch);
			if (settings.circles === "show") {
				drawOneCircle(settings.canvasCircles, pt.x, pt.y, thisRad);
			}

			//draw Pen
			//pen pitch set in last circle iteration
			var penPt = circlePoint(pt.x, pt.y, thisRad, i * penPitch);
			if (settings.circles === "show") {
				var ctx = settings.canvasCircles.getContext("2d");
				ctx.lineWidth = .3;
				ctx.lineStyle = settings.circleColor;
				ctx.beginPath();
				ctx.moveTo(pt.x, pt.y);
				ctx.lineTo(penPt.x, penPt.y);
				ctx.stroke();
				ctx.closePath();
				//circle for pen Point
			}
			c++;
		}

		//draw Pen
		//pen pitch set in last circle iteration
		var penPt = circlePoint(pt.x, pt.y, settings.penRad * zoom, i * penPitch);

		//mark our starting point
		if (settings.i === 0) {
			settings.penStart = penPt;
		}

		//line from center to pen
		if (settings.circles === "show") {
			var ctx = settings.canvasCircles.getContext("2d");
			ctx.lineWidth = .2;
			ctx.lineStyle = settings.circleColor;
			ctx.beginPath();
			ctx.moveTo(pt.x, pt.y);
			ctx.lineTo(penPt.x, penPt.y);
			ctx.stroke();
			ctx.closePath();

			//circle for pen Point
			drawOneCircle(settings.canvasCircles, penPt.x, penPt.y, 1, true);
		}

		//update curve points for drawCurve()
		//only maintain previous point, so we'll always plot previous to current.
		settings.curvePoints.push(penPt);
		if (settings.curvePoints.length > 2) {
			settings.curvePoints.shift();
		}
	}

	function drawOneCircle(canvas, a, b, r, fill) {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(a, b, r, 0, 2 * Math.PI);
		var currentColor = ctx.strokeStyle;
		var currentWidth = ctx.lineWidth;
		ctx.strokeStyle = settings.circleColor;
		ctx.lineWidth = settings.circleStroke;
		if (fill) {
			ctx.fillStyle = settings.curveColor;
			ctx.fill();
			ctx.strokeStyle = settings.curveColor;
		}
		ctx.stroke();
		ctx.closePath();
		ctx.strokeStyle = currentColor;
		ctx.strokeStyle = currentWidth;
	}

	function drawCurve() {
		var ctx = settings.canvasPen.getContext("2d");
		ctx.beginPath();
		ctx.strokeStyle = settings.curveColor;
		ctx.lineWidth = settings.curveWidth;
		ctx.moveTo(settings.curvePoints[0].x, settings.curvePoints[0].y);
		ctx.lineTo(settings.curvePoints[1].x, settings.curvePoints[1].y);
		ctx.stroke();
		ctx.closePath();
	}

	function draw() {

		//if we've cycled back to the beginning, then pause
		if (
			settings.curvePoints[1] && settings.draw && settings.i > settings.iterator &&
			settings.curvePoints[1].x === settings.penStart.x &&
			settings.curvePoints[1].y.toFixed(1) === settings.penStart.y.toFixed(1)
		) {
			var nd = new Date().getTime() / 1000;
			settings.timer = nd - settings.timer;
			//console.log(settings.timer);
			var button = document.getElementById(settings.idNames.draw);
			settings.draw = false;
			button.innerHTML = "draw";
			settings.i = 0;
			if (settings.circleReset) {
				settings.circles = "show";
				settings.circleReset = false;
			}
			drawCircles();
			return;
		}

		//button hs been toggled
		if (!settings.draw) {
			if (settings.circleReset) {
				settings.circles = "show";
				settings.circleReset = false;
			}
			drawCircles();
			return;
		}

		var c = 0;
		var stu;

		//adjust speed so 1 iteration per frame is the smallest we use
		//if decimal is specified we add a timeout to the frame below.
		if (settings.speed < 1) {
			stu = 1
		} else {
			stu = settings.speed;
		}

		//hide circles if we're going too fast
		if (settings.speed > 50 && settings.circles === "show") {
			settings.circles = "hide";
			settings.circleReset = true;
		} else if (settings.speed <= 50 && settings.circleReset && settings.circles === "hide") {
			//we've slowed down, so we can show again
			settings.circles = "show";
			settings.circleReset = false;
		}

		//run circles off for internal loop
		if (settings.circles === "show") {
			settings.circles = "hide";
			var circles = true;
		}

		//flag that a drawing exists in settings
		//hard to detect if drawing is present on canvas otherwise.
		settings.drawing = true;

		//loop through the speed iterations without a frame
		//this should run at least once
		while (c < stu) {
			//if we've cycled back to the beginning, then pause
			if (
				settings.curvePoints[1] && settings.draw && settings.i > settings.iterator &&
				settings.curvePoints[1].x === settings.penStart.x &&
				settings.curvePoints[1].y.toFixed(1) === settings.penStart.y.toFixed(1)
			) {
				var nd = new Date().getTime() / 1000;
				settings.timer = nd - settings.timer;
				//console.log(settings.timer);
				var button = document.getElementById(settings.idNames.draw);
				settings.draw = false;
				button.innerHTML = "draw";
				settings.i = 0;
				if (settings.circleReset) {
					settings.circles = "show";
					settings.circleReset = false;
				}
				break;
			}
			if (!settings.draw) {
				if (settings.circleReset) {
					settings.circles = "show";
					settings.circleReset = false;
				}
				break;
			}

			if (circles) {
				settings.circles = "show";
			}

			drawCircles();
			drawCurve();
			//if we've done 1000 iterations, then call frame here, so there's some initial feedback
			settings.i = settings.i + settings.iterator;
			c = c + settings.iterator;
		}

		//draw
		drawCircles();
		drawCurve();

		//if we're decimal on speed then create timeout
		if (settings.speed < 1) {
			setTimeout(draw, 10 / settings.speed);
		} else {
			//or just request frame
			requestAnimationFrame(draw);
		}

	}

	function colorInputOK() {
		var test = document.createElement("input");
		//throws an error on IE, so test in try block.
		try {
			test.type = "color";
		} catch (e) {
			return false;
		}
		test.value = "Hello World";
		return (test.value !== "Hello World");
	}

	function inputEvent(inputId, event) {
		var input = document.getElementById(inputId);
		input.addEventListener(event, function(e) {
			setValues();
			if (!settings.draw) {
				drawCircles();
			}
		});
		input.addEventListener('keydown',function(e){
			if(e.code==='Minus'){
				e.preventDefault();
			}
		});
		input.addEventListener('paste',function(e){
			e.preventDefault();
		});
	}

	function presetEvent(inputId, event) {
		var input = document.getElementById(inputId);
		input.addEventListener(event, function(event) {
			var val = this.value;
			var c;
			var i;
			for (c in settings.presets) {
				if (settings.presets[c].name === val) {
					loadValues(settings.presets[c]);
				}
			};
			document.getElementById(settings.idNames.stator).focus()
		});
	}

	function clearCanvas() {
		//if we're zoomed out then clear the zoom to clear bigger drawings
		if (settings.zoomStack[0] < 1) {
			zoomTempClear()
			var z = true;
		}

		//clear
		var ctx = settings.canvasPen.getContext("2d");
		ctx.clearRect(0, 0, settings.canvasPen.width, settings.canvasPen.height);

		//restore Zoom
		if (z) {
			zoomTempRestore()
		}
		settings.drawing = false;
	}

	function restart() {
		settings.i = 0;
		setValues();
		drawCircles();
	}

	function reset() {
		if (settings.iPosition !== 0) {
			//set rotation position to 0
			var temp = settings.iOffset;
			settings.iOffset = settings.iPosition;
			rotateDrawing();
			settings.iOffset = temp;
			settings.iPosition = 0;
		}
		//reset zoom
    settings.zoomStack = [1];
		settings.currentZoom = 1;
		drawCircles();
	}

	function rotateDrawing() {

		var degrees = settings.iOffset * -1;
		settings.iPosition += degrees;

		var ctx = settings.canvasCircles.getContext("2d");
		var ctxPen = settings.canvasPen.getContext("2d");

		//angle from center to upper left, we're going to translate this point
		var ang = ((Math.PI / 180) * 180) - Math.atan((settings.canvasPen.clientHeight / 2) / (settings.canvasPen.clientWidth / 2));

		var ang = ang - (degrees * (Math.PI / 180));

		var hyp = Math.sqrt(Math.pow(settings.canvasPen.clientHeight / 2, 2) + Math.pow(settings.canvasPen.clientWidth / 2, 2));

		var pt = circlePoint(settings.a, settings.b, hyp, ang / (Math.PI / 180));

		//rotate pen Canvas
		//ctxPen.save();
		ctxPen.translate(pt.x, pt.y);
		ctxPen.rotate(degrees * (Math.PI / 180));

		ctx.translate(pt.x, pt.y);
		ctx.rotate(degrees * (Math.PI / 180));

		//draw image from circles and restore
		//ctxPen.drawImage(settings.canvasCircles,0, 0);
		//ctxPen.restore();

		drawCircles();

	}

	function zoom(inOut) {

		if(settings.zoomStack.length>1 && inOut==="in" && settings.zoomStack[0]<1) {
			//we're changing directions from going out to in
			var removed = settings.zoomStack.shift();
		}
		else if(settings.zoomStack.length>1 && inOut==="out" && settings.zoomStack[0]>1) {
			//we're changing directions from going in to out
			var removed = settings.zoomStack.shift();
		}
		else if (inOut === "in"){
			//same direction or first move
			settings.zoomStack.unshift(1 + settings.zoom);

		}
		else if (inOut === "out"){
			//same direction or first move
			settings.zoomStack.unshift( 1 - settings.zoom);
		}
		else{
			return;
		}

	  settings.currentZoom = Math.pow(settings.zoomStack[0],settings.zoomStack.length-1);

		drawCircles();


		/*



		if (inOut === "in") {
			settings.currentZoom = 1 + settings.zoom;
		} else if (inOut === "out") {
			settings.currentZoom = 1 - settings.zoom;
		}

		var restore;
		var ztu;

		//update stack if moving forward
		if (settings.zoomStack[0] < 1 && settings.currentZoom > 1 || settings.zoomStack[0] > 1 && settings.currentZoom < 1) {
			//we're changing directions so restore to last zoom
			restore = settings.zoomStack.shift();
		} else {
			settings.zoomStack.unshift(settings.currentZoom);
		}

		if (restore) {
			ztu = 1 / restore;
		} else {
			ztu = settings.currentZoom;
		}

		*/

		//clear circles canvas
		//var ctx = settings.canvasCircles.getContext("2d");
		//ctx.clearRect(0, 0, settings.canvasCircles.width, settings.canvasCircles.height);


		//performZoom(ztu);

	}


})(
	//settings object
	{
		"draw": false,
		"i": 0,
		"iOffset": 90,
		"iPosition": 0,
		"iterator": .25,
		"zoom": .25,
		"zoomStack": [1],
		"currentZoom": 1,
		"curvePoints": [],
		"url": "#",
		"circles": "show",
		"circleColor": "LightGrey",
		"circleStroke": 3,
		"circleReset": false,
		"offsetT": 0,
		"offsetL": 0,
		"penStart": {
			"x": 0,
			"y": 0
		},
		"drawing": false,
		"idNames": {
			"linkId": "linkId",
			"sidebar": "sidebar",
			"pad": "pad",
			"stator": "stator",
			"rotors": "rotors",
			"item": "item",
			"rotor": "rotor",
			"e": "e",
			"h": "h",
			"pen": "pen",
			"width": "width",
			"speed": "speed",
			"color": "color",
			"colors": "colors",
			"type": "type",
			"delete": "delete",
			"deleteLabel": "deleteLabel",
			"add": "add",
			"addLabel": "addLabel",
			"draw": "draw",
			"clear": "clear",
			"clearLabel": "clearLabel",
			"clearIcon": "clearIcon",
			"reset": "reset",
			"resetLabel": "resetLabel",
			"resetIcon": "resetIcon",
			"restart": "restart",
			"restartLabel": "restartLabel",
			"restartIcon": "restartIcon",
			"hide": "hide",
			"hideLabel": "hideLabel",
			"hideIcon": "hideIcon",
			"preset": "preset",
			"canvasCircles": "canvasCircles",
			"canvasPen": "canvasPen",
			"deleteLine": "deleteLine",
			"deleteSep": "deleteSep",
			"deleteBlock": "deleteBlock",
			"download": "download",
			"presets": "presets",
			"rotate": "rotate",
			"rotateLabel": "rotateLabel",
			"rotateIcon": "rotateIcon",
			"open": "open",
			"openLabel": "openLabel",
			"openIcon": "openIcon",
			"git": "git",
			"gitLabel": "gitLabel",
			"gitIcon": "gitIcon",
			"link": "link",
			"linkLabel": "linkLabel",
			"linkIcon": "linkIcon",
			"zoomIn": "zoomIn",
			"zoomInLabel": "zoomInLabel",
			"zoomInIcon": "zoomInIcon",
			"zoomOut": "zoomOut",
			"zoomOutLabel": "zoomOutnLabel",
			"zoomOutIcon": "zoomOutnIcon",
			"angle": "angle",
		},
		"presets": [

			{
				"name": "alien artifact",
				"st": "250",
				"r1": "125h",
				"r2": "66h",
				"r3": "33e",
				"r4": "11e",
				"r5": "22e",
				"pen": "5.5",
				"wd": ".2",
				"cl": "#4B0082",
				"sp": "1",
			},

			{
				"name": "benoit",
				"st": "250",
				"r1": "132h",
				"r2": "11e",
				"r3": "33e",
				"r4": "44h",
				"pen": "11",
				"wd": ".07",
				"cl": "#000000",
				"sp": "1",
			},

			{
				"name": "burgess shale",
				"st": "250",
				"r1": "99h",
				"r2": "75h",
				"r3": "50e",
				"r4": "25e",
				"pen": "25",
				"wd": ".01",
				"cl": "#6A5ACD",
				"sp": "1000",
			},

			{
				"name": "cathederal",
				"st": "250",
				"r1": "132h",
				"r2": "11e",
				"pen": "11",
				"wd": ".2",
				"cl": "#000080",
				"sp": "1",
			},

			{
				"name": "chrysanthemum",
				"st": "200",
				"r1": "66h",
				"r2": "72e",
				"pen": "36",
				"wd": ".1",
				"cl": "#FF00FF",
				"sp": "1",
			},

			{
				"name": "classic plus",
				"st": "77",
				"r1": "11e",
				"r2": "72e",
				"pen": "72",
				"wd": ".1",
				"cl": "#2E8B57",
				"sp": "1",
			},

			{
				"name": "dark knight",
				"st": "31",
				"r1": "77e",
				"r2": "66e",
				"r3": "33e",
				"r4": "16.5e",
				"pen": "16.5",
				"wd": ".08",
				"cl": "#000000",
				"sp": "1",
			},

			{
				"name": "electric blue",
				"st": "140",
				"r1": "105e",
				"r2": "70h",
				"r3": "22h",
				"pen": "11",
				"wd": ".1",
				"cl": "#0000FF",
				"sp": "1",
			},


			{
				"name": "habitrail",
				"st": "300",
				"r1": "150h",
				"r2": "125h",
				"r3": "54h",
				"pen": "13.5",
				"wd": ".08",
				"cl": "#000000",
				"sp": "1",
			},


			{
				"name": "kaleidoscope",
				"st": "250",
				"r1": "12.5h",
				"r2": "72e",
				"pen": "36",
				"wd": ".05",
				"cl": "#4B0082",
				"sp": "1",
			}, {
				"name": "lily pad",
				"st": "250",
				"r1": "25h",
				"r2": "66e",
				"r3": "33e",
				"pen": "33",
				"wd": ".1",
				"cl": "#8FBC8F",
				"sp": "1",
			}, {
				"name": "liner",
				"st": "300",
				"r1": "150h",
				"pen": "150",
				"wd": "1",
				"cl": "#008000",
				"sp": "1",
			},

			{
				"name": "mandala",
				"st": "100",
				"r1": "4e",
				"r2": "100e",
				"pen": "50",
				"wd": ".08",
				"cl": "#FF00FF",
				"sp": "1",
			},

			{
				"name": "manta",
				"st": "300",
				"r1": "150h",
				"r2": "75h",
				"r3": "37.5e",
				"r4": "18.75e",
				"pen": "18.75",
				"wd": "1",
				"cl": "#2E8B57",
				"sp": "1",
			},

			{
				"name": "maya code",
				"st": "200",
				"r1": "66h",
				"r2": "72e",
				"pen": "72",
				"wd": ".1",
				"cl": "#800080",
				"sp": "1",
			},

			{
				"name": "pods",
				"st": "250",
				"r1": "66h",
				"r2": "11e",
				"pen": "66",
				"wd": ".2",
				"cl": "#000080",
				"sp": "1",
			},

			{
				"name": "pufferfish",
				"st": "160",
				"r1": "16h",
				"r2": "77h",
				"r3": "33h",
				"r4": "16.5e",
				"r5": "8.25e",
				"pen": "77",
				"wd": ".1",
				"cl": "#0000FF",
				"sp": "1",
			},

			{
				"name": "true love",
				"st": "250",
				"r1": "99h",
				"r2": "66e",
				"r3": "22h",
				"pen": "33",
				"wd": ".2",
				"cl": "#8B0000",
				"sp": "1",
			},

			{
				"name": "tubular",
				"st": "120",
				"r1": "60e",
				"r2": "120h",
				"r3": "22h",
				"pen": "5.5",
				"wd": ".1",
				"cl": "#006400",
				"sp": "1",
			},
		],
		"penColors": [{
			"name": "black",
			"hex": "#000000",
		}, {
			"name": "blue",
			"hex": "#0000FF",
		}, {
			"name": "cornflowerblue",
			"hex": "#6495ED",
		}, {
			"name": "crimson",
			"hex": "#DC143C",
		}, {
			"name": "darkgreen",
			"hex": "#006400",
		}, {
			"name": "darkred",
			"hex": "#8B0000",
		}, {
			"name": "darkseagreen",
			"hex": "#8FBC8F",
		}, {
			"name": "gold",
			"hex": "#FFD700",
		}, {
			"name": "green",
			"hex": "#008000",
		}, {
			"name": "indigo",
			"hex": "#4B0082",
		}, {
			"name": "magenta",
			"hex": "#FF00FF",
		}, {
			"name": "navy",
			"hex": "#000080",
		}, {
			"name": "orange",
			"hex": "#FFA500",
		}, {
			"name": "powderblue",
			"hex": "#B0E0E6",
		}, {
			"name": "purple",
			"hex": "#800080",
		}, {
			"name": "red",
			"hex": "#FF0000",
		}, {
			"name": "seagreen",
			"hex": "#2E8B57",
		}, {
			"name": "slateblue",
			"hex": "#6A5ACD",
		}, {
			"name": "steelblue",
			"hex": "#6A5ACD",
		}, {
			"name": "violet",
			"hex": "#EE82EE",
		}, {
			"name": "yellow",
			"hex": "#FFFF00",
		}],
		"speedSettings": [{
			"name": "slowest",
			"speed": .01,
		}, {
			"name": "slower",
			"speed": .1,
		}, {
			"name": "slow",
			"speed": 1,
		}, {
			"name": "fast",
			"speed": 10,
		}, {
			"name": "faster",
			"speed": 200,
		}, {
			"name": "fastest",
			"speed": 1000,
		}, ]
	}
);
