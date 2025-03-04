/*****
*
*   initMap
*
*	called in svg onload event. Initializes the SVGDoc, calls messages_load, plugin instantiates, and passes on to loading the layers.xml file
*
*****/
function initMap(evt) {
	SVGDoc = evt.getTarget().getOwnerDocument();
	getURL(locsystem+"mess.xml", messfromXML)
//	speechplugininit();
//	speechinit();
}

/*****
*
*   messfromXML
*
*	called once messages file is read in. If the read is successful, parses the messages, and initiates the read of layers.xml
*
*****/
function messfromXML(s)
{
	if(! s.success) 
	{ 
		alert('Error loading the Messages file!') 
		return 
	} 
	var e = parseXML(s.content);
  	var listNodes = e.getElementsByTagName("m");
	for(i=0;i<listNodes.length;i++)	m[i]=listNodes.item(i).firstChild.nodeValue;
	getURL("layers.xml", initproject_readlayers)
//	getURL("layers.xml.gz", initproject_readlayers)
}


/*****
*
*   initproject_readlayers
*
*	called once the layers.xml is loaded by getURL method in initMap. Reads the layers.xml and initializes global variables and arrays.
*	At the end, calls initialcolors, initextent, and initiates loading first of the files (attributes)
*
*****/
function initproject_readlayers( s ) 
{ 
//  alert( s.content ) 
  if( ! s.success ) 
  { 
     alert( 'Error loading the Layers definition!' ) 
     return 
  } 
  var e = parseXML(s.content);
//  alert(printNode(e))
 // project:  alert(e.firstChild.nodeName)
  var globals = e.firstChild.firstChild
	inico = globals.getElementsByTagName("x")
	inicoorrx = parseInt(inico.item(0).firstChild.nodeValue)
	inicoorry = parseInt(inico.item(0).nextSibling.firstChild.nodeValue)
	xshift = parseInt(inico.item(1).firstChild.nodeValue)
	yshift = parseInt(inico.item(1).nextSibling.firstChild.nodeValue)
	exfactor = parseFloat(globals.getElementsByTagName("factor").item(0).firstChild.nodeValue)
	disp = globals.getElementsByTagName("disp").item(0)
	dispwidth = parseInt(disp.firstChild.firstChild.nodeValue)
	dispheight = parseInt(disp.firstChild.nextSibling.firstChild.nodeValue)
// SKIP displeft and disptop, then skip entire leg tag
	header = globals.getElementsByTagName("header").item(0)
	viewheader = header.firstChild.firstChild.nodeValue
	viewtitlechange = header.firstChild.nextSibling.firstChild.nodeValue
	comp = header.firstChild.nextSibling.nextSibling.firstChild
	if (comp) {complogo = comp.nodeValue} else {complogo=""}
// SKIP sliv_url
	annotext = globals.getElementsByTagName("annot").item(0).firstChild.nodeValue
	visib = globals.getElementsByTagName("visib").item(0)
	legvisible = visib.firstChild.firstChild.nodeValue
	annovisible = visib.firstChild.nextSibling.firstChild.nodeValue;
	labelvisible = visib.firstChild.nextSibling.nextSibling.firstChild.nodeValue;
	speechon = visib.firstChild.nextSibling.nextSibling.nextSibling.firstChild.nodeValue;
	opacityyes = parseFloat(visib.lastChild.firstChild.nodeValue);

	proj = globals.getElementsByTagName("proj").item(0)
	projection = proj.firstChild.firstChild.nodeValue;
	zonenum = proj.lastChild.firstChild.nodeValue;
	opts = globals.getElementsByTagName("opts").item(0)
	nnumintervals = parseInt(opts.firstChild.firstChild.nodeValue);
	nclassmethod = parseInt(opts.firstChild.nextSibling.firstChild.nodeValue);
	cols = globals.getElementsByTagName("colorlist").item(0).firstChild.nodeValue
	colorlist = cols.split(",");
	s_col = globals.getElementsByTagName("clrs").item(0).firstChild.nodeValue
	clrs = s_col.split(",");
	for (ij=0;ij<clrs.length;ij++) clrs[ij] = "#"+clrs[ij];


	var listlayers = e.firstChild.getElementsByTagName("l");
//	alert("length= "+listlayers.length);
//	alert(listlayers.item(6).getAttribute("lt"))


	for (i=0;i<listlayers.length;i++)       
	{
		switch (listlayers.item(i).getAttribute("lt"))       
		{
			case "base":
//			alert("base")
				baseXML = listlayers.item(i).firstChild.firstChild.nodeValue;
				nbases = listlayers.item(i).firstChild.nextSibling.firstChild.nodeValue;
				base_r = listlayers.item(i).firstChild.nextSibling.nextSibling.firstChild.nodeValue;				
//base_r = {outcolor,outwidth,iftransparent,initcolor,baseopacity}

				var r = new Array(); r=base_r.split(",");initcolor = r[3];

				var listsources = listlayers.item(i).getElementsByTagName("v");
				nsour = listsources.length;
				if (nsour > 0) 
				{
					for (j=0;j<nsour;j++)       
					{
						sourname[j] = listsources.item(j).firstChild.firstChild.nodeValue;
						att_XML[j] = listsources.item(j).firstChild.nextSibling.firstChild.nodeValue
					}
				}
        break;
			case "line":   
//			alert("line")
				lin_XML[nline] = listlayers.item(i).firstChild.firstChild.nodeValue; 
				llid = listlayers.item(i).firstChild.nextSibling.firstChild.nodeValue; 
				lin_names[nline] = listlayers.item(i).firstChild.nextSibling.nextSibling.firstChild.nodeValue; 
				lineseq[llid]=i;   
				lin_r[nline]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nline=nline+1; 
				break;
			case "region": 
//			alert("region")
				reg_XML[nregi] = listlayers.item(i).firstChild.firstChild.nodeValue; 
				llid = listlayers.item(i).firstChild.nextSibling.firstChild.nodeValue; 
				reg_names[nregi] = listlayers.item(i).firstChild.nextSibling.nextSibling.firstChild.nodeValue; 
				regionseq[llid]=i; 
				reg_r[nregi]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nregi=nregi+1; 
				break;
			case "point":  
//			alert("point")
				poi_XML[npoi]  = listlayers.item(i).firstChild.firstChild.nodeValue; 
				llid = listlayers.item(i).firstChild.nextSibling.firstChild.nodeValue; 
				poi_names[npoi] = listlayers.item(i).firstChild.nextSibling.nextSibling.firstChild.nodeValue; 
				pointseq[llid]=i;  
				poi_r[npoi] =listlayers.item(i).lastChild.firstChild.nodeValue; 
				npoi=npoi+1;   
				break;
			case "backr":  
//			alert("backr")
				br_XML[nbr]= listlayers.item(i).firstChild.firstChild.nodeValue; 
				br_r[nbr]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nbr=nbr+1; 
				break;
			case "forer":  
//			alert("forer")
				fr_XML[nfr]= listlayers.item(i).firstChild.firstChild.nodeValue; 
				fr_r[nfr]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nfr=nfr+1; 
				break;
			case "forep":  
//			alert("forep")
				fp_XML[nfp]= listlayers.item(i).firstChild.firstChild.nodeValue; 
				fp_r[nfp]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nfp=nfp+1; 
				break;
			case "forel":  
//			alert("forel")
				fl_XML[nfl]= listlayers.item(i).firstChild.firstChild.nodeValue; 
				fl_r[nfl]=listlayers.item(i).lastChild.firstChild.nodeValue; 
				nfl=nfl+1; 
				break
		}
	}
	laycount[1] = nregi;       
	laycount[2] = nline;       
	laycount[3] = npoi;
	for (i=0;i<4;i++)       
	{
		for (j=0;j<laycount[i];j++) layershow[i][j] = 1;
	}
// read in groups of layers
	var listgroups = e.firstChild.getElementsByTagName("g");
	for(i=0;i<listgroups.length;i++) {
		gt = listgroups.item(i).getAttribute("gt")
		grtype[i] = gt.substring(0,3)
		cat_names[i] = listgroups.item(i).getFirstChild().getFirstChild().getNodeValue()
		lay_names[i] = new Array();
		g=listgroups.item(i).getElementsByTagName("ids").item(0).getFirstChild().getNodeValue()+",0"
//		alert(g)
      		grset[i] = g.split(",");
      		grsize = grset[i].length-1;
      		for (j=0;j<grsize;j++)       
      		{
         		layerID = grset[i][j];
			if(gt=="line") lay_names[i][j] = lin_names[layerID]
			if(gt=="point") lay_names[i][j] = poi_names[layerID]
			if(gt=="region") lay_names[i][j] = reg_names[layerID]
//         		layersequential = eval(layertype+"seq")[layerID];
//         		lname[j] = listlayers(layersequential).firstChild.nextSibling.nextSibling.text;
//         		lid[j] = listlayers(layersequential).firstChild.nextSibling.text

      		}
	}
	
	
//  window.status = "";

// THEN REPLACE THE TITLE OF THE MAP
	SVGDoc.getElementById("map_title_text").firstChild.nodeValue = viewheader
	initialcolors();
	initextent();
	xaction="0";
	load_att()
}

