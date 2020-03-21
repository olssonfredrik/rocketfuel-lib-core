attribute vec4 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;

varying vec2 vTextureCoord;

void main( void )
{
    vTextureCoord = aVertexPosition.zw;
    gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition.xy, 0.0, 1.0 );
}
