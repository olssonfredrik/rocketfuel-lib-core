export interface IPixiParticleSystemNodeData
{
	readonly Name: string;
	readonly Textures: Array< string >;
	readonly Shader: string;
	readonly Events: IPixiParticleEvents;
	readonly System: IPixiParticleSystemData;
}

export interface IPixiParticleEvents
{
	readonly Start?: string;
	readonly Stop?: string;
}

export interface IPixiParticleSystemData
{
	readonly alpha:
	{
		readonly start: number;
		readonly end: number;
	};
	readonly scale:
	{
		readonly start: number;
		readonly end: number;
		readonly minimumScaleMultiplier: number;
	};
	readonly color:
	{
		readonly start: string;
		readonly end: string;
	};
	readonly speed:
	{
		readonly start: number;
		readonly end: number;
		readonly minimumSpeedMultiplier: number;
	};
	readonly acceleration:
	{
		readonly x: number;
		readonly y: number;
	};
	readonly maxSpeed: number;
	readonly startRotation:
	{
		readonly min: number;
		readonly max: number;
	};
	readonly noRotation: boolean;
	readonly rotationSpeed:
	{
		readonly min: number;
		readonly max: number;
	};
	readonly lifetime:
	{
		readonly min: number;
		readonly max: number;
	};
	readonly blendMode: string;
	readonly frequency: number;
	readonly emitterLifetime: number;
	readonly maxParticles: number;
	readonly pos:
	{
		readonly x: number;
		readonly y: number;
	};
	readonly addAtBack: boolean;
	readonly spawnType: string;

	// a section for each possible spawn type
	readonly spawnRect:
	{
		readonly x: number;
		readonly y: number;
		readonly w: number;
		readonly h: number;
	};
}