/*****
*
*   initialcolors
*
*	called after layers.xml is read in. Sets initial basecolor and nullifies selection.
*
*****/
function initialcolors()
{
	for(i = 0; i < nbases; i++) 
	{
		basecolor[i] = initcolor; 
		curselected[i]=0
	} 
}

/*****
*
*   initialcolors
*
*	called after layers.xml is read in. Computes initial map extent for the karta tag, so that it fits available window, and 
*	also centers the map title.
*
*****/
function initextent() 
{
//	coordoriginx = 0;
//	coordoriginy = 0;
//	coordrazmerx = inicoorrx;
//	coordrazmery = inicoorry

	getScaleNow()

	translateX = (navigationWidth+sbWidth)/mapscale;
	translateY = -inicoorry-(titleHeight/mapscale);
	SVGDoc.getElementById("karta").setAttribute("transform","scale("+mapscale+","+(-mapscale)+") translate("+translateX+","+translateY+")")
	maptit = SVGDoc.getElementById("map_title_text")
	newstart = navigationWidth+sbWidth+(screenWidth-maptit.getComputedTextLength())/2
	maptit.setAttribute("x", newstart)
}

function load_att()
{
	if(nsour>0) 
	{
  	if(project_loading) currentlayer_num=0;
		currentlayer_type="att";
		xmessagenumber=128;
		load_layer()
	}
	else
	{
		continue_project()
	}
}
function getScaleNow() 
{
	screenWidth = getInnerWidth()-navigationWidth-sbWidth;
	screenHeight = getInnerHeight()-titleHeight;
	screenAspect = screenWidth/screenHeight;
	mapAspect = inicoorrx/inicoorry;
	if (screenAspect > mapAspect) 
	{
		mapscale = screenHeight/inicoorry
	}
	else
	{
		mapscale = screenWidth/inicoorrx
	}	
}

