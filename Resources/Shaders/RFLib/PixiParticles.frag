precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vTint;

uniform sampler2D uTexture0;
uniform mat4 uColorMatrix;

void main( void )
{
	vec4 color = texture2D( uTexture0, vTextureCoord );
	vec4 tint = vec4( vTint.rgb * vTint.a, vTint.a );
	gl_FragColor = color * tint * uColorMatrix;
}
