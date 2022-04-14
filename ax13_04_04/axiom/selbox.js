function getBoxWidth(var_array,whichbox) 
{
	boxw = 0;
	for (i=0;i<var_array.length;i++)
	{
		node=SVGDoc.createElement("text");
		node.setAttribute("style","font-size:"+fsize[whichbox]+";"+tstyle[whichbox]);
		t=SVGDoc.createTextNode(var_array[i]);
		node.appendChild(t);
		thiswidth = node.getComputedTextLength();
		if(thiswidth>boxw) boxw=thiswidth;
	}
	if((boxw>170)||(whichbox == 4))
	{
		boxwidth[whichbox] = boxw+10
	}
	else
	{
		boxwidth[whichbox]=170
	}
}

function initbox(parent,whichbox,var_array,whichoption) 
{
	par = parent.substring(0,parent.indexOf("_"))
	menus[whichbox]=false;
	options=eval("options"+whichbox);
	getBoxWidth(var_array,whichbox)

	navi = SVGDoc.getElementById(parent);
	g=SVGDoc.createElement('g');
	g.setAttribute('id','selb0'+whichbox);
	navi.appendChild(g);

	build_node("rect",
		{
			x: positionX[whichbox], y:positionY[whichbox],
			width: boxwidth[whichbox], height: fsize[whichbox]+6,
			style: "stroke:black;fill:white"
		},g
	);

	build_node("text",
		{
			id: "selb2"+whichbox,
                	x: positionX[whichbox]+5, y: positionY[whichbox]+fsize[whichbox]+3,
                	style: "font-size:"+fsize[whichbox]+";"+tstyle[whichbox]
            	},g, var_array[whichoption]
        );

	build_node("rect",
		{
			x: positionX[whichbox]+boxwidth[whichbox], y:positionY[whichbox],
			width: 18, height: fsize[whichbox]+6,
			style: "stroke:black;fill:LightGray"
		},g
	);

	build_node("path",
		{
			d: "M"+(positionX[whichbox]+boxwidth[whichbox]+4)+" "+(positionY[whichbox]+5)+" "+(positionX[whichbox]+boxwidth[whichbox]+9)+" "+(positionY[whichbox]+13)+" "+(positionX[whichbox]+boxwidth[whichbox]+14)+" "+(positionY[whichbox]+5)+"z",
			style: "stroke:black;fill:black"
		},g
	);

	a=SVGDoc.createElement('a');
	a.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","");
	g.appendChild(a);

	build_node("rect",
		{
			id: "selb5"+whichbox,
			x: positionX[whichbox]+boxwidth[whichbox], y:positionY[whichbox],
			width: 18, height: fsize[whichbox]+6,
			style: "stroke:black;fill:LightGray;fill-opacity:0",
			onclick: "process_selectbox(evt)"
		},a
	);

	o= build_node("rect",
		{
			id: "selb6"+whichbox,
			x: positionX[whichbox], y:positionY[whichbox],
			width: boxwidth[whichbox], height: 0,
			style: "visibility:hidden;fill:white;stroke:black"
		},g
	);

	build_node("rect",
		{
			id: "selb7"+whichbox,
			x: positionX[whichbox], y:positionY[whichbox],
			width: boxwidth[whichbox], height: fsize[whichbox]+8,
			style: "visibility:hidden;fill:black;fill-opacity:0.3"
		},g
	);

	g=SVGDoc.createElement('g');
	g.setAttribute("id","selb9"+whichbox);
	navi.appendChild(g);

	build_node("rect",
		{
			id: "selb8"+whichbox,
			x: positionX[whichbox], y:positionY[whichbox],
			width: boxwidth[whichbox], height: fsize[whichbox]+8,
			style: "visibility:hidden;fill:"+bgcolor+";fill-opacity:0",
			onmousemove: "move_highlight('"+par+"',evt)",
			onclick: "select_from_box('"+par+"',evt)"
		},navi
	);
}


function process_selectbox(evt)
{
	var target = evt.getTarget();
  	id = target.getAttribute('id')+'';
  	len = id.length;
  	whichbox =id.substring(len-1,len);
	if (menus[whichbox]==false)
	{
		thisbox = whichbox;
		for(i=0;i<menus.length;i++) {
			whichbox = i;
			if((i!=thisbox)&&(menus[whichbox]==true)) {
				menus[whichbox]=false;
				close_selectbox(evt)
			}
		}
		whichbox=thisbox;
		menus[whichbox]=true;
		open_selectbox(evt);
	} 
	else 
	{
		menus[whichbox]=false;
		close_selectbox(evt);
	}
}


