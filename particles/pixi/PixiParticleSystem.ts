import { Point2D, Transform } from "../../math";
import { Random } from "../../util";
import { IPixiInterpolatedNumber, IPixiParticleSystemData } from "./IPixiParticleSystemData";
import { Particle } from "./Particle";

export class PixiParticleSystem
{
	public readonly MaxParticles: number;
	public ParticleCount: number;
	public readonly IsAdditive: boolean;

	private readonly degreesToRadians: number = Math.PI / 180;
	private time: number = 0;
	private spawnTime: number = 0;
	private readonly spawnCost: number = 0;
	private readonly step: number = 0.016666;
	private readonly particles: Array< Particle >;
	private readonly data: IPixiParticleSystemData;
	private colorStart: Array< number > = new Array< number >( 4 );
	private colorEnd: Array< number > = new Array< number >( 4 );
	private enabled: boolean;
	private life: number = 0;
	private sizes: Array< Point2D >;
	private offsets: Array< Array< number > >;

	/**
	 * Creates an instance of PixiParticleSystem.
	 */
	public constructor( data: IPixiParticleSystemData, sizes: Array< Point2D >, textureOffsets: Array< Array< number > > )
	{
		this.MaxParticles = data.maxParticles;
		this.IsAdditive = ( data.blendMode === "add" );
		this.sizes = sizes;
		this.offsets = textureOffsets;
		this.particles = new Array( this.MaxParticles ).fill( 0 ).map( () => new Particle() );
		this.ParticleCount = 0;
		this.spawnCost = data.frequency;
		this.data = data;
		this.ParseColor( this.colorStart, data.color.start );
		this.colorStart[ 3 ] = this.GetInterpolatedData( data.alpha, 0 );
		this.ParseColor( this.colorEnd, data.color.end );
		this.colorEnd[ 3 ] = this.GetInterpolatedData( data.alpha, 1 );
		this.life = data.emitterLifetime;
		this.enabled = false;
	}

	public Play(): void
	{
		this.enabled = true;
		this.spawnTime = 0;
		this.life = this.data.emitterLifetime;
		this.particles.forEach( ( particle ) =>
		{
			particle.Life = 0;
		} );
	}

	public Stop(): void
	{
		this.enabled = false;
	}

	/**
	 *
	 */
	public GetData( data: Float32Array ): void
	{
		const pixiScale = 0.0125;
		let offset = 0;
		this.particles.forEach( ( particle ) =>
		{
			if( particle.Life > 0 )
			{
				const size = this.sizes[ particle.Id ];
				const sizeX = 0.5 * particle.Scale * size.X;
				const sizeY = 0.5 * particle.Scale * size.Y;
				const centerX = particle.Position.X * pixiScale;
				const centerY = particle.Position.Y * pixiScale;
				const cos = Math.cos( particle.Rotation );
				const sin = Math.sin( particle.Rotation );
				const cosX = sizeX * cos;
				const cosY = sizeY * cos;
				const sinX = sizeX * sin;
				const sinY = sizeY * sin;
				const uv = this.offsets[ particle.Id ];
				offset = this.SetVert( data, offset, centerX + -cosX - sinY, centerY + -sinX + cosY, uv[ 0 ], uv[ 1 ], particle );
				offset = this.SetVert( data, offset, centerX + cosX - sinY, centerY + sinX + cosY, uv[ 0 ] + uv[ 2 ], uv[ 1 ], particle );
				offset = this.SetVert( data, offset, centerX + cosX - -sinY, centerY + sinX + -cosY, uv[ 0 ] + uv[ 2 ], uv[ 1 ] + uv[ 3 ], particle );
				offset = this.SetVert( data, offset, centerX + -cosX - -sinY, centerY + -sinX + -cosY, uv[ 0 ], uv[ 1 ] + uv[ 3 ], particle );
			}
		} );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform ): void
	{
		if( !this.enabled && this.ParticleCount === 0 )
		{
			return;
		}

		this.time += deltaTime;
		while( this.time >= this.step )
		{
			this.UpdateStep();
			this.time -= this.step;
			if( this.life > 0 )
			{
				this.life -= this.step;
				this.enabled = ( this.life > 0 );
				// Todo: Send done Event if !this.enabled
			}
		}
	}

	/**
	 *
	 */
	private SetVert( data: Float32Array, offset: number, x: number, y: number, u: number, v: number, particle: Particle ): number
	{
		const color = particle.Color;
		data[ offset++ ] = x;
		data[ offset++ ] = y;
		data[ offset++ ] = u;
		data[ offset++ ] = v;
		data[ offset++ ] = color[ 0 ];
		data[ offset++ ] = color[ 1 ];
		data[ offset++ ] = color[ 2 ];
		data[ offset++ ] = color[ 3 ];
		return offset;
	}

	/**
	 *
	 */
	private UpdateStep(): void
	{
		const step = this.step;
		this.spawnTime += step;
		this.ParticleCount = 0;
		this.particles.forEach( ( particle ) =>
		{
			particle.Life -= step;
			if( particle.Life > 0 )
			{
				this.UpdateParticle( particle );
				this.ParticleCount++;
			}
			else if( this.spawnTime >= this.spawnCost && this.enabled )
			{
				this.SpawnParticle( particle );
				this.UpdateParticle( particle );
				this.ParticleCount++;
				this.spawnTime -= this.spawnCost;
			}
		} );
	}

