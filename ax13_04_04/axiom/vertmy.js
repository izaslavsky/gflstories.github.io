/*
SVG + JavaScript implementation for vertical scrollbar

Copyright 2001 Adobe Systems. You may copy, modify, and distribute this file,
if you include this notice & do not charge for the distribution. This file is
provided "AS-IS" without warranties of any kind, including any implied warranties.

Author: Peter Sorotokin

Usage: your svg should start somewhat like this:

<svg height="1000" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
	a:scriptImplementation="Adobe">
  <script xlink:href="VertSB.js"/>
...

height attribute determines the size of the scrollable area in your SVG
There should be no viewBox attribute on top-level svg element. Script hooks up
all event handles automatically.

Modified by IZ, 2001: to control navigation group in Axiomap

*/ 

var sbLight = "rgb(200 200 200)"
var sbDark = "rgb(135 135 135)"
var sbShadow = "rgb(72 72 72)"
var sbWidth=0;

var sbYScale
var sbG, sbBg, sbTop, sbBottom, sbSlider, rn
var sbDrag = false
var sbLastY
var sbScrollY
var sbCover
var sbTimeout

function sbButtonSetSize( b, w, h )
{
	b.bg.setAttribute( "width", w )
	b.bg.setAttribute( "height", h )
	b.bl.setAttribute( "d", "M1.5 "+(h-1.5)+ "v-"+(h-3)+"h"+(w-3) )
	b.bd.setAttribute( "d", "M1.5 "+(h-0.5)+"h"+(w-2)+"v-"+(h-2) )
	b.bs.setAttribute( "d", "M0.5 "+(h+0.5)+"h"+w+"v-"+h )
}

function sbButtonMake( kind )
{
	var b = new Object()
	var t = document.createElement( "g" )
	b.g = t
	t.setAttribute( "fill", "none" )
	t.setAttribute( "stroke-linecap", "square" )
	t.setAttribute( "shape-rendering", "optimizeSpeed" )
	var r = document.createElement( "rect" )
	b.bg = r
	r.setAttribute( "fill", sbLight )
	t.appendChild( r )
	var p = document.createElement( "path" )
	b.bl = p
	p.setAttribute( "stroke", "white" )
	t.appendChild( p )
	p = document.createElement( "path" )
	b.bd = p
	p.setAttribute( "stroke", sbDark )
	t.appendChild( p )
	p = document.createElement( "path" )
	b.bs = p
	p.setAttribute( "stroke", sbShadow )
	t.appendChild( p )
	if( kind )
	{
		p = document.createElement( "path" )
		p.setAttribute( "fill", "black" )
		if( kind == '^' )
			p.setAttribute( "d", "M4.5 9.5l3-3l3 3z" )
		else if( kind == 'v' )
			p.setAttribute( "d", "M4.5 6.5l3 3l3-3z" )
		t.appendChild( p )
	}
	sbButtonSetSize( b, 15, 15 )
	return b
}

function sbNewRect( x, y, w, h, fill )
{
	var r = document.createElement( "rect" )
	r.setAttribute( "x", x )
	r.setAttribute( "y", y )
	r.setAttribute( "width", h )
	r.setAttribute( "height", w )
	r.setAttribute( "fill", fill )
	return r
}

function sbMake()
{
	sbG = document.createElement("g")
	sbG.setAttribute( "class", "sbNoPrint" )
	document.getElementById("navi_group").appendChild( sbG )

	var ss = document.createElement( "style" )
	ss.appendChild( document.createTextNode( "@media print{.sbNoPrint{display:none;}}" ) )
	ss.setAttribute( "type", "text/css" )
	sbG.appendChild( ss )

	if( document.getElementById("sbBgPatt") == null )
	{
		var p = document.createElement( "pattern" )
		p.setAttribute( "id", "sbBgPatt" )
		sbG.appendChild( p )
		p.setAttribute( "width", "2" )
		p.setAttribute( "height", "2" )
		p.setAttribute(	"patternUnits", "userSpaceOnUse" )
		p.setAttribute( "shape-rendering", "optimizeSpeed" )
		p.appendChild( sbNewRect( 0, 0, 2, 2, "white" ) )
		p.appendChild( sbNewRect( 0, 0, 1, 1, sbLight ) )
		p.appendChild( sbNewRect( 1, 1, 1, 1, sbLight ) )
	}

	sbBg = document.createElement("rect")
	sbBg.setAttribute("fill","url(#sbBgPatt)")
	sbBg.setAttribute("width","16")
	sbG.appendChild( sbBg )

	sbSlider = sbButtonMake()
	sbG.appendChild( sbSlider.g )

	sbTop = sbButtonMake("^")
	sbG.appendChild( sbTop.g )

	sbBottom = sbButtonMake("v")
	sbG.appendChild( sbBottom.g )
	sbG.setAttribute("transform","translate("+navigationWidth+",0)")
}

