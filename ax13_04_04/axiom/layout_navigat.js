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
	previousscaling = currentscaling;
	currentscaling = r.currentScale;
	oldmapscale = mapscale;
	getScaleNow();
	b.setAttribute( "transform", "scale(" + s + "," + s + ") translate(" + (-r.currentTranslate.x) +"," + (-r.currentTranslate.y) + ")" )
	all_rescale();
} 

function all_rescale() {
	rescale_points();
	rescale_lines("lin");
	rescale_lines("fl");
	rescale_lines("br");
	rescale_lines("fr");
	rescale_lines("reg");
	rescale_lines("base");
	rescale_labels();
	if(pressed == 0) om_adjust()
}

function rescale_points() {
	var r = new Array(1)
	defs = document.getElementsByTagName("defs").item(0)
// for circles
	circles = defs.getElementsByTagName("circle")
	for(i=0;i<circles.length;i++) {
		pscaling=getPointSize(circles.item(i))
		circles.item(i).setAttribute("r",pscaling[0]/2+"pt")
		circles.item(i).getStyle().setProperty("stroke-width", pscaling[1]+"pt")
	}	
// for rects
	rects = defs.getElementsByTagName("rect")
	for(i=0;i<rects.length;i++) {
		pscaling=getPointSize(rects.item(i))
		rects.item(i).setAttribute("height",pscaling[0]+"pt")
		rects.item(i).setAttribute("width",pscaling[0]+"pt")
		rects.item(i).getStyle().setProperty("stroke-width", pscaling[1]+"pt")
	}	
// for images
	images = defs.getElementsByTagName("image")
	for(i=0;i<images.length;i++) {
		pscaling=getPointSize(images.item(i))
		images.item(i).setAttribute("height",pscaling[0]+"pt")
		images.item(i).setAttribute("width",pscaling[0]+"pt")
	}	
}

function rescale_lines(cur_type) {
	lingroup = document.getElementById(cur_type)
	if(cur_type!="base") 
	{
		lins = lingroup.getElementsByTagName("g")
		for(i=0;i<lins.length;i++)
		{
			linID = lins.item(i).getAttribute("id")
			currentlayer_type=cur_type
			currentlayer_num=Number(linID.substring(cur_type.length,linID.length))
			xrender = eval(currentlayer_type+"_r")[currentlayer_num]
			r = xrender.split(",");
			osize = 1*log2_1(1.1 +(1/currentscaling))*(r[1]/mapscale);
			lins.item(i).getStyle().setProperty("stroke-width", osize+"pt")
		}
	}
	else
	{
		if(base_r)
		{
			r = base_r.split(",");
			osize = 1*log2_1(1.1 +(1/currentscaling))*(r[1]/mapscale);
			lingroup.getStyle().setProperty("stroke-width", osize+"pt")
		}
	}
}