//******************************************************************************************************************************
function load_layer()
//***********************************************************************************************************************************************
{
	window.status = m[117]+b+m[xmessagenumber]+b+m[130]+m[119];
  if (currentlayer_type =="base")
  {
		xfile = baseXML
  }
  else
  {
		xfile = eval(currentlayer_type+"_XML")[currentlayer_num]
  }
  dp=xfile.lastIndexOf(".");
  if(dp > -1) 
  {
  	ie=xfile.substring(dp).toUpperCase();
  	if((ie==".GIF")||(ie==".PNG")||(ie==".JPG")) 
  	{
  		ximage="image";
  		render_layer();
  		return
  	}
  }
  getURL(xfile+".xml"+ext, render_layer)
}

//function render_layer() {
//alert("rendering...")
//}


//***********************************************************************************************************************************************
function render_layer(s)
//***********************************************************************************************************************************************
{
	var rendering_array = new Array()
	if((currentlayer_type!="br")||(ximage != "image")) 
	{
		if(!s.success) 
		{ 
			alert('Error loading data file.') 
			return 
		} 
//  	var listNodes = e.getElementsByTagName("m");

// finding where to insert the layer (i.e. pointer to the parentgroup) and setting up group style
		var e = parseXML(s.content);
	}
//  var root = xDoc.documentElement;
	if(currentlayer_type=="att") 
	{
		varsinit2(e);
		if(project_loading) 
		{
			xaction="1";
			varsinit2(e)
		}
	}
	else
	{
		if(currentlayer_type=="base") 
		{
			xrender = base_r
		} 
		else 
		{
			xrender = eval(currentlayer_type+"_r")[currentlayer_num]
		}
		rendering_array = xrender.split(",");

		if((currentlayer_type=="poi")||(currentlayer_type=="fp")) 
		{
			rend_type ="image";
			if(xaction=="layershow")
			{
				poidraw(e,rendering_array,rend_type)
			}
			if(xaction=="tableshow")
			{
				maketable2(e)
			}
			if(xaction=="identify_point")
			{
				identify2(e)
			}
		}
	  if((currentlayer_type=="reg")||(currentlayer_type=="fr")||(currentlayer_type=="br")) 
	  {
//			rend_type ="image";

//alert(xaction+"  "+currentlayer_type+"  "+currentlayer_num+"   "+e+"   "+rendering_array)
			if(xaction=="layershow")
			{
				regdraw(e,rendering_array)
			}
		}
	  if((currentlayer_type=="lin")||(currentlayer_type=="fl")) 
	  {
			if(xaction=="layershow")
			{
				lindraw(e,rendering_array)
			}
		}
	  if(currentlayer_type=="base") 
	  {
//			templabels = basedraw(e,rendering_array)
			basedraw(e,rendering_array)
	  }
  }
  if(project_loading) load_next();
  return false
}
//***********************************************************************************************************************************************
function varsinit2(e)
//***********************************************************************************************************************************************
{

  var listvars = e.getElementsByTagName("v");
  nvars = listvars.length;
  for (i=0;i<nvars;i++)       
  {
    if (xaction == "0") 
    {
			vnm0[i] = listvars.item(i).firstChild.firstChild.nodeValue
//			alert(vnm0[i])
    }
    else
    {
			vnm1[i] = listvars.item(i).firstChild.firstChild.nodeValue
    }
    dat = listvars.item(i).firstChild.nextSibling.firstChild.nodeValue;
    if (xaction == "0") 
    {
			datamatrix0[i] = dat.split(",")
//			alert(datamatrix0[i])
    }
    else
    {
			datamatrix1[i] = dat.split(",")
    }

  }
  if (xaction == "0") 
  {
		nvars0 = nvars;
  	vnm0.length=nvars0;
  	datamatrix0.length=nvars0;
		if(!project_loading) 	update_varbox(0)
  }
  else
  {
  	nvars1 = nvars;
  	vnm1.length=nvars1;
  	datamatrix1.length=nvars1;
		if(!project_loading) update_varbox(1)
  }
	window.status = ""
}