function open_selectbox(evt)
{
	number_options=eval("options"+whichbox).length;
	o=SVGDoc.getElementById("selb6"+whichbox);
	height_selectbox=(fsize[whichbox]+8)*number_options;
	o.setAttribute("height",height_selectbox);
	o.getStyle().setProperty("visibility","visible");
	o=SVGDoc.getElementById("selb8"+whichbox);
	o.setAttribute("height",height_selectbox);
	o.getStyle().setProperty("visibility","visible");
	if(whichbox != 4) boxwidth[whichbox]=160
	selbox_mirror=SVGDoc.getElementById("selb9"+whichbox);
	for (i=0;i<number_options;i++)
	{
		node=build_node("text",
			{
				id: whichbox+"smenu"+i.toString(10),
                		x: positionX[whichbox]+5, y: (positionY[whichbox]+13)+((fsize[whichbox]+8)*i),
	                	style: "font-size:"+fsize[whichbox]+";"+tstyle[whichbox]
            		},selbox_mirror, eval("options"+whichbox)[i]
        	);
		thiswidth = node.getComputedTextLength();
		if(thiswidth>boxwidth[whichbox]) boxwidth[whichbox]=thiswidth;
	}
	if(whichbox != 4) boxwidth[whichbox]=	boxwidth[whichbox]+10
	boxadjust()
	frameadjust()
}


function move_highlight(par,evt)
{
	if(par!='') {adjust=eval(par+"_y")}else{adjust=0}
	ym=evt.getClientY()-1-adjust;
	a=Math.floor((ym-positionY[whichbox])/(fsize[whichbox]+8));
	if (a>=0)
	{
		SVGDoc=evt.getTarget().getOwnerDocument();
		o=SVGDoc.getElementById("selb7"+whichbox);
		o.setAttribute("y",positionY[whichbox]+((fsize[whichbox]+8)*a));
		o.getStyle().setProperty("visibility","visible");
	}
}


function close_selectbox(evt)
{
	SVGDoc=evt.getTarget().getOwnerDocument();
	o=SVGDoc.getElementById("selb6"+whichbox);
	o.getStyle().setProperty("visibility","hidden");
	o=SVGDoc.getElementById("selb8"+whichbox);
	o.getStyle().setProperty("visibility","hidden");
	o=SVGDoc.getElementById("selb7"+whichbox);
	o.getStyle().setProperty("visibility","hidden");
	number_options=eval("options"+whichbox).length;
	for (i=0;i<number_options;i++)
	{
		o=SVGDoc.getElementById(whichbox+"smenu"+i.toString(10));
		contents = SVGDoc.getElementById ("selb9"+whichbox);
		contents.removeChild (o);
	}
}


function select_from_box(par,evt)
{
	if(par!='') {adjust=eval(par+"_y")}else{adjust=0}
	ym=evt.getClientY()-1-adjust;
	a=Math.floor((ym-positionY[whichbox])/(fsize[whichbox]+8));
	if (a>=0)
	{
		active_line[whichbox]=a;
		close_selectbox(evt);
		SVGDoc=evt.getTarget().getOwnerDocument();
		o=SVGDoc.getElementById("selb2"+whichbox);
		child=o.getFirstChild();
		child.setData(eval("options"+whichbox)[a]);
		thematic(a);
	}
	menus[whichbox]=false;
}

function boxadjust() {
	selb = SVGDoc.getElementById('selb0'+whichbox);
	selb.firstChild.setAttribute("width",boxwidth[whichbox])	//rect1
	rect2 = selb.firstChild.nextSibling.nextSibling
	rect2.setAttribute("x",positionX[whichbox]+boxwidth[whichbox])	//rect2
	path1 = rect2.nextSibling.setAttribute("d","M"+(positionX[whichbox]+boxwidth[whichbox]+4)+" "+(positionY[whichbox]+5)+" "+(positionX[whichbox]+boxwidth[whichbox]+9)+" "+(positionY[whichbox]+13)+" "+(positionX[whichbox]+boxwidth[whichbox]+14)+" "+(positionY[whichbox]+5)+"z")

	selb5 = SVGDoc.getElementById("selb5"+whichbox)
	selb5.setAttribute("x",positionX[whichbox]+boxwidth[whichbox])
	selb6 = SVGDoc.getElementById("selb6"+whichbox)
	selb6.setAttribute("width",boxwidth[whichbox]);
	selb7 = SVGDoc.getElementById("selb7"+whichbox)
	selb7.setAttribute("width",boxwidth[whichbox]);
	selb8 = SVGDoc.getElementById("selb8"+whichbox)
	selb8.setAttribute("width",boxwidth[whichbox]);
}