function rescale_labels() {
	cosmetic = document.getElementById("cosmetic")
	labgroups = cosmetic.getElementsByTagName("g")
	for(i=0;i<labgroups.length;i++){
		thislabel = labgroups.item(i)
		labelID = thislabel.getAttribute("id")
		label_tran = thislabel.getAttribute("transform")
		rect = thislabel.getFirstChild()
		txt = thislabel.getLastChild()
		textlen_p = txt.getComputedTextLength()
		rect_x = Number(rect.getAttribute("x"))
		rect_y = Number(rect.getAttribute("y"))
		rect_width = Number(rect.getAttribute("width"))
		rect_height = Number(rect.getAttribute("height"))
		txt_x = Number(txt.getAttribute("x"))
		txt_y = Number(txt.getAttribute("y"))
		txt_fnt = 1*log2_1(1.1 +(1/currentscaling))*(10/mapscale);
		txt.getStyle().setProperty("font-size",txt_fnt)
		textlen_n = txt.getComputedTextLength()

		rect_x_real = rect_x +textlen_p/2 + (3/currentscaling/mapscale)

		lab_type=""
		if(labelID.length>3) {
			lab_type = labelID.substring(3,5)
		}
		if((lab_type=="fp")||(lab_type=="po")) {off=5}else{off=0}

//status = rect_x_real+"       "+currentscaling+"  "+previousscaling+"   "+mapscale+"    "+oldmapscale

//		new_rect_x = rect_x  -((-3)/currentscaling/mapscale)+((-3)/previousscaling/mapscale)
//		new_rect_y = rect_y - si(off+12) + (log2_1(1.1 +(1/previousscaling))*((off+12)/mapscale))
//		new_rect_width = rect_width+(textlen_n+(10/currentscaling/mapscale))-(textlen_p+(10/previousscaling/mapscale))
//		new_rect_height = rect_height + si(12) - (log2_1(1.1 +(1/previousscaling))*(12/mapscale))
//		new_txt_x = txt_x + si(off+2) - (log2_1(1.1 +(1/previousscaling))*((off+2)/mapscale))
//		new_txt_y = txt_y - si(off+2) + (log2_1(1.1 +(1/previousscaling))*((off+2)/mapscale))

//		txt.setAttribute("x",txt_x  -((-3)/currentscaling/mapscale)+((-3)/previousscaling/oldmapscale))
		txt.setAttribute("x",txt_x + si(off+2) - (log2_1(1.1 +(1/previousscaling))*((off+2)/oldmapscale)))
		txt.setAttribute("y",txt_y - si(off+2) + (log2_1(1.1 +(1/previousscaling))*((off+2)/oldmapscale)))
		rect.setAttribute("x",rect_x  -((-3)/currentscaling/mapscale)+((-3)/previousscaling/oldmapscale))			
		rect.setAttribute("y",rect_y - si(off+12) + (log2_1(1.1 +(1/previousscaling))*((off+12)/oldmapscale)))			
//		rect.setAttribute("width",rect_width+(textlen_n+(10/currentscaling/mapscale))-(textlen_p+(10/previousscaling/oldmapscale)))			
//		rect.setAttribute("height",rect_height + si(12) - (log2_1(1.1 +(1/previousscaling))*(12/oldmapscale)))

//		txt.setAttribute("x",txt_x)
//		txt.setAttribute("y",txt_y - si(10))
//		rect.setAttribute("x",rect_x  -textlen_n/2 - ((-3)/currentscaling/mapscale))			
//		rect.setAttribute("y",rect_y - si(22) )			
		rect.setAttribute("width",textlen_n+(10/currentscaling/mapscale))
		rect.setAttribute("height", si(12) )
	}
}


function getPointSize(element) 
{
	var r = new Array(1)
	var pscaling  = new Array(1)
	poiID = element.getAttribute("id")
	if(poiID.substring(3,6)=="poi") {
		currentlayer_type = "poi"
		currentlayer_num=Number(poiID.substring(6,poiID.length))
	}
	else
	{
		currentlayer_type = "fp"
		currentlayer_num=Number(poiID.substring(5,poiID.length))
	}
	xrender = eval(currentlayer_type+"_r")[currentlayer_num]
	r = xrender.split(",");
	pscaling[0] = 180*log2_1(1.1 +(1/currentscaling))*(1/mapscale/(15 - r[1]))
	if(r[4]>0) {
		pscaling[1] = 1*log2_1(1.1 +(1/currentscaling))*(r[4]/mapscale);
	}else{pscaling[1]=0}
	return pscaling;
}

function syncStables_resize() 
{ 
	var b = document.getElementById("stables") 
	var r = document.rootElement 
	var s = 1/r.currentScale 
	b.setAttribute( "transform", "scale(" + s + "," + s + ") translate(" + (-r.currentTranslate.x) +"," + (-r.currentTranslate.y) + ")" )
	var k = document.getElementById("karta")
// recomputing karta scale:

	oldmapscale = mapscale;	
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

	all_rescale();
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
	alert(myElement.getAttribute("id")+"   "+nowX+"   "+nowY)
//adjusting for scale and translate
	screenX = (nowX-r.currentTranslate.x)/r.currentScale
	screenY = (nowY-r.currentTranslate.y)/r.currentScale
	alert(nowX+"   "+nowY+"   "+screenX+"   "+screenY)
//converting to real SVG coordinates
//	svgX = inicoorrx*(realX/(getInnerWidth()-navigationWidth))
//	svgY = inicoorry*((getInnerHeight()-titleHeight-realY)/(getInnerHeight()-titleHeight))
	transX = (navigationWidth+sbWidth)/mapscale;
	transY = -inicoorry-(titleHeight/mapscale);
	svgX = (screenX/mapscale)-transX
	svgY = (screenY/(-mapscale))-transY
	alert(svgX+"   "+svgY+"   "+getInnerWidth()+"   "+getInnerHeight())
//	opwin("http://www.yahoo.com")
}