function continue_project() 
{
	leftframe_draw();
	mdraw()
}

function leftframe_draw() 
{
//insert left corner, and determine offset
//init_lt();
current_height = height_of_insert;
positionY[0]+=current_height
positionY[1]+=current_height

	if(nvars0 > 0) {
		options0.length=0;
		options0[0]=". . . None . . .";
//	alert(vnm0.length)
		for (i=0;i<vnm0.length;i++) {
			options0[i+1]=vnm0[i];
		}
		initbox("selboxes",0,options0,0);
		options1.length=0;
		options1=sourname;
		initbox("selboxes",1,options1,0);
	}
box_selboxes = SVGDoc.getElementById("selboxes").getBBox()
current_height = box_selboxes.y+box_selboxes.height
	
create_button("compose","compose","","navi_buttons","Click here to...",10,6+current_height,60,20) 
create_button("query","query","","navi_buttons","Click here to...",75,6+current_height,60,20) 
create_button("options","options","","navi_buttons","Click here to...",140,6+current_height,60,20) 

box_buttons = SVGDoc.getElementById("navi_buttons").getBBox()
current_height = box_buttons.y+box_buttons.height
yoffset = current_height 

	if(npoi+nline+nregi>0) {
//	alert("starting hier"+npoi+"  "+nline+"  "+nregi)
		inithier()	
	}

compose_y=query_y=options_y=yoffset+5
	init_compose()
	init_query()
	init_options()


// THEN COMPUTE THE WIDTH OF THE LEFT FRAME
	helptxt = SVGDoc.getElementById("help_txt")
	helptxt.setAttribute("x",10)
	helptxt.setAttribute("y",getInnerHeight()-40)
	sbInit();		// CALL INTO SCROLLBAR
	frameadjust();
	
}

