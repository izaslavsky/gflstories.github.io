function thematic(box_index)
{
	if(whichbox==1) {
// this is dataset selection - need to update box 0 only
//	alert("updating vars  selected var ="+box_index);
	if(box_index != mapped_dataset) {
		window.status = m[117]+b+m[128]+m[119];
		xaction="0";
		currentlayer_num=box_index
		currentlayer_type = "att";
	  	xmessagenumber = 128;
//	  	xfile=att_XML[currentlayer_num];
//alert("in thematic, before loading")
  		load_layer()
  		mapped_dataset = box_index
  		var0index = null
//		load_att()
	}
	

	}
	if(whichbox==0) {
// this is variable selection - need to do thematic mapping
//		alert("mapping   selected var ="+box_index+"   "+mapped_var+"   "+var0index);	

//		nnumintervals = numint
//		nclassmethod = 1
		if(var0index != (box_index-1)) {

//alert("mapping: "+var0index)

			var0index = box_index -1
//			mapped_var = var0index
//alert("mapping 2: "+var0index)
			if(var0index != -1) {
				intervalassign(var0index,nnumintervals,nclassmethod)
			}else{
			
//			alert("removing legend")
			
				var0index = null;
				initialcolors();
				setleginvis();
				themmap()
			}
		}
	}
}

function update_varbox(zero_or_one) {
	
//	alert("in update_varbox   "+zero_or_one+"  "+vnm0[2])
	
  if(zero_or_one==0) 
  {
	var0index = null;
	xmessagenumber=53

	if(nvars0 > 0) {
		options0.length=0;
		options0[0]=". . . None . . .";
//	alert(vnm0.length)
		for (i=0;i<vnm0.length;i++) {
			options0[i+1]=vnm0[i];
		}
		
		SVGDoc.getElementById("selb2"+zero_or_one).firstChild.nodeValue = ". . . None . . ."
		
		
//		initbox(0,options0);
	}
  }
  frameadjust()
}

function intervalassign(var0index, nnumintervals, nclassmethod)
{
	var r = new Array(1);
	var operat = new Array('0','+','-','*','/');
	if ((var1index == null) || (operindex == 0)) 
	{
		varheader = vnm0[var0index]
	} 
	else 
	{
		varheader=vnm0[var0index]+b+operat[operindex]+b+vnm1[var1index]
	}
	for (var i=0; i<nbases; i++)
	{
		if ((var1index == null) || (operindex == 0)) 
		{
     		temp_array[i] = parseFloat(datamatrix0[var0index][i])
    }
    else
    {
		temp_array[i] = eval("parseFloat(datamatrix0[var0index][i])"+operat[operindex]+"parseFloat(datamatrix1[var1index][i])");
		if((operindex==4)&&(datamatrix1[var1index][i]=="0")) temp_array[i]=0
    }
    r[i] = temp_array[i]
  }
  numzeros = numsame = 0;
  var allval = new Array();
  for (i=0;i<nbases;i++)
  {
	if((r[i]==0) || isNaN(r[i]))
  	{
		numzeros++;
  		r[i]=Number.NaN
  	}
		else
		{
			allval[allval.length] = r[i]
		}
  }
  allval.sort(compareNumbers);
  for(i=0;i<allval.length-1;i++) 
  {
  	if(allval[i+1] == allval[i]) numsame++
  }
	nnumintervals2 = nbases-numzeros-numsame;
  realnumint = Math.min(nnumintervals, nnumintervals2);
	if (nnumintervals2 > 0) 
	{
		if (nnumintervals2 <= nnumintervals)
 		{
			intervalmarks[0] = allval[0];
			jj = 1;
			for(i=1;i<allval.length;i++)
			{
				if (allval[i] != allval[i-1])
				{
					intervalmarks[jj] = allval[i];
					jj++
				}
			}
 		}
 		else
 		{
  		if (nclassmethod == 0)
  		{
  	 		minvalue = allval[0];
  	 		intervalsize = (allval[allval.length-1] - minvalue)/nnumintervals;
     		for (i = 0; i < nnumintervals-1; i++)
     		{
     			intervalmarks[i] = minvalue + intervalsize;
     			minvalue = intervalmarks[i]
     		}
  		}
  		else
  		{
     		group_size = Math.round((nbases-numzeros) / realnumint);
     		if((realnumint-1)*group_size >= allval.length) realnumint--;
     		for (i = 0; i < realnumint-1; i++)  intervalmarks[i] = allval[(i+1)*group_size];
  		}
 		}
	}
	themleggg(numzeros,nnumintervals2,realnumint)
}
//***********************************************************************************************************************************************
function bwcolor(num, nn)
{
  var s = 12 - num*Math.round(10/nn);
  if (s == 10) 
  {
  	s = "a"
  }
  else
  {
  	if (s==11)
  	{
  		s="b"
  	}
  	else
  	{
  		if(s==12)
  		{
  			s="c"
  		}
  	}
  }
  return "#"+s+s+s+s+s+s
}
//***********************************************************************************************************************************************
function themleggg(numzeros,nnumintervals2,realnumint)       
{
  var ourcolors = new Array();
  if (var0index != null) 
  {
    if (viewtitlechange == 0) 
    {
    	var legtitlehei = 35
    } 
    else 
    {
    	var legtitlehei = 0
    }
    for (i = 0; i < realnumint; i++)  
    { 
    	if (!bw) 
    	{
    		ourcolors[i] = colorlist[i]
    	}
    	else
    	{
    		ourcolors[i] = bwcolor(i,realnumint)
    	}
    }

	areacolor(nnumintervals2,realnumint,ourcolors)
	add_legend(nnumintervals2,realnumint,ourcolors)
  }
}



