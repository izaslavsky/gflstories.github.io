/*****
*
*   syncStables
*
*	ensures that the "stables" group does not pan or zoom when the map is panned/zoomed/resized. 
*	The "stables" group includes menu, title, legend, and a few other unmovable objects
*
*****/
onerror=skiperror;
function syncStables() 
{ 
	var b = document.getElementById("stables") 
	var r = document.rootElement 
	var s = 1/r.currentScale 
	b.setAttribute( "transform", "scale(" + s + "," + s + ") translate(" + (-r.currentTranslate.x) +"," + (-r.currentTranslate.y) + ")" )
} 


function syncStables_resize() 
{ 
	var b = document.getElementById("stables") 
	var r = document.rootElement 
	var s = 1/r.currentScale 
	b.setAttribute( "transform", "scale(" + s + "," + s + ") translate(" + (-r.currentTranslate.x) +"," + (-r.currentTranslate.y) + ")" )
	var k = document.getElementById("karta")
// recomputing karta scale:
	
	getScaleNow()

	translateX = (navigationWidth+sbWidth)/mapscale;
	translateY = -inicoorry-(titleHeight/mapscale);
	k.setAttribute("transform","scale("+mapscale+","+(-mapscale)+") translate("+translateX+","+translateY+")")

	maptit = document.getElementById("map_title_text")
	newstart = (navigationWidth+sbWidth)+(screenWidth-maptit.getComputedTextLength())/2
	maptit.setAttribute("x", newstart)

	tit_bgr = document.getElementById("title_background")
	tit_bgr.setAttribute("width", getInnerWidth())
	
	navirect = document.getElementById("navi_rect")
	navirect.setAttribute("height",getInnerHeight()+sbScrollY)

	helptxt = document.getElementById("help_txt")
	helptxt.setAttribute("y",getInnerHeight()+sbScrollY-40)
} 


/*****
*
*   MyFunction
*
*	appears on the content-sensitive menu
*
*****/
function MyFunction(evt) {
	alert("Coming Soon..."+navigator.appVersion);
	var r = document.rootElement 
	myElement = nowElement;
//	alert(r.currentScale+"  "+r.currentTranslate.x+"  "+r.currentTranslate.y)
//	alert(myElement.getAttribute("id")+"   "+nowX+"   "+nowY)
//adjusting for scale and translate
	screenX = (nowX-r.currentTranslate.x)/r.currentScale
	screenY = (nowY-r.currentTranslate.y)/r.currentScale
//	alert(screenX+"   "+screenY)
//converting to real SVG coordinates
//	svgX = inicoorrx*(realX/(getInnerWidth()-navigationWidth))
//	svgY = inicoorry*((getInnerHeight()-titleHeight-realY)/(getInnerHeight()-titleHeight))
	transX = (navigationWidth+sbWidth)/mapscale;
	transY = -inicoorry-(titleHeight/mapscale);
	svgX = (screenX/mapscale)-transX
	svgY = (screenY/(-mapscale))-transY
	alert(svgX+"   "+svgY+"   "+getInnerWidth()+"   "+getInnerHeight())
	opwin("http://www.yahoo.com")
}

function MyLabel(evt) 
{
	var r = document.rootElement 
	myElement = nowElement;

	id = myElement.getAttribute('id')+''
	if((id == "nom")||(id == "nomrect")) 
	{
		oid = myElement.getAttribute("oid")
		myElement=SVGDoc.getElementById(oid)
	}	

	labelid =myElement.getParentNode().getAttribute("id")	
	if(labelid.substring(0,3) == "l__") 
	{
		oid = labelid.substring(3)
		myElement=SVGDoc.getElementById(oid)
	}	

	thislabel = myElement.getAttribute("title")
	cosmetic = SVGDoc.getElementById("cosmetic")
	if(myElement.getParentNode().getNodeName() == "a")
	{
		layerID = myElement.getParentNode().getParentNode().getAttribute("id")
	}
	else
	{
		layerID = myElement.getParentNode().getAttribute("id")
	}

	if((layerID.substring(0,2)=="fp") || (layerID.substring(0,2)=="po")) 
	{
		off=5
	}
	else
	{
		off=0
	}

	g=SVGDoc.createElement("g")
	g.setAttribute("id","l__"+myElement.getAttribute("id"))

	t=SVGDoc.createTextNode(thislabel);
	mylabel = SVGDoc.createElement("text")
	mylabel.setAttribute("x",convertX()+((off+2)/mapscale))
	mylabel.setAttribute("y",convertY()-((off+2)/mapscale))
	mylabel.setAttribute("style","text-anchor:left;font-size:"+10/mapscale+";font-family:Arial;fill:black;font-weight:bold")
	mylabel.appendChild(t);
	textlen = mylabel.getComputedTextLength()
	mylabel_rect = SVGDoc.createElement("rect")
	mylabel_rect.setAttribute("x",convertX()+(off/mapscale))
	mylabel_rect.setAttribute("y",convertY()-((off+12)/mapscale))
	mylabel_rect.setAttribute("width",textlen+(10/mapscale))
	mylabel_rect.setAttribute("height",12/mapscale)
	mylabel_rect.setAttribute("fill","white")
	mylabel_rect.setAttribute("stroke","black")
		
	g.appendChild(mylabel_rect)
	g.appendChild(mylabel)
	cosmetic.appendChild(g)
	g.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
}