function frameadjust() {
	boxw = 0
	for(i=0;i<4;i++){
		if(boxwidth[i] > boxw) boxw = boxwidth[i]
	}
	w1=Math.max(200,boxw+10)
	navigationWidth=Math.max(w1,maxWidth+10)
	initextent()
	navirect = SVGDoc.getElementById("navi_rect")
	navirect.setAttribute("width",navigationWidth+17)
	hierrect = SVGDoc.getElementById("hier_rect")
	hierrect.setAttribute("width",navigationWidth+17)

sbG.setAttribute("transform","translate("+(navigationWidth+17)+",0)")
}

//***********************************************************************************************************************************************
function load_next()
//***********************************************************************************************************************************************
{
	currentlayer_num++;
	switch(currentlayer_type) 
	{
		case "att":   
			continue_project();
			break;
		case "br": 
			if(currentlayer_num < nbr) 
			{
				load_layer()
			} 
			else 
			{
				load_base()
//			load_fr();
			}
			break;
		case "base":  
			load_fr();
			break;
		case "fr": 
			if(currentlayer_num < nfr) 
			{
				load_layer()
			} 
			else 
			{
				load_fl()
			}
			break;
		case "fl": 
			if(currentlayer_num < nfl) 
			{
				load_layer()
			} 
			else 
			{
				load_fp()
			}
			break;
		case "fp": 
			if(currentlayer_num < nfp) 
			{
				load_layer()
			}
			else
			{
				finish_right_2()
			}
			break;
	}
  return false
}

//***********************************************************************************************************************************************
function mdraw()
{
//  start_creating_right();
  xaction="layershow";
  load_br()
}

//***********************************************************************************************************************************************
// START LOADING INDIVIDUAL LAYERS AT PROJECT INIT: load_base, load_br, load_fr, load_fp, load_fl, load_att
//***********************************************************************************************************************************************
function load_base()
{
	currentlayer_type="base";
	xmessagenumber=127;
	load_layer()
}

//***********************************************************************************************************************************************
function load_br()
{
	currentlayer_type="br";
	xmessagenumber = 122;
	if(nbr > 0) 
	{
		currentlayer_num = 0;
		load_layer()
	}
	else
	{
		load_base()
//			load_fr();
	}
}

//***********************************************************************************************************************************************
function load_fr()
{
	currentlayer_type="fr";
	if(nfr > 0) 
	{
		currentlayer_num = 0;
		load_layer()
	}
	else
	{
		load_fl()
	}
}

//***********************************************************************************************************************************************
function load_fl()
{
	currentlayer_type="fl";
	if(nfl > 0) 
	{
		currentlayer_num = 0;
		load_layer()
	}
	else
	{
		load_fp()
	}
}

