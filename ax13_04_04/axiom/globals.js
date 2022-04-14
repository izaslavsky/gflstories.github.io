var SVGDoc;
var colorlist = new Array();
var clrs = new Array();
var mapscale;
var oldmapscale;
//var screen_translation = new Array();
//var svgcoors = new Array();

var sourname=new Array(); 
var att_XML=new Array(); var base_r;
var lin_XML=new Array(); var lin_r = new Array(); var lin_names = new Array(); var lineseq = new Array(); 
var reg_XML=new Array(); var reg_r = new Array(); var reg_names = new Array(); var regionseq = new Array(); 
var poi_XML=new Array(); var poi_r = new Array(); var poi_names = new Array(); var pointseq = new Array(); 
var br_XML=new Array();  var br_r = new Array();
var fr_XML=new Array();  var fr_r = new Array();
var fp_XML=new Array();  var fp_r = new Array();
var fl_XML=new Array();  var fl_r = new Array();
var laycount = new Array();
var layershow=new Array();
layershow[0] = new Array();
layershow[1] = new Array();
layershow[2] = new Array();
layershow[3] = new Array();
var nbases=nline=nregi=npoi=nvars0=nvars1=nsour=nbr=nfl=nfp=nfr=0;

var grtype = new Array();
var grset = new Array();

// these are scale and translates for the initial map
//var r = document.rootElement 
//var old_scale=r.currentScale;
//var old_translate_x=r.currentTranslate.x;
//var old_translate_y=r.currentTranslate.y;
//var screenwidth = getInnerWidth();
//var screenheight = getInnerHeight();

var locsystem = "../axiom/"
var m = new Array();
var basecolor = new Array();
var curselected=new Array();

var inicoorrx;
var inicoorry;
	var navigationWidth=200;		// width of navigation menu
	var titleHeight = 40;			// height of title
var exfactor;
var xshift; var yshift;

// globals for selection boxes
//var active_line0=0;
//var active_line1=0;
var menus=new Array();
options0=new Array();
options1=new Array();
options2=new Array();
options3=new Array();
options4=new Array(". . . None . . .","Add","Subtract","Multiply","Divide");
bgcolor="pink";
//fsize0=11;
//fsize1=13;
var active_line = new Array(0,0,0,0,0)
var fsize = new Array(11,13,11,13,11)
var positionX = new Array(10,10,10,10,80)	// x-positions for all selection boxes
var positionY = new Array(30,10,100,80,30)	// y for all select boxes, in the absense of insert
//positionX0 = 10;
//positionY0 = 30;
//positionX1 = 10;
//positionY1 = 10;
whichbox=0;
var boxwidth = new Array(0,0,0,0,0);
var tstyle = new Array(
"text-anchor:left;font-family:Arial;fill:black",
"text-anchor:left;font-family:Arial;fill:blue;font-weight:bold",
"text-anchor:left;font-family:Arial;fill:black",
"text-anchor:left;font-family:Arial;fill:blue;font-weight:bold",
"text-anchor:left;font-family:Arial;fill:black")
//tstyle0="text-anchor:left;font-family:Arial;fill:black";
//tstyle1="text-anchor:left;font-family:Arial;fill:blue;font-weight:bold";

project_loading=true;
var xmessagenumber;
var xaction;
var currentlayer_num=0;
var currentlayer_type;

var b=" ";var d=".";
var nvars0,nvars1;
var vnm0 = new Array();
var vnm1 = new Array();
var datamatrix0 = new Array();
var datamatrix1 = new Array();

var picture;
var s; 
// content od dynamically loaded file
// globals for hiermenu
var xoffset = 10;		// x-offset for the list of layers
var yoffset = 75;		// y where the list of layers starts, in the absense of insert (45 is for no buttons)
var catFsize = 13;		// font of category
var layFsize = 11;		// font of layer
var catVertGap = 7;		// distance between categories
var layVertGap = 4;		// ditance between layers
var yCategory = new Array();
var yCatsize = new Array();
var cat_names = new Array();
var catStatus = new Array()
var maxWidth = 0

var lay_names = new Array();

// CURRENT POSITION AND ELEMENT: For getElementAndPosition(evt):
var nowElement
var nowX
var nowY

var mapped_dataset=0; 	//currently active dataset, initially set to 0
//var mapped_var=0;		// currently active var, initially set to 0

var nnumintervals;
var nclassmethod;
var operindex=4;			// the default operation is "divide"
var var0index=null;
var var1index = null;
var intervalmarks = new Array()
bw = false;
var temp_array = new Array();   


//LEGEND STUFF
var legendrag = false;					// whether legend is being dragged
var svgcoors = new Array()				// current coordinates in SVG coordinate system
var screen_translation = new Array()	// current screen translation
var scale								// ratio between svg coordinates and screen coordinates

var oldTran = "";						// Legend translate string
var oldX;								// legend 
var oldY;
var oldTranX;
var oldTranY;

var ximage=null;

var currentNaviHeight = 100;		// this is the initial height of the navigation frame, in the absense of everything
var location_status;
var object_status;
//var ext=".gz"
var ext=""


height_of_dialogs=0;
var compose_y=query_y=options_y=80;		// this is the initial y of the dialog boxes, in the absense of insert
var dialogs_h=new Array(160,100,50)		// these are heights of the dialog boxes, for offsets
compose_butt = query_butt = options_butt = false;

var currentscaling = previousscaling = 1

height_of_insert = 145;
var om_scale;