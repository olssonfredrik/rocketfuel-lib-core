import { Asserts, IJSONObject } from "../util";

export class EasingFunction
{
	/**
	 * https://easings.net/
	 */
	public static Create( config: IEasingFunctionConfig ): EasingFunction
	{
		const list = [
			{ Name: "EaseInSine", Func: ( x: number ) => 1 - Math.cos( ( x * Math.PI ) / 2 ) },
			{ Name: "EaseOutSine", Func: ( x: number ) => Math.sin( ( x * Math.PI ) / 2 ) },
			{ Name: "EaseInOutSine", Func: ( x: number ) => -( Math.cos( Math.PI * x ) - 1 ) / 2 },

			{ Name: "EaseInQuad", Func: ( x: number ) => x * x },
			{ Name: "EaseOutQuad", Func: ( x: number ) => 1 - ( 1 - x ) * ( 1 - x ) },
			{ Name: "EaseInOutQuad", Func: ( x: number ) => x < 0.5 ? 2 * x * x : 1 - Math.pow( -2 * x + 2, 2 ) / 2 },

			{ Name: "EaseInCubic", Func: ( x: number ) => x * x * x },
			{ Name: "EaseOutCubic", Func: ( x: number ) => 1 - ( 1 - x ) ** 3 },
			{ Name: "EaseInOutCubic", Func: ( x: number ) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow( -2 * x + 2, 3 ) / 2 },
		];

		const easing = list.find( ( item ) => item.Name === config.Name );
		Asserts.AssertNotNull( easing, "Unknown easing: " + config );

		return new EasingFunction( easing.Func );
	}

	private func: ( x: number ) => number;

	/**
	 *
	 */
	public constructor( func: ( x: number ) => number )
	{
		this.func = func;
	}

	/**
	 *
	 */
	public Ease( x: number ): number
	{
		if( x <= 0 )
		{
			return 0;
		}
		else if( x >= 1 )
		{
			return 1;
		}
		return this.func( x );
	}
}

export interface IEasingFunctionConfig
{
	Name: string;
	Data: Array< number >;
}