//***********************************************************************************************************************************************
function load_fp()
{
	currentlayer_type="fp";
	if(nfp > 0) 
	{
		currentlayer_num = 0;
		load_layer()
	}
	else
	{
		finish_right_2()
	}
}

function finish_right_2() 
{
	init_lt();
	project_loading = false;													//project loading is finished now
	karta = SVGDoc.getElementById("karta")
//	karta.setAttribute("onclick", "k_onclick(evt)")
	karta.setAttribute("onmouseout", "k_mouseout(evt)")
	karta.setAttribute("onmouseover", "k_mouseover(evt)")
//	during_zooming = false;
//	during_restore= false;
//	finish_creating_right();
//	seterrorhelp();
//	frameadjust();
//	parent.l.addmore();
}
//***********************************************************************************************************************************************
//******************************************************************************************************************************
// Now rendering individual layer types: poidraw,regdraw,lindraw,basedraw: all called from render_layer. Also disppol,formpath
//******************************************************************************************************************************
function poidraw(e,r, rend_type)
//******************************************************************************************************************************
{
	
	currentlayer_id = currentlayer_type+currentlayer_num
//	alert(currentlayer_id)
	newgroup = SVGDoc.createElement("g")
	newgroup.setAttribute("id",currentlayer_id)
	groupstyle = newgroup.getStyle()

	defs = SVGDoc.getElementsByTagName("defs").item(0);
//	psize = ((10+Number(r[1]))/mapscale)/currentscaling
	psize = 180*log2_1(1.1 +(1/currentscaling))*(1/mapscale/(15 - r[1]));

//	poisize = 180*log2_1(1.1 +(coordrazmerx/inicoorrx))*(inicoorrx/dispwidth/(15 - userpointsize));



    switch (r[0]) {
    	case "oval":
		var symb = SVGDoc.createElement("circle")
		symb.setAttribute("r", psize/2+"pt")
		symb.getStyle().setProperty("fill", r[2]);
		symb.getStyle().setProperty("stroke", r[3]);
//		symb.getStyle().setProperty("stroke-width", r[4]/mapscale+"pt");
		if(r[4]>0) {
			osize = 1*log2_1(1.1 +(1/currentscaling))*(r[4]/mapscale);
		}else{osize=0}
		symb.getStyle().setProperty("stroke-width", osize+"pt");
		break;
	case "rect":	
		var symb = SVGDoc.createElement("rect")
		symb.setAttribute("width", psize+"pt")
		symb.setAttribute("height", psize+"pt")
		symb.getStyle().setProperty("fill", r[2]);
		symb.getStyle().setProperty("stroke", r[3]);
		if(r[4]>0) {
			osize = 10*log2_1(1.1 +(1/currentscaling))*(1/mapscale/(6 - r[4]));
		}else{osize=0}
		symb.getStyle().setProperty("stroke-width", osize+"pt");
//		symb.setAttribute("r", rend_array[1])
//		symb.getStyle().setProperty("fill", rend_array[0]);
		break;
	case "userdefined":	
//		var symb = SVGDoc.createElement("rect")
//		symb.setAttribute("r", rend_array[1])
//		symb.getStyle().setProperty("fill", rend_array[0]);
		break;
	default:		
		var symb = SVGDoc.createElement("image")
		symb.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", locsystem+"icons/"+r[0])
		symb.setAttribute("width", psize+"pt")
		symb.setAttribute("height", psize+"pt")
		break;
	}
	symb.setAttribute("id","def"+currentlayer_id)
	defs.appendChild(symb)
 
	parent_ref = SVGDoc.getElementById(currentlayer_type)
 	parent_ref.appendChild(newgroup)							// append the new group
	newgroupref = SVGDoc.getElementById(currentlayer_id)	// get reference to this group

	var listNodes = new Array();
	var listNodes = e.getElementsByTagName("p");
	
//	if(r[1]) userpointsize = Number(trim(r[1]));
//	poisize = Math.round(180*log2_1(1.1 +(coordrazmerx/inicoorrx))*(inicoorrx/dispwidth/(15 - userpointsize)))

  for (i=0;i<listNodes.length; i++)       
  {
  		newuse = SVGDoc.createElement("use")
		newuse.setAttribute("title",listNodes.item(i).firstChild.firstChild.nodeValue)
		newuse.setAttribute("id",currentlayer_id+"_"+i)
		var poi_coor = listNodes.item(i).firstChild.nextSibling.firstChild.nodeValue;

		var poi_u = listNodes.item(i).firstChild.nextSibling.nextSibling.firstChild;
//		if (poi_u) {poi_URL = poi_u.nodeValue} else {poi_URL=''}
//		if(poi_URL != "") newuse.setAttribute("u",poi_URL)

		var poixy = new Array(1);
		poixy = poi_coor.split(",");
	
		newuse.setAttribute("x",poixy[0]-(psize/2))	// adjust location by radius, or half size of symbol
		newuse.setAttribute("y",poixy[1]-(psize/2))

// DO TIS EVENTUALLY		
//		newuse.setAttribute("width",poisize)	// adjust location by radius, or half size of symbol
//		newuse.setAttribute("height",poisize)
		
		newuse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#def"+currentlayer_id)

if(poi_u) {
	if(poi_u.nodeValue!='') {
		a=SVGDoc.createElement('a');
		a.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",poi_u.nodeValue);
		a.setAttribute("target","resource window")
		newgroupref.appendChild(a);
		a.appendChild(newuse)
	}
	else
	{
		newgroupref.appendChild(newuse)
	}
}
else
{
	newgroupref.appendChild(newuse)
}
}

	

//    layershow[3][currentlayer_num] = 2

  window.status = ""
}

