export interface IStatelessParticleSystemData
{
	readonly Name: string;
	readonly MaxParticles: number;
	readonly Textures: Array< string >;
	readonly Shader: string;
	readonly Looping: boolean;

	// vec2(minimumLife, maximumLife) where life is in seconds
	readonly Life: Array< number >;

	// vec4, where 0.0 means box and 1.0 means circle
	readonly ShapeType: Array< number >;

	// vec4[4]
	readonly Shapes: Array< number >;

	// vec2[4] note: alpha will be clamped and larger/smaller numbers can be used to tweak the speed
	readonly SizeAlpha: Array< number >;
}
