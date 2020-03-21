precision mediump float;

varying vec2 vTextureCoord;
varying float vAlpha;

uniform sampler2D uTexture0;
uniform mat4 uColorMatrix;

void main( void )
{
	vec4 color = vAlpha * texture2D( uTexture0, vTextureCoord );
	gl_FragColor = uColorMatrix * color;
}