//******************************************************************************************************************************
function lindraw(e,r)
//******************************************************************************************************************************
{
	parent_ref = SVGDoc.getElementById(currentlayer_type)
	currentlayer_id = currentlayer_type+currentlayer_num
//	alert(currentlayer_id)
	newgroup = SVGDoc.createElement("g")
	newgroup.setAttribute("id",currentlayer_id)
	groupstyle = newgroup.getStyle()
 	groupstyle.setProperty("fill","none")
 	groupstyle.setProperty("stroke",r[0])
 	
//	osize = 10*log2_1(1.1 +(1/currentscaling))*(1/mapscale/(10 - r[1]));
	osize = 1*log2_1(1.1 +(1/currentscaling))*(r[1]/mapscale);
 	groupstyle.setProperty("stroke-width",osize+"pt")
// 	groupstyle.setProperty("stroke-width",r[1]/mapscale+"pt")

 	parent_ref.appendChild(newgroup)							// append the new group
	newgroupref = SVGDoc.getElementById(currentlayer_id)	// get reference to this group


	var listNodes = e.getElementsByTagName("l");
	for (i=0;i<listNodes.length;i++) {
		newshape = SVGDoc.createElement("path");
		listcoords = listNodes.item(i).getElementsByTagName("c")
		newshape.setAttribute("d",formpath(listcoords,""))
		tit = listNodes.item(i).firstChild.firstChild
		if(tit) 
		{
			newshape.setAttribute("title",tit.nodeValue)
		}
		else
		{
			newshape.setAttribute("title","")
		}
		newgroupref.appendChild(newshape)
	}
//   	layershow[2][currentlayer_num] = 2
}
//******************************************************************************************************************************
function regdraw(e,r)
//******************************************************************************************************************************
{
	parent_ref = SVGDoc.getElementById(currentlayer_type)
	if(r[0]=='image')
	{
		ht = (r[4]-r[2])
		wi = (r[3]-r[1])
		newim = SVGDoc.createElement('image')
		newim.setAttribute("x",r[1])
		newim.setAttribute("y",r[2])
		newim.setAttribute("width",wi)
		newim.setAttribute("height",ht)
		newim.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",br_XML[currentlayer_num]);
		parent_ref.appendChild(newim)
		newim.setAttribute("transform","scale(1,-1) translate(0,"+(ht-(2*r[4]))+")")
	}
	else
	{

	currentlayer_id = currentlayer_type+currentlayer_num
//	alert(currentlayer_id)
	newgroup = SVGDoc.createElement("g")
	newgroup.setAttribute("id",currentlayer_id)
	groupstyle = newgroup.getStyle()
 	groupstyle.setProperty("fill",r[3])
 	groupstyle.setProperty("stroke",r[0])
  	osize = 1*log2_1(1.1 +(1/currentscaling))*(r[1]/mapscale);
 	groupstyle.setProperty("stroke-width",osize+"pt")
 	groupstyle.setProperty("opacity",r[4])

 	parent_ref.appendChild(newgroup)							// append the new group
	newgroupref = SVGDoc.getElementById(currentlayer_id)	// get reference to this group

	var listNodes = e.getElementsByTagName("l");
	for (i=0;i<listNodes.length;i++) {
		newshape = SVGDoc.createElement("path");
		listcoords = listNodes.item(i).getElementsByTagName("c")
		newshape.setAttribute("d",formpath(listcoords,"z"))

		tit = listNodes.item(i).firstChild.firstChild
		if (tit) {
			newshape.setAttribute("title",tit.nodeValue)
		}
		else
		{
			newshape.setAttribute("title",'')
		}
		newgroupref.appendChild(newshape)
	}
	
	}
//   	layershow[1][currentlayer_num] = 2
	window.status = ""
}
//******************************************************************************************************************************
function basedraw(e,r)
//******************************************************************************************************************************
{
	base_ref = SVGDoc.getElementById(currentlayer_type)
	groupstyle = base_ref.getStyle()
 	groupstyle.setProperty("fill",r[3])
 	groupstyle.setProperty("stroke",r[0])
	osize = 1*log2_1(1.1 +(1/currentscaling))*(r[1]/mapscale);
 	groupstyle.setProperty("stroke-width",osize+"pt")
 	groupstyle.setProperty("opacity",r[4])

	var listNodes = e.getElementsByTagName("r");
	for (i=0;i<listNodes.length;i++) {
		thisrec = listNodes.item(i)
		newshape = SVGDoc.createElement("path");
		listcoords = thisrec.getElementsByTagName("c")
		newshape.setAttribute("d",formpath(listcoords,"z"))
		newshape.setAttribute("id","a"+i)
		labelpos = thisrec.getElementsByTagName("labelpos").item(0).firstChild.nodeValue
		labx = parseFloat((labelpos.split(","))[0])* inicoorrx/100
		laby = inicoorry- (parseFloat((labelpos.split(","))[1])* inicoorry/100)
		newshape.setAttribute("lbl",Math.round(labx)+","+Math.round(laby))
		
		tit = thisrec.firstChild.firstChild
		newshape.setAttribute("val","")
		if (tit) {
			newshape.setAttribute("title",tit.nodeValue)
		}
		else
		{
			newshape.setAttribute("title",'')
		}
		u = thisrec.firstChild.nextSibling.firstChild
		if ((u)&&(u!='')) {
			a=SVGDoc.createElement('a');
			a.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",u.nodeValue);
			a.setAttribute("target","resource window");
			base_ref.appendChild(a);
			a.appendChild(newshape)
		}
		else
		{
			base_ref.appendChild(newshape)
		}
	}
}

//=============================================================================================
//THIS IS SVG Formpath function: called from render_layer
function formpath(listcoorgroups,z) {
	
//	alert(listcoorgroups.length)
	s1w=''	
  for (j=0;j<listcoorgroups.length;j++)       {
     tempar = listcoorgroups.item(j).firstChild.nodeValue
     locationblank = tempar.indexOf(" ")
     part1 = tempar.substring(0,locationblank)
     part2 = tempar.substring(locationblank+1)
     newtemp = "M"+part1+"L"+part2
     s1w += newtemp + z
  }
  return s1w
}

