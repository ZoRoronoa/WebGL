"use strict";
var gl;
var points = [];
var tmpPoints = [];
/*var A = -0.6;
var B = 0.5;
var C = 2;
var D = 0.3;*/
var A = -1.5;
var B = 1.5;
var C = 3.5;
var D = 0;
var E = A*A + B*B + C*C;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    /*
    var initPoint = [
        vec3(0, 0, 1),
        vec3(-1.0 * Math.sqrt(2) * 2 / 3, 0, -1.0/3),
        vec3(),
        vec3(),
    ]
    */
    var initPoint = [
        vec3(0, 0.0, -1.0),
        vec3(0.0, 0.9428, 0.3333),
        vec3(-0.8165, -0.4714, 0.3333),
        vec3(0.8165, -0.4714, 0.3333)
    ]
    //console.log(initPoint[1][1]);
    gasket3d(initPoint[0],initPoint[1],initPoint[2],initPoint[3], 5);
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    console.log(points.length);
    show();
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function mid(a, b){
    var x = (a[0] + b[0]) / 2.0;
    var y = (a[1] + b[1]) / 2.0;
    var z = (a[2] + b[2]) / 2.0;
    return [x, y, z];
}


//注意：需要考虑绘制顺序
function gasket3d(a, b, c, d, count){
    if (count == 0) {
        drawTetrahedron(a, b, c, d);
    }
    else{
        //console.log(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        count --; //console.log("insert one");
        gasket3d(a, mid(a, b), mid(a, c), mid(a, d), count);
        gasket3d(mid(a, b), b, mid(b, c), mid(b, d), count);
        gasket3d(mid(a, c), mid(b, c), c, mid(c, d), count);
        gasket3d(mid(a, d), mid(d, c), d, mid(b, d), count);    
    }
}

function drawTetrahedron(a, b, c, d){
    send(a, b, c);
    send(a, b, d);
    send(b, c, d);
    send(a, c, d);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function send(a, b, c,){
    //points.push(a, b, c);
    //points.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    var aa = turnToPlain(a);
    var bb = turnToPlain(b);
    var cc = turnToPlain(c);

    points.push(aa[0], aa[1], bb[0], bb[1], cc[0], cc[1] )
}

function show(){
    for(var i = 0; i < points.length; i+=3){
        console.log(points[i], points[i+1], points[i+2]);
    }
}

function turnToPlain(p){
    var x = p[0];
    var y = p[1];
    var z = p[2];
    var xx = ((B*B + C*C)*x - A*(B*y + C*z + D)) / (E); 
    var yy = ((A*A + C*C)*y - B*(A*x + C*z + D)) / (E);
    var zz = ((B*B + A*A)*z - C*(A*x + B*y + D)) / (E);
    return [xx, yy, zz];
}