function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	
	var trans1 = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);

	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);

	var rotatx = [
		1, 0, 0, 0,
		0, rotatXCos, -rotatXSin, 0,
		0, rotatXSin, rotatXCos, 0,
		0, 0, 0, 1
	]

	var rotaty = [
		rotatYCos, 0, -rotatYSin, 0,
		0, 1, 0, 0,
		rotatYSin, 0, rotatYCos, 0,
		0, 0, 0, 1
	]

	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);

	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

		this.colorLoc = gl.getUniformLocation(this.prog, 'color');

		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');


		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();

		this.numTriangles = 0;

		//TASK 2:
		this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');
        this.lightColorLoc = gl.getUniformLocation(this.prog, 'lightColor');
        this.ambientIntensityLoc = gl.getUniformLocation(this.prog, 'lightIntensity');
        this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');

        this.lightPos = [0, 0, 0];
        this.lightColor = [1, 1, 1];
        this.lightIntensity = 0.05;
        this.enableLighting = true;
		this.lightColor = [1.0, 1.0, 1.0]; // White light
        this.lightIntensity = 0.05;
		
		this.lightColorLoc = gl.getUniformLocation(this.prog, 'lightColor');
		this.lightIntensityLoc = gl.getUniformLocation(this.prog, 'lightIntensity');
		this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');


        this.normLoc = gl.getAttribLocation(this.prog, 'normal');
        this.normbuffer = gl.createBuffer();
	}

    setMesh(vertPos, texCoords, normalCoords) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);

        this.numTriangles = vertPos.length / 3;
    }

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvpLoc, false, trans);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.enableVertexAttribArray(this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

		//TASK 2:
		
		gl.uniform3fv(this.lightPosLoc, this.lightPos);
		gl.uniform3fv(this.lightColorLoc, this.lightColor);
		gl.uniform1f(this.ambientIntensityLoc, this.lightIntensity);

		gl.uniform1i(this.enableLightingLoc, this.enableLighting ? 1 : 0);
		gl.uniform3fv(this.lightColorLoc, this.lightColor);
		gl.uniform1f(this.lightIntensityLoc, this.lightIntensity);
		gl.uniform3fv(this.lightPosLoc, this.lightPos);

		///////////////////////////////


		updateLightPos();
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);


	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// You can set the texture image data using the following command.
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img);


		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} 
		else 
		{	
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}

		gl.useProgram(this.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		const sampler = gl.getUniformLocation(this.prog, 'tex');
		gl.uniform1i(sampler, 0);
	}

	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show);
	}

	enableLighting(enable) {
		this.enableLighting = enable;
	}
	
	
	setAmbientLight(intensity) {
		this.lightIntensity = intensity;
	}
	
}


function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function normalize(v, dst) {
	dst = dst || new Float32Array(3);
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		dst[0] = v[0] / length;
		dst[1] = v[1] / length;
		dst[2] = v[2] / length;
	}
	return dst;
}

// Vertex shader source code
const meshVS = `
			attribute vec3 pos; 
			attribute vec2 texCoord; 
			attribute vec3 normal;

			uniform mat4 mvp; 

			varying vec2 v_texCoord; 
			varying vec3 v_normal; 

			void main()
			{
				v_texCoord = texCoord;
				v_normal = normal;

				gl_Position = mvp * vec4(pos,1);
			}`;

// Fragment shader source code

//TASK2:
const meshFS = `
			precision highp float;

			uniform sampler2D tex;
			uniform vec3 color; 
			uniform vec3 lightPos;
			uniform vec3 lightColor;
			uniform float lightIntensity;
			uniform vec3 ambientColor;
			uniform float ambientIntensity;
			uniform mat4 modelViewMatrix; // To transform normals
			uniform mat4 normalMatrix; // Normal matrix for correct lighting calculations
			uniform bool enableLighting;

			varying vec2 v_texCoord;
			varying vec3 v_normal;

			void main() {
				vec4 texColor = texture2D(tex, v_texCoord);
				
				if (enableLighting) {
					vec3 norm = normalize((normalMatrix * vec4(v_normal, 0.0)).xyz);
					// You may need to adjust how you calculate the light direction
					vec3 fragPosition = (modelViewMatrix * vec4(gl_FragCoord.xyz, 1.0)).xyz;
					vec3 lightDir = normalize(lightPos - fragPosition);
					float diff = max(dot(norm, lightDir), 0.0);

					vec3 diffuse = lightColor * diff * lightIntensity;
					vec3 ambient = ambientColor * ambientIntensity;

					vec3 result = (ambient + diffuse) * texColor.rgb;
					gl_FragColor = vec4(result, texColor.a);
				} else {
					gl_FragColor = texColor;
				}
			}

			`;

// Light direction parameters for Task 2
var lightX = 1;
var lightY = 1;

const keys = {};
function updateLightPos() {
    const translationSpeed = 1;
    if (keys['ArrowUp']) meshDrawer.lightPos[1] -= translationSpeed;
    if (keys['ArrowDown']) meshDrawer.lightPos[1] += translationSpeed;
    if (keys['ArrowRight']) meshDrawer.lightPos[0] += translationSpeed;
    if (keys['ArrowLeft']) meshDrawer.lightPos[0] -= translationSpeed;
}




///////////////////////////////////////////////////////////////////////////////////