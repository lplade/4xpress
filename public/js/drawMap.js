$(document).ready(function () {
	const GRIDSIZE = 8;
	const MAPSIZE = 1600; //use c.getAttribute() instead?
	const SQUARESIZE = MAPSIZE / GRIDSIZE;

	//for now, assume canvas of 320x320
	//assume 8x8 grid of 40px squares
	//TODO pull variables for canvas and grid size, use in math below

	//{ coordinates: [Object],
	//  mainWorld: [Object],
	//	_id: 5732aa13f92c24e97ac73f54,
	//	starClass: 'G',
	//	name: 'Ahasiwmij' },

	function buildArray(_mapData) {
		var stArray = [];
		//console.log(_mapData);
		for (var i = 0; i < _mapData.length; i++) {
			var _starType;
			switch (_mapData[i].starClass) {
				case "O":
					_starType = "starO";
					break;
				case "B":
					_starType = "starB";
					break;
				case "A":
					_starType = "starA";
					break;
				case "F":
					_starType = "starF";
					break;
				case "G":
					_starType = "starG";
					break;
				case "K":
					_starType = "starK";
					break;
				case "M":
					_starType = "starM";
					break;
				default:
					_starType = "starM";
			}


			stArray.push({
				name: _mapData[i].name,
				starType: _starType,
				xCoord: _mapData[i].coordinates[0],
				yCoord: _mapData[i].coordinates[1]
			});
		}
		return stArray;
	} //wrap this in a callback before drawing?

	//www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/

	function loadImages(sources, callback) {
		var images = {};
		var loadedImages = 0;
		var numImages = 0;
		// get num of sources
		for (var src in sources) {
			numImages++;
		}
		for (var src in sources) {
			images[src] = new Image();
			images[src].onload = function () {
				if (++loadedImages >= numImages) {
					callback(images);
				}
			};
			images[src].src = sources[src];
		}
	}

	var sources = {
		starO: '/img/stars/classO.png',
		starB: '/img/stars/classB.png',
		starA: '/img/stars/classA.png',
		starF: '/img/stars/classF.png',
		starG: '/img/stars/classG.png',
		starK: '/img/stars/classK.png',
		starM: '/img/stars/classM.png'
	};

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");


	// Draw a horizontal line
	function hLine(yPos) {
		wide = c.getAttribute("width");
		ctx.beginPath();
		ctx.moveTo(0, yPos);
		ctx.lineTo(wide, yPos);
		ctx.stroke();
	}

	// Draw a vertical line
	function vLine(xPos) {
		high = c.getAttribute("height");
		ctx.moveTo(xPos, 0);
		ctx.lineTo(xPos, high);
		ctx.stroke();
	}

	//draw the grid
	function drawGrid() {
		ctx.strokeStyle = "#004400";
		ctx.lineWidth = 1;
		ctx.globalAlpha = 0.8;
		ctx.shadowBlur = 40;
		ctx.shadowColor = '#008800';
		for (var y = 0; y <= GRIDSIZE; y++) {
			hLine((y * SQUARESIZE));
		}
		for (var x = 0; x <= GRIDSIZE; x++) {
			vLine((x * SQUARESIZE));
		}
		//set these back
		ctx.globalAlpha = 1;
		ctx.shadowBlur = 0;
	}

	//Not sure why transparency fades going left to right
	// play with ctx.globalCompositeOperation

	drawGrid();

	//TODO render a second canvas on top of the first one

	//draw stars

	loadImages(sources, function (images) {
		var starSource = buildArray(mapData);
		//console.log(starSource);
		for (var i = 0; i < starSource.length; i++) {
			//ctx.drawImage(images.starF, 0, 0, SQUARESIZE, SQUARESIZE);
			//ctx.drawImage(images.starM, 4 * SQUARESIZE, 3 * SQUARESIZE, SQUARESIZE, SQUARESIZE);
			ctx.drawImage(
				images[starSource[i].starType],
				starSource[i].xCoord * SQUARESIZE,
				starSource[i].yCoord * SQUARESIZE,
				SQUARESIZE, SQUARESIZE
			);
			ctx.font = '20pt Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(
				(starSource[i].name).toUpperCase(),
				(starSource[i].xCoord * SQUARESIZE) + (0.5 * SQUARESIZE),
				(starSource[i].yCoord * SQUARESIZE) + (0.9 * SQUARESIZE)
			)
		}
	});
});
