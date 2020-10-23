// 顶点着色器 
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '}\n';

// 片元着色器
var FSHADER_SOURCE =  
  'precision mediump float;\n' +
  'void main() { \n' +
  ' gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); \n' +
  '}\n';


var gl, n, canvas, u_MvpMatrix;

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
  
var RotationMatrix = new Matrix4();
RotationMatrix.setIdentity();

function main() {
  canvas = document.getElementById("webgl");

  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to init the shader");
    return;
  }

  // 顶点数
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage locations of u_MvpMatrix');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  

  canvas.addEventListener('mousedown', handleMouseDown, false);
  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('mousemove', handleMouseMove, false);

  tick();
}

function tick() {
  drawScene();
  requestAnimationFrame(tick);
}

function drawScene() {
  var mvpMatrix = new Matrix4();

  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 10);
  mvpMatrix.lookAt(3, 5, 5, 0, 0, 0, 0, 1, 0);
  // RotationMatrix用来控制地球方向和位置的转变（使用鼠标)
  mvpMatrix.multiply(RotationMatrix);
  // console.log(mvpMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  
  // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  // Mode 选择为 gl.LINES
  gl.drawElements(gl.LINES, n, gl.UNSIGNED_SHORT, 0);
}
  
function initVertexBuffers(gl) {   
  var radius = 2;

  //xz平面的夹角papha，和竖轴的夹角peta
  var alpha, peta;
  var idx = 0;
  var vertexPositionData = [];
  var indexData = [];
  //纬线和经线各划分为30份
  for(var i = 0; i < 30; i++){
      for(var j = 0; j < 30; j++){
        alpha = 12 * i* Math.PI / 180;
        peta = 12 * j* Math.PI / 180;
        // 计算出各点坐标
        vertexPositionData.push(radius * Math.cos(peta) * Math.cos(alpha));
        vertexPositionData.push(radius * Math.cos(peta) * Math.sin(alpha));
        vertexPositionData.push(radius * Math.sin(peta));

        //将索引顺序存入索引数组
        //每个顶点包括经线和纬线两个方向的延长线

        //经线方向
        //1. 情况1：一般情况，连接当前顶点和后一顶点

        if((idx - 29) % 30 != 0){
            indexData.push(idx);
            indexData.push(idx+1);
        }
        //2. 情况2：绕回到顶点，即和顶点连接
        else{
            indexData.push(idx);
            indexData.push(idx-29);
        }

        //危险方向
        //1. 情况1：一般情况，连接当前顶点和下一纬线顶点
        if(idx < 870){
            indexData.push(idx);
            indexData.push(idx+30);
        }
        //2. 情况2：绕回到顶点处理
        else{
            indexData.push(idx);
            indexData.push(idx-870);
        }
        idx++;
      }
  }

  //顶点位置缓冲区
  var vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
      console.log('Failed to create the buffer object of vertexColor');
      return -1;
    }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  
  //索引缓冲区
  var indexBuffer = gl.createBuffer();
  if(!indexBuffer) {
    console.log('Failed to create the buffer object of index');
    return -1;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  //数值绑定，使用'gl.ELEMENT_ARRAY_BUFFER'
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
  
  return indexData.length;
}
  
function handleMouseDown(e) {
  mouseDown = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function handleMouseUp(e) {
  mouseDown = false;
}

function handleMouseMove(e) {
  if (!mouseDown) return;
  var newMouseX = e.clientX;
  var newMouseY = e.clientY;
  var deltaX = newMouseX - lastMouseX;
  var deltaY = newMouseY - lastMouseY;
  var newRotationMatrix = new Matrix4();
  newRotationMatrix.setIdentity();
  newRotationMatrix.rotate(deltaX / 10, 0, 1, 0)
  newRotationMatrix.rotate(deltaY / 10, 1, 0, 0)
  //通过RotationMatrix来控制地球的位置和方向
  RotationMatrix = newRotationMatrix.multiply(RotationMatrix);
  lastMouseX = newMouseX;
  lastMouseY = newMouseY;
}
