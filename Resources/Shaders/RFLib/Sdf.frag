#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision mediump float;

uniform sampler2D uTexture0;

uniform vec4 uLayerColor[3];
uniform vec3 uBorder;
uniform vec3 uSmoothing;

uniform mat4 uColorMatrix;

varying vec2 vTextureCoord;

const float cos45 = 0.70710678118654752;

vec3 aasmoothstep( vec3 smoothing, vec3 threshold, float value )
{
	float fullDistance = clamp( (value - 0.5) * 2.0, -1.0, 0.999 );
#ifdef GL_OES_standard_derivatives
	vec3 width = (length( vec2( dFdx( value ), dFdy( value ) ) ) * cos45) * smoothing;
	return vec3( smoothstep(threshold.x - width.x, threshold.x + width.x, fullDistance),
				smoothstep(threshold.y - width.y, threshold.y + width.y, fullDistance),
				smoothstep(threshold.z - width.z, threshold.z + width.z, fullDistance) );
#else
	return vec3( step(threshold.x, fullDistance), step(threshold.y, fullDistance), step(threshold.z, fullDistance) );
#endif
}

void main( void )
{
	float dist = texture2D( uTexture0, vTextureCoord ).r;
	vec3 layerFactor = aasmoothstep( uSmoothing, uBorder, dist );

	vec4 color = uLayerColor[0];
	color = mix( uLayerColor[1], color, layerFactor.x );
	color = mix( uLayerColor[2], color, layerFactor.y );
	color = mix( vec4( 0.0 ), color, layerFactor.z );

	gl_FragColor = color * uColorMatrix;
}