	/**
	 *
	 */
	private SpawnParticle( particle: Particle )
	{
		const pixiScale = 0.0125;
		const life = Random.Range( this.data.lifetime.min, this.data.lifetime.max );
		particle.Life = life;
		particle.NormalizedLifeFactor = 1 / life;

		let x = this.data.pos.x;
		let y = -this.data.pos.y;
		if( this.data.spawnType === "rect" )
		{
			x += this.data.spawnRect.x + ( Math.random() - 0.5 ) * this.data.spawnRect.w;
			y += -this.data.spawnRect.y + ( Math.random() - 0.5 ) * this.data.spawnRect.h;
		}
		particle.Position.SetValues( x / pixiScale, y / pixiScale );
		// particle.Position.Add( this.data.spawnPosition )
		particle.ScaleFactor = Random.Range( this.data.scale.minimumScaleMultiplier, 1.0 );
		particle.SpeedFactor = Random.Range( this.data.speed.minimumSpeedMultiplier, 1.0 );
		particle.Id = Random.FromIndex( this.sizes );

		particle.RotationSpeed = Random.Range( this.data.rotationSpeed.min, this.data.rotationSpeed.max ) * this.degreesToRadians;
		particle.Rotation = ( 360 - Random.Range( this.data.startRotation.min, this.data.startRotation.max ) ) * this.degreesToRadians;
		const speed = particle.SpeedFactor * this.GetInterpolatedData( this.data.speed, 0 );
		particle.Velocity.SetValues( speed * Math.cos( particle.Rotation ), speed * Math.sin( particle.Rotation ) );

		// rotate velocity
		if( particle.NoRotation )
		{
			particle.Rotation = 0;
		}
	}

	/**
	 *
	 */
	private UpdateParticle( particle: Particle )
	{
		const data = this.data;
		const lerp = 1.0 - particle.Life * particle.NormalizedLifeFactor;

		particle.Scale = this.GetInterpolatedData( data.scale, lerp ) * particle.ScaleFactor;
		this.LerpArray( particle.Color, this.colorStart, this.colorEnd, lerp );
		if( !!data.alpha.list )
		{
			particle.Color[ 3 ] = this.GetInterpolatedData( data.alpha, lerp );
		}

		if( data.speed.start !== data.speed.end || !!data.speed.list )
		{
			const speed = this.GetInterpolatedData( data.speed, lerp ) * particle.SpeedFactor;
			particle.Velocity.Normalize();
			particle.Velocity.Scale( speed );
		}
		else if( data.acceleration.x !== 0 || data.acceleration.y !== 0 )
		{
			particle.Velocity.X += data.acceleration.x * this.step;
			particle.Velocity.Y -= data.acceleration.y * this.step;
			if( data.maxSpeed > 0 )
			{
				const speed = particle.Velocity.Length();
				if( speed > data.maxSpeed )
				{
					particle.Velocity.Scale( data.maxSpeed / speed );
				}
			}
		}
		particle.Position.Add( particle.Velocity );

		if( particle.RotationSpeed !== 0 )
		{
			particle.Rotation -= particle.RotationSpeed * this.step;
		}
		else if( ( data.acceleration.x !== 0 || data.acceleration.y !== 0 ) && !particle.NoRotation )
		{
			particle.Rotation = Math.atan2( particle.Velocity.Y, particle.Velocity.X );
		}

	}

	/**
	 *
	 */
	private GetInterpolatedData( data: IPixiInterpolatedNumber, factor: number ): number
	{
		if( !!data.list )
		{
			if( factor <= 0 )
			{
				return data.list[ 0 ].value;
			}
			if( factor >= 1 )
			{
				return data.list[ data.list.length - 1 ].value;
			}
			for( let i = 1; i < data.list.length; i++ )
			{
				if( data.list[ i ].time >= factor )
				{
					const fromItem = data.list[ i - 1 ];
					const toItem = data.list[ i ];
					return this.Lerp( fromItem.value, toItem.value, ( factor - fromItem.time ) / ( toItem.time - fromItem.time ) );
				}
			}
		}

		const from = data.start ?? 0;
		const to = data.end ?? 0;
		return this.Lerp( from, to, factor );
	}

	/**
	 *
	 */
	private Lerp( from: number, to: number, factor: number ): number
	{
		return from + factor * ( to - from );
	}

	/**
	 *
	 */
	private LerpArray( output: Array< number >, from: Array< number >, to: Array< number >, factor: number ): void
	{
		for( let i = 0; i < output.length; i++ )
		{
			output[ i ] = from[ i ] + factor * ( to[ i ] - from[ i ] );
		}
	}

	/**
	 *
	 */
	private ParseColor( output: Array< number >, color: string )
	{
		const full = parseInt( color.substr( 1 ), 16 );
		output[ 0 ] = ( ( full & 0xff0000 ) >> 16 ) / 255;
		output[ 1 ] = ( ( full & 0xff00 ) >> 8 ) / 255;
		output[ 2 ] = ( full & 0xff ) / 255;
		output[ 3 ] = 1.0;
	}

}
