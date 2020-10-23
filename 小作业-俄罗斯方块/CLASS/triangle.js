/*
画一个三维的球面，在JS中从经纬度计算出三维坐标形成坐标顶点缓冲区，同时构造将顶点连成三角的索引缓冲区，将两个缓冲区数据传给GPU，用drawElements进行绘制。
 */
var gl;
var points;
var thetaLoc;
var theta = 0.0;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    var vertices = new Float32Array([0, 1, 1, 0, -1, 0, 0, -1]);

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    /*

    */ 
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
     
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    thetaLoc = gl.getUniformLocation(program, "theta");
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    setTimeout(
        function(){
            requestAnimFrame(render);
            gl.clear( gl.COLOR_BUFFER_BIT );
            theta += 0.1;
            gl.uniform1f(thetaLoc, theta);
            gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);
        }, 100
    );
}
