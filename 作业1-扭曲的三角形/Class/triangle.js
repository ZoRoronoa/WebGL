"use strict";

var gl;
//开始存的点
var points = [];
//变换过程中临时储存的点
var tmpPoints = [];
//三角形的顶点
var verPoints = [];
//默认角度
var q = Math.PI * 2 / 180 * (180);

//三角形的中心是：(0, 0);
var center = [0, 0];

//3 degreeS
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //
    //  Initialize our data for the Sierpinski Gasket

    verPoints.push(0, 0.7);
    var ind = 0;
    var plist;
    var cnt = 0;
    while(cnt <= 5564){
        var x = verPoints[ind];
        var y = verPoints[ind+1];
        plist = generate(x, y);
        basic(x, y, plist[0], plist[1], plist[2], plist[3]);
        ind+=2; cnt++;
        if(Math.abs(verPoints[verPoints.length-1]-plist[1]) >= 0.0001 && Math.abs(verPoints[verPoints.length-2] - plist[0]) >= 0.0001) verPoints.push(plist[0], plist[1]);
        verPoints.push(plist[2], plist[3]);     
    }
    //alert(points.length);
    show();
    console.log(document.getElementById("angleInput").value);
    //
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    pointsLoad();
    render();
};

//点存储到缓冲区
function pointsLoad(){
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(tmpPoints), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}
//绘制点（三角形）
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function generate(x, y){
    //console.log(x - Math.sqrt(3)/3, y -1, x + Math.sqrt(3)/3, y+1);
    var tmpX = x - 0.01*Math.sqrt(3)/3;
    var tmpY = y - 0.01;
    var tmpXX = x + 0.01*Math.sqrt(3)/3;
    var tmpYY = y - 0.01;
    return [tmpX, tmpY, tmpXX, tmpYY];
}

function show(){
    for(var i = 0; i < points.length; i += 2) console.log(points[i], points[i+1]);
}

function basic(x1, y1,x2, y2, x3, y3 ){
    points.push(x1, y1,x2, y2, x3, y3 );
    tmpPoints.push(x1, y1,x2, y2, x3, y3 );
}

function twist(){
    tmpPoints = [];
    var angle = document.getElementById("angleInput").value;
    console.log(angle);
    q = Math.PI * 2 / 180 * angle;
    var sinq = Math.sin(q);
    var cosq = Math.cos(q);
    for(var i = 0; i < points.length; i+=6){
        var x1 = points[i];
        var y1 = points[i+1];
        var x2 = points[i+2];
        var y2 = points[i+3];
        var x3 = points[i+4];
        var y3 = points[i+5];
        tmpPoints.push(x1*cosq - y1*sinq);
        tmpPoints.push(x1*sinq+y1*cosq);
        tmpPoints.push(x2*cosq - y2*sinq);
        tmpPoints.push(x2*sinq + y2*cosq);
        tmpPoints.push( x3*cosq - y3*sinq);
        tmpPoints.push(x3*sinq + y3*cosq);
    }
    pointsLoad();
    render();
}

function twistWithTessellation(x1, y1,x2, y2, x3, y3){
    var dis1 = Math.sqrt((x1 - center[0])*(x1 - center[0])+(y1 - center[1])*(y1 - center[1]));
    var dis2 = Math.sqrt((x2 - center[0])*(x2 - center[0])+(y2 - center[1])*(y2 - center[1]));
    var dis3 = Math.sqrt((x3 - center[0])*(x3 - center[0])+(y3 - center[1])*(y3 - center[1]));
    
    points.push(x1*Math.cos(dis1 * q) - y1*Math.sin(dis1 * q), x1*Math.sin(dis1 * q)+y1*Math.cos(dis1 * q), x2*Math.cos(dis2 * q) - y2*Math.sin(dis2 * q), x2*Math.sin(dis2 * q) + y2*Math.cos(dis2 * q), x3*Math.cos(dis3 * q) - y3*Math.sin(dis3 * q), x3*Math.sin(dis3 * q) + y3*Math.cos(dis3 * q)); 
}


function change(){
    tmpPoints = [];
    //console.log("Test Here!");
    var angle = document.getElementById("angleInput").value;
    console.log(angle);
    q = Math.PI * 2 / 180 * angle;
    for(var i = 0; i < points.length; i += 6){
        var x1 = points[i];
        var y1 = points[i+1];
        var x2 = points[i+2];
        var y2 = points[i+3];
        var x3 = points[i+4];
        var y3 = points[i+5];
        var dis1 = Math.sqrt((x1 - center[0])*(x1 - center[0])+(y1 - center[1])*(y1 - center[1]));
        var dis2 = Math.sqrt((x2 - center[0])*(x2 - center[0])+(y2 - center[1])*(y2 - center[1]));
        var dis3 = Math.sqrt((x3 - center[0])*(x3 - center[0])+(y3 - center[1])*(y3 - center[1]));
        tmpPoints.push(x1*Math.cos(dis1 * q) - y1*Math.sin(dis1 * q));
        tmpPoints.push(x1*Math.sin(dis1 * q)+y1*Math.cos(dis1 * q));
        tmpPoints.push(x2*Math.cos(dis2 * q) - y2*Math.sin(dis2 * q));
        tmpPoints.push(x2*Math.sin(dis2 * q) + y2*Math.cos(dis2 * q));
        tmpPoints.push(x3*Math.cos(dis3 * q) - y3*Math.sin(dis3 * q));
        tmpPoints.push(x3*Math.sin(dis3 * q) + y3*Math.cos(dis3 * q));
    }
    pointsLoad();
    render();
}