function pointData() {
	alert("this is pointdata")
	karta = SVGDoc.getElementById("karta")
//	karta.setAttribute("transform", "scale(0.12137121680049413,-0.12137121680049413) translate(3000,-5000)")
//	transform="scale(0.12137121680049413,-0.12137121680049413) translate(1647.8371501272266,-6805.567430025445)" 
}
function pointData2() {
	alert("this is pointdata2")
}

function set_menu() {
	ifmap=true
	thisId = ""
	thisParentId = ""
	if(nowElement.getAttribute('id')) thisId = nowElement.getAttribute('id')
	if(nowElement.getParentNode().getAttribute('id')) thisParentId = nowElement.getParentNode().getAttribute('id')
	if(
		(thisParentId=="map_title")||
		(thisParentId=="help_txt")||
		(thisParentId=="navi")||
		(thisParentId=="savevar")||
		(thisParentId=="axiomap")||
		(thisId.substring(0,4)=="selb")||
		(thisId.substring(0,4)=="cate")||
		(thisParentId.substring(0,4)=="quer")||
		(thisParentId.substring(0,4)=="comp")||
		(thisParentId.substring(0,4)=="opti")||
		(thisParentId.substring(0,4)=="cate")||
		(thisParentId.substring(thisParentId.length-2,thisParentId.length)=="_t")||
		(thisParentId.substring(0,4)=="selb"))
		ifmap=false;

	Menu_entire = document.getElementById('MENU')
	MenuItem_pointData = document.getElementById("pointdata")
	MenuItem_labelit = document.getElementById("labelit")
//	alert(MenuItem_pointData.getAttribute("onactivate"))
//	MenuItem_pointData.setAttribute("onactivate","pointData2()")
//	newloc = locsystem+"showtable.htm#"+thisId
//	MenuItem_pointData.setAttribute("xlink:href",newloc)
	
	if(ifmap) {
		MenuItem_labelit.setAttribute("onactivate","MyLabel()")	
		MenuItem_labelit.getFirstChild().setData("Label it!")	
	}
	else
	{
		MenuItem_labelit.setAttribute("onactivate","")	
		MenuItem_labelit.getFirstChild().setData("No Feature to Label")	
	}
	var newMenuRoot=parseXML(printNode(Menu_entire),contextMenu);
	contextMenu.replaceChild(newMenuRoot,contextMenu.firstChild)

	
}

