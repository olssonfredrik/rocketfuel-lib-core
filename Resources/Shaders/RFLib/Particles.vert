precision highp float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoordinates;
attribute vec2 aSeed;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjMatrix;
uniform vec4 uTextureOffset0;

uniform float uTime;

uniform vec2 uLife;
uniform vec4 uShapeTypes;
uniform vec4 uShapes[4];
uniform vec2 uSizeAlpha[4];

const float DEGREE_TO_RAD = 6.28318530717958647692 / 360.0;

//vec2: minLife, maxLife
//stage
//	vec4: size(from, to), alpha(from, to)
//	veci2: relative: (0:no, >0:stage index), shape (0.0:box, 1.0:circle)
//	vec4: shapeData (box[x, y, width, height], circle[x, y, radius.usage, angle_start.range])


varying mediump vec2 vTextureCoord;
varying mediump float vAlpha;

vec2 seed;

float next()
{
	float val = fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453123 );
	seed.y += seed.x;
	return val;
}

float nextInRange( float range )
{
	float frac = fract( range );
	float max = range - frac;
	return max * frac + (1.0 - frac) * max * next();
}

vec2 inRect( vec4 box )
{
	return vec2( box.x + box.z * (next() - 0.5), box.y + box.w * (next() - 0.5) );
}

vec2 inCircle( vec4 circle )
{
	float distance = nextInRange( circle.z );
	float radians = nextInRange( circle.w ) * DEGREE_TO_RAD;
	return vec2( circle.x + distance * cos( radians ), circle.y + distance * sin( radians ) );
}

vec2 bezier( float t, vec2 p[4] )
{
	float ct = 1.0 - t;
	return ct*ct*ct*p[0] + 3.0*ct*ct*t*p[1] + 3.0*ct*t*t*p[2] + t*t*t*p[3];
}

float bezier( float t, vec4 p )
{
	float ct = 1.0 - t;
	return ct*ct*ct*p.x + 3.0*ct*ct*t*p.y + 3.0*ct*t*t*p.z + t*t*t*p.w;
}

void main( void )
{
	seed = aSeed;

	vec2 positions[4];
	positions[0] = inRect(uShapes[0]);// * (1.0 - shape.x) + inCircle(uShapes[0]) * shape.x;
	positions[1] = inRect(uShapes[1]);// * (1.0 - shape.y) + inCircle(uShapes[1]) * shape.y;
	positions[2] = inRect(uShapes[2]);// * (1.0 - shape.z) + inCircle(uShapes[2]) * shape.z;
	positions[3] = inRect(uShapes[3]);// * (1.0 - shape.w) + inCircle(uShapes[3]) * shape.w;

	float life = uLife.x + next() * (uLife.y - uLife.x);
	float t = fract( uTime / life );
	vec2 offset = bezier( t, positions );

	vec2 sizeAlpha = bezier( t, uSizeAlpha );

	vAlpha = clamp( sizeAlpha.y, 0.0, 1.0 );
	vTextureCoord = uTextureOffset0.xy + uTextureOffset0.zw * aTextureCoordinates;
	gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4( aVertexPosition * sizeAlpha.x + offset, 0.0, 1.0 );
}