//=============================================================================================
function setleginvis() {
	legall=SVGDoc.getElementById("legend")
	legall.getStyle().setProperty ('visibility', 'hidden')
}

//=============================================================================================
function add_legend(nnumintervals2,realnumint,ourcolors) {
 var ar_viewbox = new Array()
 fill="#000000"	
 legall = SVGDoc.getElementById("legend");
 leg_rect = SVGDoc.getElementById("leg_rect");

 leg_choro = SVGDoc.getElementById("leg_choro")
 if (leg_choro != null) leg_choro.getParentNode().removeChild(leg_choro)

 leg_choro=SVGDoc.createElement('g')
 leg_choro.setAttribute('id','leg_choro')
 legall.appendChild(leg_choro)
 
 mapheight = getInnerHeight()

 categ_width = 24
 categ_height = 13
 categ_between = 4

	 categ_text = SVGDoc.createTextNode(varheader);
	 categ_desk = SVGDoc.createElement("text");
	 categ_desk.setAttribute('x',categ_between+'')
	 categ_desk.setAttribute('y',fsize[1]+6)
	 categ_desk.appendChild(categ_text)
	 categ_desk.setAttribute('style',tstyle[1])
	 categ_desk.getStyle().setProperty("font-size",fsize[1]+2)
	 leg_choro.appendChild(categ_desk);
	 legendtitle_width = categ_desk.getComputedTextLength()


	cat_width = 0

	if(nnumintervals2 <= nnumintervals)
	
	{
	// assign exact values to the legend
		for (i=0;i<realnumint;i++) 
		{
			c_w = add_leg_cat(i,ourcolors[i],gground(intervalmarks[i]),categ_width,categ_height,categ_between);
			if(c_w > cat_width) cat_width=c_w
		}
	}
	else
	{
		c_w = add_leg_cat(0,ourcolors[0],m[9]+b+gground(intervalmarks[0]),categ_width,categ_height,categ_between)
		if(c_w > cat_width) cat_width=c_w
    	for (i = 1; i < realnumint -1; i++) {
    		c_w = add_leg_cat(i,ourcolors[i],m[10]+b+gground(intervalmarks[i-1])+b+b+m[11]+b+gground(intervalmarks[i]),categ_width,categ_height,categ_between)
			if(c_w > cat_width) cat_width=c_w
    	}
   		c_w = add_leg_cat(realnumint-1,ourcolors[realnumint-1],gground(intervalmarks[realnumint-2])+b+m[12],categ_width,categ_height,categ_between)
		if(c_w > cat_width) cat_width=c_w
   	}
	cats_height = (categ_height*3)+(realnumint-1)*(categ_between+categ_height)
    if (numzeros != 0) {
    	c_w=add_leg_cat(realnumint,"#ffffff",m[137]+b,categ_width,categ_height,categ_between)
		if(c_w > cat_width) cat_width=c_w
		cats_height = (categ_height*3)+realnumint*(categ_between+categ_height)
	}
    
// setting legend box width/height/location
//   alert("width= "+cat_width)
   new_width = Math.max(cat_width,legendtitle_width)
 leg_rect.setAttribute('width',new_width+20)
 leg_rect.setAttribute('height',cats_height+15)
 leg_rect.setAttribute('y',0)
 leg_rect.setAttribute('x',0)
    
	trans = legall.getAttribute("transform")
	if(!trans) legall.setAttribute("transform","translate("+(navigationWidth-50)+","+(mapheight-cats_height-15)+")")
	legall.getStyle().setProperty ('visibility', 'visible')
}


