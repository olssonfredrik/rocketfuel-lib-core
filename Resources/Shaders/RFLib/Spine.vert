attribute vec2 aVertexPosition;
attribute vec2 aTexturePosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform vec4 uTextureOffset0;

varying vec2 vTextureCoord;

void main( void )
{
	vTextureCoord = uTextureOffset0.xy + uTextureOffset0.zw * aTexturePosition;
	gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 0.0, 1.0 );
}