function coorround(numb) 
{
	return Math.round(numb*Math.pow(10,2))/Math.pow(10,2)
}


function convertX() {
	var r = document.rootElement 
	screenX = (nowX-r.currentTranslate.x)/r.currentScale
	transX = (navigationWidth+sbWidth)/mapscale;
return (screenX/mapscale)-transX
}

function convertY() {
	var r = document.rootElement 
	screenY = (nowY-r.currentTranslate.y)/r.currentScale
	transY = -inicoorry-(titleHeight/mapscale);
return (screenY/(-mapscale))-transY
}


function GetElementAndPosition(evt)
{
//	alert("ttt")
	nowElement = evt.getTarget();
	nowX = evt.getClientX()
	nowY = evt.getClientY()
	oid = nowElement.getAttribute("id")

	if((oid == "nom")||(oid=="nomrect")) {
		oid = nowElement.getAttribute("oid")
		nowElement = SVGDoc.getElementById(oid)
	}
	if(nowElement  && nowElement.getParentNode() && nowElement.getParentNode().getAttribute("id")) {
		labelid =nowElement.getParentNode().getAttribute("id")	
		if(labelid.substring(0,3) == "l__") 
		{
			oid = labelid.substring(3)
			nowElement=SVGDoc.getElementById(oid)
		}	
	}

	if(nowElement && (nowX>(navigationWidth+sbWidth)) && (nowY>titleHeight)) 
	{
//CONTROLLING TOOLTIP - for all objects with lbl
		target_coor = nowElement.getAttribute("lbl")+'';
		tooltip_obj = SVGDoc.getElementById("nom");
		tooltip_rect = SVGDoc.getElementById("nomrect");
		if((target_coor != '') && (target_coor != 'null')) 
		{
			target_title = nowElement.getAttribute('title')+'';
		  	lbl_coor = target_coor.split(",");
		  	tooltip_obj.setAttribute("oid",oid);
		  	tooltip_obj.setAttribute("x",lbl_coor[0]);
		  	tooltip_obj.setAttribute("y",lbl_coor[1]);
		  	tooltip_obj.getFirstChild().setData(target_title);
			tooltip_obj.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
		  	tooltip_obj.getStyle().setProperty("font-size",14/mapscale);
		  	tooltip_obj.getStyle().setProperty("fill","blue");
		  	tooltip_obj.getStyle().setProperty("visibility","visible");

	textlen = tooltip_obj.getComputedTextLength()
	tooltip_rect.setAttribute("x",lbl_coor[0]-textlen/2 - (2/mapscale))
	tooltip_rect.setAttribute("y",lbl_coor[1]-(12/mapscale))
	tooltip_rect.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
	tooltip_rect.setAttribute("width",textlen+(10/mapscale))
	tooltip_rect.setAttribute("height",16/mapscale)
	tooltip_rect.setAttribute("stroke","blue")
	tooltip_rect.setAttribute("stroke-width","1")
  	tooltip_rect.getStyle().setProperty("visibility","visible");

		}
		else
		{
		  	if(nowElement != tooltip_obj) 
			{
			  	tooltip_obj.setAttribute("oid",oid);
			  	tooltip_obj.setAttribute("x",convertX());
		  		tooltip_obj.setAttribute("y",convertY()-(5/mapscale));
				target_title = nowElement.getAttribute('title')+'';
			  	tooltip_obj.getFirstChild().setData(target_title);
				tooltip_obj.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
			  	tooltip_obj.getStyle().setProperty("font-size",12/mapscale);
		  		tooltip_obj.getStyle().setProperty("fill","black");
			  	tooltip_obj.getStyle().setProperty("visibility","visible");

	textlen = tooltip_obj.getComputedTextLength()
	tooltip_rect.setAttribute("x",convertX()-textlen/2 - (3/mapscale))
	tooltip_rect.setAttribute("y",convertY()-(5/mapscale)-(12/mapscale))
	tooltip_rect.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
	tooltip_rect.setAttribute("width",textlen+(10/mapscale))
	tooltip_rect.setAttribute("height",14/mapscale)
//	tooltip_rect.setAttribute("stroke","black")
	tooltip_rect.setAttribute("stroke-width","0")
  	tooltip_rect.getStyle().setProperty("visibility","visible");


//alert(convertX()+"   "+convertY()+"   "+tooltip_obj.getAttribute("transform"))

		  	}
		}
		location_status = "[X: "+(coorround((convertX()/exfactor)+xshift)+'')+"  Y: "+(coorround((convertY()/exfactor)+yshift)+'')+"]"
		num_of_blanks = 33 - location_status.length
		str=''
		for(q=0;q<num_of_blanks;q++) {
			str+="_"
		}
		status = location_status+str+object_status

	}
	else
	{
		location_status = ""
		status = ""
	}
}