function MyLabel(evt) 
{
	thisId = nowElement.getAttribute('id')
	thisParentId = nowElement.getParentNode().getAttribute('id')
	var r = document.rootElement 
	myElement = nowElement;

	id = myElement.getAttribute('id')+''
	if((id == "nom")||(id == "nom2")||(id == "nomrect")|| (id=="nom2rect")) 
	{
		oid = myElement.getParentNode().getAttribute("oid")
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

	mylabel = SVGDoc.createElement("text")
	mylabel.setAttribute("x",convertX()+si(off+2))
	mylabel.setAttribute("y",convertY()-si(off+2))
	mylabel.setAttribute("style","text-anchor:left;font-size:"+10/mapscale+";font-family:Arial;fill:black;font-weight:bold")
  	mylabel.getStyle().setProperty("font-size",si(10));
	t=SVGDoc.createTextNode(thislabel);
	mylabel.appendChild(t);

	textlen = mylabel.getComputedTextLength()

	mylabel_rect = SVGDoc.createElement("rect")
	mylabel_rect.setAttribute("x",convertX()-((-3)/currentscaling/mapscale))
	mylabel_rect.setAttribute("y",convertY()-si(off+12))
	mylabel_rect.setAttribute("width",textlen+(10/currentscaling/mapscale))
	mylabel_rect.setAttribute("height",si(12))
	mylabel_rect.setAttribute("fill","white")
	mylabel_rect.setAttribute("stroke","black")
		
	g.appendChild(mylabel_rect)
	g.appendChild(mylabel)
	cosmetic.appendChild(g)
	g.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
}

function si(offset) {
	return log2_1(1.1 +(1/currentscaling))*(offset/mapscale)
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
	nowElement = evt.getTarget();
	nowX = evt.getClientX()
	nowY = evt.getClientY()
	oid = nowElement.getAttribute("id")
	if((oid=="karta_canvas")||(nowElement.getParentNode().getAttribute("id")=="legend")||(nowElement.getParentNode().getParentNode().getAttribute("id")=="legend")) {
		SVGDoc.getElementById("nom").getStyle().setProperty("visibility","hidden");
		SVGDoc.getElementById("nom2").getStyle().setProperty("visibility","hidden");
		SVGDoc.getElementById("nomrect").getStyle().setProperty("visibility","hidden");
		SVGDoc.getElementById("nom2rect").getStyle().setProperty("visibility","hidden");
		status=""
		return
	}

	if((oid == "nom")||(oid == "nom2")||(oid=="nomrect")||(oid=="nom2rect")) {
		oid = nowElement.getParentNode().getAttribute("oid")
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

	if(nowElement && (nowX>(navigationWidth+sbWidth+20)) && (nowY>titleHeight+10)) 
	{
//CONTROLLING TOOLTIP - for all objects with lbl
		target_coor = nowElement.getAttribute("lbl")+'';
		tooltip_obj = SVGDoc.getElementById("nom");
		tooltip_rect = SVGDoc.getElementById("nomrect");
		alltip = SVGDoc.getElementById("tooltips");
		if((target_coor != '') && (target_coor != 'null')) 
		{
			target_title = nowElement.getAttribute('title')+'';
		  	lbl_coor = target_coor.split(",");
		  	tooltip_obj.getParentNode().setAttribute("oid",oid);
		  	tooltip_obj.setAttribute("x",lbl_coor[0]);
		  	tooltip_obj.setAttribute("y",lbl_coor[1]);
		  	tooltip_obj.getFirstChild().setData(target_title);
			tooltip_obj.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
		  	tooltip_obj.getStyle().setProperty("font-size",si(14));
		  	tooltip_obj.getStyle().setProperty("fill","blue");
		  	tooltip_obj.getStyle().setProperty("visibility","visible");
		  	
			textlen = tooltip_obj.getComputedTextLength()
			tooltip_rect.setAttribute("x",lbl_coor[0]-textlen/2 - (2/mapscale))
			tooltip_rect.setAttribute("y",lbl_coor[1]-si(12))
			tooltip_rect.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
			tooltip_rect.setAttribute("width",textlen+(10/mapscale))
		  	tooltip_rect.setAttribute("height",si(16));
			tooltip_rect.getStyle().setProperty("stroke","blue")	
			tooltip_rect.getStyle().setProperty("stroke-width","1")
  			tooltip_rect.getStyle().setProperty("visibility","visible");

			if(nowElement && nowElement.getAttribute('val')) 
			{
				tooltip_value = SVGDoc.getElementById("nom2");
				tooltip_vrect = SVGDoc.getElementById("nom2rect");
				val = nowElement.getAttribute('val')+''

			  	tooltip_value.getParentNode().setAttribute("oid",oid);
			  	tooltip_value.setAttribute("x",(lbl_coor[0]-textlen/2));
			  	tooltip_value.setAttribute("y",lbl_coor[1]-si(-12));
		  		tooltip_value.getFirstChild().setData(val);
				tooltip_value.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
			  	tooltip_value.getStyle().setProperty("font-size",si(10));
			  	tooltip_value.getStyle().setProperty("fill","black");
		  		tooltip_value.getStyle().setProperty("visibility","visible");

				textlen = tooltip_value.getComputedTextLength()

				tooltip_vrect.setAttribute("x",tooltip_rect.getBBox().x)
				tooltip_vrect.setAttribute("y",lbl_coor[1]-si(-4) )
				tooltip_vrect.setAttribute("transform","scale(1,-1) translate(0,-"+(lbl_coor[1]*2)+")")
				tooltip_vrect.setAttribute("width",tooltip_value.getBBox().width+(14/currentscaling/mapscale))
			  	tooltip_vrect.setAttribute("height",si(10));
				tooltip_vrect.getStyle().setProperty("stroke-width","0")
	  			tooltip_vrect.getStyle().setProperty("visibility","visible");
			}

		}
		else
		{
			SVGDoc.getElementById("nom2").getStyle().setProperty("visibility","hidden");
			SVGDoc.getElementById("nom2rect").getStyle().setProperty("visibility","hidden");
		  	if(nowElement != tooltip_obj) 
			{
			  	tooltip_obj.getParentNode().setAttribute("oid",oid);
			  	tooltip_obj.setAttribute("x",convertX());
		  		tooltip_obj.setAttribute("y",convertY()-si(10));
				target_title = nowElement.getAttribute('title')+'';
			  	tooltip_obj.getFirstChild().setData(target_title);
				tooltip_obj.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
			  	tooltip_obj.getStyle().setProperty("font-size",si(12));
		  		tooltip_obj.getStyle().setProperty("fill","black");
			  	tooltip_obj.getStyle().setProperty("visibility","visible");

				textlen = tooltip_obj.getComputedTextLength()

//alert(convertX())

				tooltip_rect.setAttribute("x",convertX()-textlen/2 - (3/currentscaling/mapscale))
				tooltip_rect.setAttribute("y",convertY()-si(22))
				tooltip_rect.setAttribute("transform","scale(1,-1) translate(0,-"+(convertY()*2)+")")
				tooltip_rect.setAttribute("width",textlen+(10/currentscaling/mapscale))
			  	tooltip_rect.getStyle().setProperty("height",si(14));
				tooltip_rect.getStyle().setProperty("stroke-width","0")
			  	tooltip_rect.getStyle().setProperty("visibility","visible");

				SVGDoc.getElementById("nom2").getStyle().setProperty("visibility","hidden");
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
	id = target.getAttribute('id')+''
	if((id == "nom") ||(id == "nom2")|| (id=="nomrect")|| (id=="nom2rect")) 
	{
		oid = target.getParentNode().getAttribute("oid")
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
	else
	{
	if(target) {	
	    target_style = target.getStyle()
		target_style.setProperty('stroke-opacity','0.5')
		}
	}
	window.setTimeout('object_status= stat+"  " +val',1)
}

function k_mouseout(evt) 
{
	var title=''
	var target = evt.getTarget();
	id = target.getAttribute('id')+''
	if((id == "nom")||(id == "nom2")||(id=="nomrect")|| (id=="nom2rect")) 
	{
		oid = target.getParentNode().getAttribute("oid")
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
	else
	{
	if(target) {	
	    target_style = target.getStyle()
		target_style.setProperty('stroke-opacity','1')
		}
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


function create_button(id,label,callback,parent,status,x,y,wid,hei) 
{
    	par = SVGDoc.getElementById(parent)
	butt = build_node("g",
		{
                	id: id,
                	onmouseup: "toggle_but('"+id+"')"
            	},par
        );
	buttbase = build_node("g",
		{
                	id: id+"_base",
                	onmouseup: "toggle_but('"+id+"')"
            	},butt
        );
	addRect(buttbase,x+1,y+1,wid,hei,"black",3,"black",0);
	addRect(buttbase,x-1,y-1,wid,hei,"white",3,"white",0);
	addRect(buttbase,x,y,wid,hei,"#6666ff",3,"#6666ff",0);
	build_node("text",
		{
                	x: x+wid/2, y: y+4+hei/2,
                	style: "fill:white;font-size:12;font-family:Arial;font-weight:bold;text-anchor:middle"
            	},butt, label
        );
}

function addRect(parent,x,y,wid,hei,fill,r,stroke,stroke_wid) {
	build_node("rect",
		{
                	x: x, y: y, height:hei,width:wid,rx:r,ry:r,
                	style: "fill:"+fill+";stroke-width:"+stroke_wid+";stroke:"+stroke
            	},parent
        );


}
function toggle_but(id) {
	butt_button = SVGDoc.getElementById(id);
	buttbase = SVGDoc.getElementById(id+"_base");
	if(eval(id+"_butt")==false) 
	{
		buttbase.removeChild(buttbase.getFirstChild())
		buttbase.removeChild(buttbase.getFirstChild())
		buttbase_common=buttbase.getFirstChild()
		buttbase_common.getStyle().setProperty("fill","#330099")
		buttbase_common.getStyle().setProperty("stroke","black")
		buttbase_common.getStyle().setProperty("stroke-width","1pt")
		if(id=="compose") compose_butt=true;
		if(id=="query") query_butt=true;
		if(id=="options") options_butt=true;
		show_frame(id)
	}
	else
	{
		buttbase_common=buttbase.getFirstChild()
		buttbase_common.getStyle().setProperty("fill","#6666ff")
		buttbase_common.getStyle().setProperty("stroke-width","0")
		x=Number(buttbase_common.getAttribute("x"))
		y=Number(buttbase_common.getAttribute("y"))
		whiterect = buttbase_common.cloneNode(true)
		blackrect = buttbase_common.cloneNode(true)
		whiterect.setAttribute("x",x-1)
		whiterect.setAttribute("y",y-1)
		whiterect.getStyle().setProperty("fill","white")
		blackrect.setAttribute("x",x+1)
		blackrect.setAttribute("y",y+1)
		blackrect.getStyle().setProperty("fill","black")
		buttbase.insertBefore(whiterect,buttbase_common)
		buttbase.insertBefore(blackrect,whiterect)
		if(id=="compose") compose_butt=false;
		if(id=="query") query_butt=false;
		if(id=="options") options_butt=false;
		hide_frame(id)
	}
}

function show_frame(id) 
{
	dialbox=SVGDoc.getElementById(id+"_dialog")
	composebox=SVGDoc.getElementById("compose_dialog")
	querybox=SVGDoc.getElementById("query_dialog")
	optionsbox=SVGDoc.getElementById("options_dialog")
	hier_menu=SVGDoc.getElementById("hier_menu")
	hier_rect=SVGDoc.getElementById("hier_rect")
//	hierrect_width=hier_rect.getBBox().width
	
	if(id=="compose") {
		dialbox_height= dialogs_h[0]
		query_y += dialbox_height
		options_y += dialbox_height
		composebox.setAttribute("transform","translate(0,"+compose_y+")")
		composebox.setAttribute("visibility","visible")
		if(query_butt) querybox.setAttribute("transform","translate(0,"+query_y+")")
		if(options_butt) optionsbox.setAttribute("transform","translate(0,"+options_y+")")
	}
	if(id=="query") {
		dialbox_height= dialogs_h[1]
		options_y += dialbox_height
		querybox.setAttribute("transform","translate(0,"+query_y+")")
		querybox.setAttribute("visibility","visible")
		if(options_butt) optionsbox.setAttribute("transform","translate(0,"+options_y+")")
	}
	if(id=="options") {
		dialbox_height= dialogs_h[2]
		optionsbox.setAttribute("transform","translate(0,"+options_y+")")
		optionsbox.setAttribute("visibility","visible")
	}

	height_of_dialogs = height_of_dialogs+dialbox_height
	currentNaviHeight = Number(hier_rect.getAttribute("height")) + 100+height_of_dialogs
	hier_menu.setAttribute("transform","translate(0,"+height_of_dialogs+")")
	hier_rect.setAttribute("transform","translate(0,"+height_of_dialogs+")")
	sbSync()
}
function hide_frame(id) 
{
	dialbox=SVGDoc.getElementById(id+"_dialog")
	composebox=SVGDoc.getElementById("compose_dialog")
	querybox=SVGDoc.getElementById("query_dialog")
	optionsbox=SVGDoc.getElementById("options_dialog")
	hier_menu=SVGDoc.getElementById("hier_menu")
	hier_rect=SVGDoc.getElementById("hier_rect")
	if(id=="compose") {
		dialbox_height= dialogs_h[0]
		query_y -= dialbox_height
		options_y -= dialbox_height
		composebox.setAttribute("transform","translate(0,"+compose_y+")")
		composebox.setAttribute("visibility","hidden")
		if(query_butt) querybox.setAttribute("transform","translate(0,"+query_y+")")
		if(options_butt) optionsbox.setAttribute("transform","translate(0,"+options_y+")")
	}
	if(id=="query") {
		dialbox_height= dialogs_h[1]
		options_y -= dialbox_height
		querybox.setAttribute("transform","translate(0,"+query_y+")")
		querybox.setAttribute("visibility","hidden")
		if(options_butt) optionsbox.setAttribute("transform","translate(0,"+options_y+")")
	}
	if(id=="options") {
		dialbox_height= dialogs_h[2]
		optionsbox.setAttribute("transform","translate(0,"+options_y+")")
		optionsbox.setAttribute("visibility","hidden")
	}

	height_of_dialogs = height_of_dialogs-dialbox_height
	currentNaviHeight = Number(hier_rect.getAttribute("height")) + 100+height_of_dialogs
	hier_menu.setAttribute("transform","translate(0,"+height_of_dialogs+")")
	hier_rect.setAttribute("transform","translate(0,"+height_of_dialogs+")")
	sbSync()
}

function init_compose() {
	hier_rect=SVGDoc.getElementById("hier_rect")
	hierrect_width=hier_rect.getBBox().width
	composebox=SVGDoc.getElementById("compose_dialog")
	composebox.setAttribute("visibility","hidden")
	addRect(composebox,5,0,hierrect_width-5,dialogs_h[0],"#0000ff",10,"red","2pt")
	
	build_node("text",
		{
                	x: 30, y: 20,
                	style: "text-anchor:left;font-size:14;font-family:Arial;fill:white;font-weight:bold"
            	},composebox, "Compose Variable"
        );

	build_node("text",
		{
                	x: 12, y: 45,
                	style: "text-anchor:left;font-size:12;font-family:Arial;fill:white;font-weight:bold"
            	},composebox, "Operation"
        );
	build_node("text",
		{
                	x: 30, y: 77,
                	style: "text-anchor:left;font-size:12;font-family:Arial;fill:white;font-weight:bold"
            	},composebox, "Second Variable"
        );
	create_button("savevar","Save Variable","","compose_dialog","Click here to...",40,130,120,20)	
	
	if(nvars0 > 0) {
		for(i=0;i<options0.length;i++) {options2[i]=options0[i]}
		initbox("compose_dialog",2,options2,0);
		options3=sourname
		initbox("compose_dialog",3,options3,0);
		initbox("compose_dialog",4,options4,4);
	}
}

function init_query() {
	hier_rect=SVGDoc.getElementById("hier_rect")
	hierrect_width=hier_rect.getBBox().width
	querybox=SVGDoc.getElementById("query_dialog")
	querybox.setAttribute("visibility","hidden")
	addRect(querybox,5,0,hierrect_width-5,dialogs_h[1],"#0000ff",10,"red","2pt")
	build_node("text",
		{
                	x: 30, y: 45,
                	style: "text-anchor:left;font-size:18;font-family:Arial;fill:white;font-weight:bold"
            	},querybox, "Coming Soon"
        );
}

function init_options() {
	hier_rect=SVGDoc.getElementById("hier_rect")
	hierrect_width=hier_rect.getBBox().width
	optionsbox=SVGDoc.getElementById("options_dialog")
	optionsbox.setAttribute("visibility","hidden")
	addRect(optionsbox,5,0,hierrect_width-5,dialogs_h[2],"#0000ff",10,"red","2pt")

	build_node("text",
		{
                	x: 30, y: 30,
                	style: "text-anchor:left;font-size:18;font-family:Arial;fill:white;font-weight:bold"
            	},optionsbox, "Coming Soon"
        );
}

//***********************************************************************************************************************************************
function log2_1(x) 
{
	return Math.log(x)/Math.log(2.1)
}
/*****
*
*   build_node
*
*****/
function build_node(type, attributes, parent, text) {
    var SVGDoc = parent.getOwnerDocument();
    var node = SVGDoc.createElement(type);

    for ( var attr in attributes ) {
        node.setAttribute(attr, attributes[attr]);
    }

    if ( text != null ) {
        var text_node = SVGDoc.createTextNode(text);
        node.appendChild(text_node);
    }

    parent.appendChild(node);

    return node;
}
