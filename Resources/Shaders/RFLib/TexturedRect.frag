precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture0;
uniform mat4 uColorMatrix;

void main( void )
{
	gl_FragColor = texture2D( uTexture0, vTextureCoord ) * uColorMatrix;
}
