precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uTexture0;
uniform vec2 uSize;
uniform vec2 uOffset;

void main( void )
{
	vec2 offset = uOffset / uSize;
	vec3 scale = vec3(0.0, 1.407, 3.294);
	vec3 factor = vec3(0.2041, 0.3040, 0.0939);

	vec4 color = texture2D(uTexture0, vTextureCoord) * factor.x;
	color += texture2D(uTexture0, vTextureCoord + offset * scale.y) * factor.y;
	color += texture2D(uTexture0, vTextureCoord - offset * scale.y) * factor.y;
	color += texture2D(uTexture0, vTextureCoord + offset * scale.z) * factor.z;
	color += texture2D(uTexture0, vTextureCoord - offset * scale.z) * factor.z;

	gl_FragColor = color;
}
