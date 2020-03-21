precision mediump float;

attribute vec2 aVertexPosition;
attribute vec2 aTexturePosition;
attribute vec4 aTint;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

varying vec2 vTextureCoord;
varying vec4 vTint;

void main( void )
{
	vTint = vec4( aTint.rgb * aTint.a, aTint.a );
	vTextureCoord = aTexturePosition;
	gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 0.0, 1.0 );
}