//=============================================================================================
function add_leg_cat(num,boxcolor,boxtext,categ_width,categ_height,categ_between)
{
 categ_box = SVGDoc.createElement("rect");
 categ_box.getStyle().setProperty('fill',boxcolor)
 categ_box.getStyle().setProperty('stroke','black')
 categ_box.setAttribute('x',5+(categ_between)+'')
 categ_box.setAttribute('y',(categ_height*2)+num*(categ_between+categ_height)+'')
 categ_box.setAttribute('width',categ_width+'')
 categ_box.setAttribute('height',categ_height+'')
 categ_box_style=categ_box.getStyle();
 
 categ_text = SVGDoc.createTextNode(boxtext);
 categ_desk = SVGDoc.createElement("text");
 categ_desk.setAttribute('x',5+categ_width+(2*categ_between)+'')
 categ_desk.setAttribute('y',(categ_height*3)+num*(categ_between+categ_height)+'')
 categ_desk.appendChild(categ_text)
 categ_style=categ_desk.getStyle();
 categ_style.setProperty("fill","black")
 categ_style.setProperty("font-size",fsize[0]+2)
 leg_choro.appendChild(categ_box);
 leg_choro.appendChild(categ_desk);
 cw = categ_desk.getComputedTextLength()
 return cw+categ_width+categ_between+categ_between
}

//=============================================================================================
function gground(number) {
  if (number > -1 && number < 1) return Math.round(number*Math.pow(10,4))/Math.pow(10,4);
  if ((number > -100 && number <= -1) || (number >= 1 && number < 100)) return Math.round(number*Math.pow(10,2))/Math.pow(10,2);
  if ((number > -10000 && number <= -100) || (number >= 100 && number < 10000)) return Math.round(number*Math.pow(10,0))/Math.pow(10,0);
  if (Math.abs(number) >10000) return ""+Math.round(number*Math.pow(10,-3))+"K";
}

//=============================================================================================
function areacolor(nnumintervals2,realnumint,ourcolors)
{
  for (i = 0; i < nbases; i++) {
    basecolor[i]="#ffffff";
    currentvalue = temp_array[i];
    if ((currentvalue != 0) & (!isNaN(currentvalue))) {
      if(nnumintervals2 <= nnumintervals)
      {
      	for (j=0;j<realnumint;j++)
				{
					if (currentvalue == intervalmarks[j]) basecolor[i] = ourcolors[j]
				}
      }
      else
      {
      	//assigning intervals
      	if (currentvalue < intervalmarks[0])
      	{
      		basecolor[i] = ourcolors[0]
      	}
      	else
      	{
			if (currentvalue > intervalmarks[realnumint-2])
         	{
         		basecolor[i] = ourcolors[realnumint-1]
         	}
         	else
         	{
         		for (j=0; j < realnumint-2; j++)
         		{
         			if (currentvalue >= intervalmarks[j] && currentvalue <= intervalmarks[j+1])
         			{
         				basecolor[i] = ourcolors[j+1]
         			}
         		}
         	}
      	}
     	}
    }
  }
  themmap()
}

//=============================================================================================
function themmap()       {
//alert(var0index)	  
  for (i = 0 ; i<nbases; i++)       {
	  var el = SVGDoc.getElementById('a'+i)
  	  var sty = el.getStyle()
	  sty.setProperty('fill',basecolor[i])

	if (var0index != null) {
//		el.setAttribute("val","   \r\n"+varheader+": "+gground(temp_array[i]))
		el.setAttribute("val","   "+varheader+": "+gground(temp_array[i]))
	}
	else
	{
		el.setAttribute("val","")
	}

	  
//	  var tip_doc = svgDoc.getElementById('a'+i+"_l")
//	  if(tip_doc != null) {
//	   var tip_span = tip_doc.getFirstChild().getNextSibling().getFirstChild()
//	   if (varheader != '') 
//	  	tip_span.setData(varheader+": "+gground(temp_array[i]))
//	   else
//	  	tip_span.setData('')
//	 }
  }
}
function compareNumbers(a, b) 
{
	return a - b
}



//=============================================================================================
//LEGEND MOVING AROUND
function LegMouseMove(evt) {
  if (legendrag) {
	legall = SVGDoc.getElementById("legend")
	leg_rect = SVGDoc.getElementById("leg_rect")
	x= evt.getClientX()
	y= evt.getClientY()
	l_width=Number(leg_rect.getAttribute("width"))
	l_height=Number(leg_rect.getAttribute("height"))
	newX = x-(l_width/2)
	newY = y-(l_height/2)
	legall.setAttribute("transform","translate("+newX+","+newY+")")
  }
}
function LegMouseDown(evt) {
	legendrag = true
	return true;
}
function LegMouseUp(evt) {legendrag = false}
function LegMouseOver(evt) {}
function LegMouseOut(evt) {}



