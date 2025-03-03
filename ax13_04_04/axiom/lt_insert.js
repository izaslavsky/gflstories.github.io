/*****
*
*   lt_insert
*
*	called in initproject. 
*
*****/
function init_lt2() {
	getURL("lt_insert.svg", lt_loaded)
}
function lt_loaded(s) {
  if( ! s.success ) 
  { 
     alert( 'Error loading the left corner file!' ) 
     return 
  } 
  var fragment = parseXML(s.content,SVGDoc);
  lt_insert = SVGDoc.getElementById("lt_insert")
  lt_insert.appendChild(fragment)
}

function om_over(evt) {
target = evt.getTarget()
target.getStyle().setProperty("opacity", "0.3")
//window.status = target.getAttribute("title")
stat_string = SVGDoc.getElementById("stat").getFirstChild()
stat_string.setData(target.getAttribute("title"))
//id = target.getAttribute("id")
//alert("over " +id)
}
function om_out(evt) {
target = evt.getTarget()
target.getStyle().setProperty("opacity", "1")
stat_string = SVGDoc.getElementById("stat").getFirstChild()
stat_string.setData("View District Map")
//window.status=""
//id = target.getAttribute("id")
}

function init_lt() {

	lt=SVGDoc.getElementById("lt_insert")

	translateX = (navigationWidth+sbWidth)/mapscale;
	translateY = -inicoorry-(titleHeight/mapscale);


	new_svg = build_node("svg",
		{
                	id: "lt_svg",
                	x: "10", y:"5",
                	width:"195", height:"140",
                	viewbox:"0,0,"+inicoorrx+","+inicoorry,
                	zoomAndPan: "disable",
                	preserveAspectRatio:"xMinYMin" 
            	},lt)
	new_rect= build_node("rect",
		{
                	x: "0", y:"0",
                	width:"195", height:"140",
			fill:"white"
            	},new_svg)
            	
	new_g = build_node("g",
		{
                	id: "lt_default",
                	style:"fill:black"
            	},new_svg)

//alert(SVGDoc.getElementById("base").getElementsByTagName("path").length)
//	prop_width = (getInnerWidth()-navigationWidth-sbWidth)/195
//	prop_height = 

	mapAspect = inicoorrx/inicoorry;
	om_aspect = Number(195/140)
	if (om_aspect > mapAspect) 
	{
		om_scale = 140/inicoorry
		recenter_by = "width"
		occupied_width = om_scale*inicoorrx
		occupied_height = 140
//		alert(occupied_width +"   "+translateX)
		offset = (195-occupied_width)/2
		translateX = inicoorrx*(offset/195)
		translateY = -inicoorry
	}
	else
	{
		om_scale = 195/inicoorrx
		recenter_by = "height"
		occupied_height = om_scale*inicoorry
		occupied_width = 195
		offset = (140-occupied_height)/2
		translateY = -inicoorry + inicoorry*(offset/140)
		translateX = 0
	}	
	
	
	useEl = SVGDoc.createElement("use")
	useEl.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#base")
//	useEl.setAttribute("x",200)
//	useEl.setAttribute("y",-200)
	new_g.appendChild(useEl)
	new_g.setAttribute("transform", "scale("+om_scale+",-"+om_scale+") translate("+translateX+","+translateY+")")

	moving_rect= build_node("rect",
		{
                	id: "moving_rect",
                	x: (195-inicoorrx*om_scale)/2, y:(140-inicoorry*om_scale)/2,
                	width:inicoorrx*om_scale, height:inicoorry*om_scale,
			onmousedown: "beginPan(evt)", onmousemove: "doPan(evt)",
			onmouseup:"endPan()", onmouseout:"endPan()",
			style:"stroke:blue;stroke-width:3pt;fill:cyan;opacity:0.3;"
            	},new_svg)
//	om_adjust()
}

function om_adjust() {
	moving_rect = document.getElementById("moving_rect")
	if(moving_rect) {
		this_scale = 1/document.rootElement.currentScale
		moving_rect.setAttribute("width",(inicoorrx*om_scale)*this_scale)
		moving_rect.setAttribute("height",inicoorry*om_scale*this_scale)

// coordinates of lower left corner are: in screen: (navigationWidth+sbWidth, getInnerHeight())
// given the screen coords, compute the svg coords of the left bottom:
		nowX = navigationWidth+sbWidth;
		nowY = getInnerHeight();
//		alert("corner: "+nowX+"   "+nowY+"   "+convertX()+"   "+convertY())
		rect_x = om_scale*convertX() 
		rect_y = (inicoorry*om_scale)* (1 - this_scale - convertY() /inicoorry)
		moving_rect.setAttribute("x",((195-inicoorrx*om_scale)/2)+rect_x)
		moving_rect.setAttribute("y",((140-inicoorry*om_scale)/2)+rect_y)


	}
}
var pressed = 0;
var dataPanelPressed = 0;
var pluginPixWidth;
var pluginPixHeight;
var svgMainViewport;
var polycolor;
var myCurClass;
var myVarIndex;
var nrClasses;
var zoomVal;
var evtX;
var evtY;
var dataPanelEvtX;
var dataPanelEvtX;
var rectUlXCorner;
var rectUlYCorner


