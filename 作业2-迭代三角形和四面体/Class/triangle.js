"use strict";
var gl;
var points = [];
var tmpPoints = [];
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gasket2d([0, 0.7, 0], [-0.35 * Math.sqrt(3), -0.35, 0], [0.35 * Math.sqrt(3), -0.35, 0], 5);
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
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

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

function mid(a, b){
    var x = (a[0] + b[0]) / 2;
    var y = (a[1] + b[1]) / 2;
    var z = (a[2] + b[2]) / 2;
    return [x, y, z];
}


//注意：需要考虑大小三角形的绘制顺序
function gasket2d(a, b, c, count){
    if (count == 0) {
        drawTriangle(a, b, c, 5);
    }
    else{
        console.log(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        count --; //console.log("insert one");
        gasket2d(a, mid(a, b), mid(a, c), count);
        gasket2d(mid(a, b), b, mid(b, c), count);
        gasket2d(mid(a, c), mid(b, c), c, count);    
    }
}

function drawTriangle(a, b, c){
    points.push(a[0], a[1], b[0], b[1], c[0], c[1]);
    //gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.TRIANGLES, 0, points.length );
}