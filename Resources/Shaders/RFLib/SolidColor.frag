precision mediump float;

uniform mat4 uColorMatrix;

void main( void )
{
	gl_FragColor = vec4( 1.0 ) * uColorMatrix;
}
