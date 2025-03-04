function toggleCategory(evt,num_categ) {
	categ="categ"+num_categ
	this_categ=num_categ
	newvar = this_categ+1
	this_container=SVGDoc.getElementById("cc"+this_categ)
	categ_obj = SVGDoc.getElementById(categ)
	triangle = categ_obj.getElementsByTagName("path").item(0)
	if(catStatus[this_categ]==false) 
	{
//handle this category, including individual layers 
		this_container.getStyle().setProperty("visibility","visible")	
		triangle.setAttribute("style","stroke:yellow;fill:white;opacity:0.5");
		triangle.setAttribute("d","M2 "+(catVertGap+3)+" 2 "+(catFsize+catVertGap-1)+" 10 "+(catVertGap+7)+"z")
//shift categories below
		for(var k=newvar;k<cat_names.length;k++)
		{
			yCategory[k]= yCategory[k]+yCatsize[this_categ]
			contain = SVGDoc.getElementById("categ"+k)
			contain.setAttribute("transform","translate("+xoffset+","+yCategory[k]+")")
		}
		hierheight = hierheight+yCatsize[this_categ]
		catStatus[this_categ]=true
	}
	else
	{
//handle this category, including individual layers 
		this_container.getStyle().setProperty("visibility","hidden")	
		triangle.setAttribute("style","stroke:yellow;fill:yellow");
		triangle.setAttribute("d","M0 "+(catVertGap+4)+" 5 "+(catFsize+catVertGap-1)+" 10 "+(catVertGap+4)+"z")
//shift categories below
		for(var k=newvar;k<cat_names.length;k++)
		{
			yCategory[k]= yCategory[k]-yCatsize[this_categ]
			contain = SVGDoc.getElementById("categ"+k)
			contain.setAttribute("transform","translate("+xoffset+","+yCategory[k]+")")
		}
		hierheight = hierheight-yCatsize[this_categ]
		catStatus[this_categ]=false
	}
	aa = cat_names.length
	hierrect = SVGDoc.getElementById("hier_rect")
	hierrect.setAttribute("height",hierheight)
	currentNaviHeight = hierheight + 100+height_of_dialogs
	sbSync()
}

function toggleLayer(evt)
{
	xaction="layershow"
	target=evt.getTarget().getParentNode()
	layer = target.getAttribute("id")
	currentlayer_type = layer.substring(0,3)
	unders=layer.indexOf("_")
	currentlayer_num = Number(layer.substring(3,unders))
	if(currentlayer_type=="poi") layertype = 3
	if(currentlayer_type=="lin") layertype = 2
	if(currentlayer_type=="reg") layertype = 1



	if (layershow[layertype][currentlayer_num]==2)
	{
		checkmark = SVGDoc.getElementById(currentlayer_type+currentlayer_num+"_chk")
		par = checkmark.getParentNode()
		par.removeChild(checkmark)
		layershow[layertype][currentlayer_num]=1
		undrawLayer(layertype,currentlayer_num)
	}
	else
	{
//create checkmark		
//checkmark path
		g_target=SVGDoc.getElementById(currentlayer_type+currentlayer_num+"_cmark")
		path1= build_node("path",
        		{
				id: currentlayer_type+currentlayer_num+"_chk",
				d: "M2 5 5 8 9 2",
				style: "stroke-width:3;stroke:black;fill:none"
			},g_target
		);
		layershow[layertype][currentlayer_num]=2
		drawLayer(layertype,currentlayer_num)
	}
}

function undrawLayer(layertype,currentlayer_num)
{
	layerID = currentlayer_type+currentlayer_num
	thislayer = SVGDoc.getElementById(layerID)
	thislayer.setAttribute("visibility", "hidden")
	
}
function drawLayer(layertype,currentlayer_num)
{
	layerID = currentlayer_type+currentlayer_num
	thislayer = SVGDoc.getElementById(layerID)
	if(!thislayer)
    	switch(layertype)       
    	{
		case 1: xmessagenumber=125;load_layer();break;
		case 2: xmessagenumber=124;load_layer();break;
		case 3: xmessagenumber=126;load_layer();break;
	}
	else
	{
		thislayer.setAttribute("visibility", "visible")
	}
}


