import { EasingFunction, IEasingFunctionConfig } from "./EasingFunction";

export class EasingAnimation
{
	/**
	 *
	 */
	public static Create( config: IEasingAnimationConfig ): EasingAnimation
	{
		const func = EasingFunction.Create( config.Function );
		return new EasingAnimation( config.From, config.To, config.Duration, func );
	}

	public readonly From: number;
	public readonly To: number;
	public readonly Duration: number;
	private readonly easingFunction: EasingFunction;
	private time: number;

	/**
	 *
	 */
	public constructor( from: number, to: number, duration: number, easingFunction: EasingFunction )
	{
		this.From = from;
		this.To = to;
		this.Duration = duration;
		this.easingFunction = easingFunction;
		this.time = 0;
	}

	/**
	 *
	 */
	public Update( deltaTime: number ): number
	{
		this.time += deltaTime;
		const t = this.easingFunction.Ease( this.time / this.Duration );
		return this.From + t * ( this.To - this.From );
	}

	/**
	 *
	 */
	public Play(): void
	{
		this.time = 0;
	}
}

export interface IEasingAnimationConfig
{
	From: number;
	To: number;
	Duration: number;
	Function: IEasingFunctionConfig;
}
