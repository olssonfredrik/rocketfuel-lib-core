attribute vec2 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

void main( void )
{
	gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition, 0.0, 1.0 );
}