function inithier() 
{
	for (i=0;i<cat_names.length;i++)
	{
		add_category(i)
		catStatus[i] = false;
	}
}

function add_category(num_category) 
{
// create category
	yCategory[num_category] = ((catFsize+catVertGap)*num_category)+yoffset
	navi = SVGDoc.getElementById("hier_menu");
	newcateg= build_node("g",
        	{
			id: "categ"+num_category,
			transform: "translate("+xoffset+","+yCategory[num_category]+")"
        	},navi
	);


	aa = cat_names.length
	if(num_category==(aa-1)) 
	{
		hierheight = yCategory[num_category]+(catFsize+catVertGap)+10
		hierrect = SVGDoc.getElementById("hier_rect")
		hierrect.setAttribute("height",hierheight)
		currentNaviHeight = hierheight + 100+height_of_dialogs
	}

// create text entry (category title)	
	triangle= build_node("path",
        	{
			d: "M0 "+(catVertGap+4)+" 5 "+(catFsize+catVertGap-1)+" 10 "+(catVertGap+4)+"z",
			style: "stroke:yellow;fill:yellow"
        	},newcateg
	);
        categText=build_node("text",
		{
                	x: 15, y: catFsize+catVertGap,
                	style: "text-anchor:left;font-size:"+catFsize+";font-family:Arial;fill:black;font-weight:bold"
		},newcateg, cat_names[num_category]
        );
	catWidth = categText.getComputedTextLength();
	if(catWidth > maxWidth) maxWidth = catWidth

	a=SVGDoc.createElement('a');
	a.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","");
	newcateg.appendChild(a);

// create covering rectangle, for toggling	
	r= build_node("rect",
        	{
			id: "categ"+num_category+"_r",
			x: 0, y: catVertGap+layVertGap,
			height: catFsize, width: catWidth,
			onclick: "toggleCategory(evt,"+num_category+")",
			style: "stroke:none;fill:white;fill-opacity:0"
		},a
	);

// add container for layers which are children of the category
	categ_container= build_node("g",
        	{
			id: "cc"+num_category,
			transform: "translate("+15+","+(catFsize+catVertGap+layVertGap)+")",
			style: "visibility:hidden"
        	},newcateg
	);

// add layers which are children of the category
	for (j=0;j<lay_names[num_category].length;j++)
	{
		add_layer(categ_container,num_category,j)
	}
	yCatsize[num_category] = (layFsize+layVertGap)*lay_names[num_category].length
}

function add_layer(container,num_cat,num_lay) 
{

	layerID=grset[num_cat][num_lay]
	lay_container= build_node("g",
        	{
			id: grtype[num_cat]+layerID+"_t",
			transform: "translate("+0+","+num_lay*(layFsize+layVertGap)+")"
        	},container
	);

// first rectangle
	rect1= build_node("rect",
		{
			x: 0, y:0, width: layFsize, height: layFsize,
			style: "stroke:black;fill:white"
		},lay_container
	);

//text
	lText=build_node("text",
		{
                	x: layFsize+layVertGap , y: 10,
                	style: "text-anchor:left;font-size:"+layFsize+";font-family:Arial;fill:black"
            	},lay_container, lay_names[num_cat][num_lay]
        );
	layWidth = lText.getComputedTextLength();
	if(layWidth > maxWidth) maxWidth = layWidth

//checkmark path container
	g=SVGDoc.createElement("g")
	g.setAttribute("id",grtype[num_cat]+layerID+"_cmark")
	lay_container.appendChild(g)

//rect2: something to click on
	rect2= build_node("rect",
        	{
            		x: 0, y:0, width: layFsize+layVertGap+layWidth, height: layFsize,
            		style: "stroke:none;fill:white;fill-opacity:0",
            		onclick: "toggleLayer(evt)"
        	},lay_container
    	);
}