function k_mouseover(evt) 
{
	title=''
	val=''
	var target = evt.getTarget();
	
	if(target.getAttribute('id')) {
		status = "id= "+target.getAttribute('id')
	}
	else
	{
		status = "id= not defined"
	}

	id = target.getAttribute('id')+''
	if((id == "nom") || (id=="nomrect")) 
	{
		oid = target.getAttribute("oid")
		target=SVGDoc.getElementById(oid)
	}	
	if(target  && target.getParentNode() && target.getParentNode().getAttribute("id")) {
		labelid =target.getParentNode().getAttribute("id")	
		if(labelid.substring(0,3) == "l__") 
		{
			oid = labelid.substring(3)
			target=SVGDoc.getElementById(oid)
		}	
	}
	if(target && target.getAttribute('title')) title = target.getAttribute('title')+''
	if(target && target.getAttribute('val')) val = target.getAttribute('val')+''
	stat = title
	if(target && target.getParentNode() && (target.getParentNode().getNodeName() == "a")) stat = stat +".   Click to open URL"
	if(target && (id.substr(0,1) == "a") && (id.indexOf("_l") == -1))
	{
	    target_style = target.getStyle()
		target_style.setProperty('fill-opacity','0.2')
	    object_status = stat+"   "+val
	}
	window.setTimeout('object_status= stat+"  " +val',1)
}
function k_mouseout(evt) 
{
	var title=''
	var target = evt.getTarget();
	id = target.getAttribute('id')+''
	if((id == "nom")||(id=="nomrect")) 
	{
		oid = target.getAttribute("oid")
		target=SVGDoc.getElementById(oid)
	}	
	if(target  && target.getParentNode() && target.getParentNode().getAttribute("id")) {
		labelid =target.getParentNode().getAttribute("id")	
		if(labelid.substring(0,3) == "l__") 
		{
			oid = labelid.substring(3)
			target=SVGDoc.getElementById(oid)
		}	
	}
	if(target) title = target.getAttribute('title')
	if(target && (id.substr(0,1) == "a" ) && (id.indexOf("_l") == -1) )
	{
		target_style = target.getStyle()
	    target_style.setProperty('fill-opacity','1.0')
	}
	window.setTimeout("window.status=''",1)
}
function k_onclick(evt) {
	if (evt.getButton() == 0) {
		var target = evt.getTarget();
		url = target.getAttribute('u')+''
		if((url != '') && (url != 'null')) SVGDoc.parent.getWindow().opwin2(url)
	}
}

function opwin(value) {
setTimeout("parent.open('"+value+"','','toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,height=400,width=600')",100)
}
function skiperror(message, url, line) 
{
	return true
}