function beginPan(evt) {
	pressed = 1;
	moving_rect = document.getElementById("moving_rect")
	width = parseFloat(moving_rect.getAttribute("width"));
	height = parseFloat(moving_rect.getAttribute("height"));
	rectUlXCorner = parseFloat(moving_rect.getAttribute("x"));
	rectUlYCorner = parseFloat(moving_rect.getAttribute("y"));	
	evtX = parseFloat(evt.getClientX());
	evtY = parseFloat(evt.getClientY());
}

function doPan(evt) {
	if (pressed == 1) {
		moving_rect = document.getElementById("moving_rect")
		newEvtX = parseFloat(evt.getClientX()) 
		newEvtY = parseFloat(evt.getClientY()) 
		toMoveX = rectUlXCorner + (newEvtX - evtX) ;
		toMoveY = rectUlYCorner + (newEvtY - evtY) ;
		moving_rect.setAttribute("x",toMoveX)
		moving_rect.setAttribute("y",toMoveY)

		evtX = newEvtX;
		evtY = newEvtY;
		rectUlXCorner = parseFloat(moving_rect.getAttribute("x"));
		rectUlYCorner = parseFloat(moving_rect.getAttribute("y"));	
	}
	if (pressed == 25) {
		newEvtX = parseFloat(evt.getClientX()) * yFactor; //yFactor is because of resizable interface
		newEvtY = parseFloat(evt.getClientY()) * yFactor;
		toMoveX = rectUlXCorner + (newEvtX - evtX) * allWidth / pluginPixWidth;
		toMoveY = rectUlYCorner + (newEvtY - evtY) * allHeight / pluginPixHeight;
		
		//restrict to borders of overviewmap
		if (toMoveX < xOriginCorner) {
			svgRect.setAttribute("x",xOriginCorner);
		}
		else if ((toMoveX + width) > (xOriginCorner + allWidth)) {
			svgRect.setAttribute("x",xOriginCorner + allWidth - width);				
		}
		else {
			svgRect.setAttribute("x",toMoveX);			
		}
		if (toMoveY < yOriginCorner) {
			svgRect.setAttribute("y",yOriginCorner);
		}
		else if ((toMoveY + height) > (yOriginCorner + allHeight)) {
			svgRect.setAttribute("y",yOriginCorner + allHeight - height);
		}				
		else {
			svgRect.setAttribute("y",toMoveY);
		}
		
		evtX = newEvtX;
		evtY = newEvtY;
		rectUlXCorner = parseFloat(svgRect.getAttribute("x"));
		rectUlYCorner = parseFloat(svgRect.getAttribute("y"));	
	}	
}

function endPan() {
//	statusChange("panning map - please be patient ...");
	if(pressed == 1) {
	moving_rect = document.getElementById("moving_rect")
	karta= document.getElementById("karta")
	r = SVGDoc.getDocumentElement();
	karta_trans = karta.getAttribute("transform")
	xulcorner = parseFloat(moving_rect.getAttribute("x"))/om_scale;
	yulcorner = parseFloat(moving_rect.getAttribute("y"))/om_scale;
	
	alert(om_scale+"  "+document.getDocumentElement().currentTranslate.x +"   "+document.getDocumentElement().currentTranslate.y)

	mx = moving_rect.getAttribute("x")
	my = moving_rect.getAttribute("y")
	a1 = r.currentScale*( (navigationWidth+sbWidth) + (mapscale/om_scale)*(mx-195+(inicoorrx*om_scale)/2) )
	r.currentTranslate.x = (navigationWidth+sbWidth)- a1
	status= "   "+SVGDoc.getDocumentElement().currentTranslate.x+"   "+a1+"   "+mx
//	alert(karta_trans+"   "+mapscale+"   "+xulcorner+"   "+yulcorner)
//	document.getDocumentElement().currentScale = 2
//	document.getDocumentElement().currentTranslate.x = -x_off
//	document.getDocumentElement().currentTranslate.y = -200
//	document.getDocumentElement.currentScale = mapscale/2
//	karta.setAttribute("transform","scale("+mapscale/2+","+(-mapscale)/2+") translate("+1000+","+(-2000)+")")
	pressed = 0;
	if(pressed == 25) {
	//set viewport of main map
	xulcorner = parseFloat(svgRect.getAttribute("x"));
	yulcorner = parseFloat(svgRect.getAttribute("y"));
	width = parseFloat(svgRect.getAttribute("width"));
	height = parseFloat(svgRect.getAttribute("height"));
	newViewport = xulcorner + " " + yulcorner + " " + width + " " + height;
	svgMainViewport.setAttribute("viewBox",newViewport);
	statusChange("map ready ...");
	}
pressed=0;
}
}