function sbSync()
{
//	var b = document.getElementById("rect")
	s=1;
	var h = getInnerHeight()
	var effH = h - 2*16 - 1
	var sh =currentNaviHeight

	sbBg.setAttribute( "height", h )
	sbTop.g.setAttribute( "transform", "translate(0, 0)" )
	sbBottom.g.setAttribute( "transform", "translate(0 " + (h-16) + ")" )
	sbYScale = effH/sh
	sbScrollY = -rn.getAttribute("y")
	var cy = -Math.round(rn.getAttribute("y")*sbYScale)
	ch = h*sbYScale

	if( sh < effH )
		sh = effH
	if( cy + ch > effH )
		cy = effH - ch
	if( cy < 0 )
		cy = 0
	if( sh == effH ) {
		sbG.setAttribute( "display", "none" ); sbWidth=0 }
	else {if( sbG.getAttribute( "display" ) != "" )
		sbG.removeAttribute( "display" );sbWidth=16 }
	sbSlider.g.setAttribute( "transform", "translate(0 "+(16+cy)+")" )
	sbButtonSetSize( sbSlider, 15, ch )
}

function sbSetScrollY( y )
{
	var h = getInnerHeight()
	var my = (h-2*16-1)/sbYScale - h
	if( y < 0 )
		y = 0
	else if( y > my )
		y = my
	sbScrollY = y
	rn.setAttribute("y",-sbScrollY)
	rn.setAttribute("transform", "translate(0,"+(-sbScrollY)+")")

	sbSlider.g.setAttribute( "transform", "translate(0 "+(sbScrollY)+")" )

//alert(getInnerHeight()+"   "+currentNaviHeight+"   "+sbScrollY)

	navirect = document.getElementById("navi_rect")
	navirect.setAttribute("height",getInnerHeight()+sbScrollY)
	
	helptxt = document.getElementById("help_txt")
	helptxt.setAttribute("y",getInnerHeight()+sbScrollY -40)


	
}

function sbStartDrag(evt)
{
	sbDrag = true
	sbLastY = evt.clientY
	sbScrollY = -rn.getAttribute("y")
}

function sbEndDrag(evt)
{
	sbDrag = false
}

function sbDoDrag(evt)
{
	if( !sbDrag )
		return
	var y = evt.clientY
	var ry = Math.round((y - sbLastY)/sbYScale)
	if( ry == 0 )
		return

	sbLastY += ry*sbYScale
	sbSetScrollY( sbScrollY + ry )
}

function sbUnitDown(evt)
{
	sbSetScrollY( -rn.getAttribute("y")+Math.round((evt?1:5)/sbYScale) )
	if( sbTimeout )
		clearTimeout( sbTimeout )
	sbTimeout = setTimeout( "sbUnitDown()", (evt?500:50) )
}

function sbUnitUp(evt)
{
	sbSetScrollY( -rn.getAttribute("y")-Math.round((evt?1:5)/sbYScale) )
	if( sbTimeout )
		clearTimeout( sbTimeout )
	sbTimeout = setTimeout( "sbUnitUp()", (evt?500:50) )
}

function sbScrollPage(evt)
{
	var y = evt.clientY
	var ty = rn.getAttribute("y")
	var sy = 16-Math.round(ty*sbYScale)
	var dy = getInnerHeight()
	if( y <= sy )
		dy = -dy
	sbSetScrollY( -ty+dy )
	sbSync()
}

function sbStopScroll()
{
	if( sbTimeout )
		clearTimeout( sbTimeout )
	sbTimeout = null
}

function sbInit()
{
	var re = document.rootElement
	rn = document.getElementById("navi")
	sbMake()
	sbSync()
	rn.addEventListener( "SVGScroll", sbSync, false )
	re.addEventListener( "SVGResize", sbSync, false )
	sbTop.g.addEventListener( "mousedown", sbUnitUp, false )
	sbBottom.g.addEventListener( "mousedown", sbUnitDown, false )
	sbSlider.g.addEventListener( "mousedown", sbStartDrag, false )
	re.addEventListener( "mouseup", sbStopScroll, false )
	sbBg.addEventListener( "click", sbScrollPage, false )
	re.addEventListener( "mousemove", sbDoDrag, false )
	re.addEventListener( "mouseup", sbEndDrag, false )
}
//currentNaviHeight = 600;