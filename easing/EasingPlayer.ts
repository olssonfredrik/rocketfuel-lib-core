import { IJSONObject, JSONUtil } from "../util";
import { EasingAnimation, IEasingAnimationConfig } from "./EasingAnimation";
import { IEasingValue } from "./IEasingValue";

export class EasingPlayer implements IEasingValue
{
	/**
	 *
	 */
	public static Create( config: IEasingPlayerConfig ): EasingPlayer
	{
		const animationMap = new Map< string, EasingAnimation >();
		Object.keys( config.Animations ).forEach( ( key ) =>
		{
			const animConfig = JSONUtil.GetAssertedAsType< IEasingAnimationConfig >( config.Animations, key );
			animationMap.set( key, EasingAnimation.Create( animConfig ) );
		} );

		return new EasingPlayer( animationMap, config.StartValue );
	}

	public Value: number;
	public Dirty: boolean;

	private animations: Map< string, EasingAnimation >;
	private currentAnimation?: EasingAnimation;

	/**
	 *
	 */
	public constructor( animations: Map< string, EasingAnimation >, startValue: number = 0 )
	{
		this.animations = animations;
		this.currentAnimation = undefined;
		this.Value = startValue;
		this.Dirty = true;
	}

	/**
	 *
	 */
	public Update( deltaTime: number ): void
	{
		this.Dirty = false;
		if( !!this.currentAnimation )
		{
			const newValue = this.currentAnimation.Update( deltaTime );
			if( newValue !== this.Value )
			{
				this.Value = newValue;
				this.Dirty = true;
			}
		}
	}

	/**
	 *
	 */
	public Play( name: string ): void
	{
		this.Stop();
		this.currentAnimation = this.animations.get( name );
		if( !!this.currentAnimation )
		{
			this.currentAnimation.Play();
			this.Update( 0 );
			this.Dirty = true;
		}
	}

	/**
	 *
	 */
	public Stop(): void
	{
		if( !!this.currentAnimation )
		{
			this.Update( this.currentAnimation.Duration );
			this.currentAnimation = undefined;
		}
	}

	/**
	 *
	 */
	public HasAnimation( name: string ): boolean
	{
		return this.animations.has( name );
	}
}

export interface IEasingPlayerConfig
{
	StartValue: number;
	Animations: IJSONObject;
}
