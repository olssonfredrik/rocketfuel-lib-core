export class Random
{
	/**
	 * Get a random index from an array
	 */
	public static FromIndex( array: { length: number } ): number
	{
		return Math.floor( Math.random() * array.length );
	}

	/**
	 * Get a random item from an array
	 */
	public static FromArray< T >( array: Array< T > ): T
	{
		return array[ Random.FromIndex( array ) ];
	}

	/**
	 * Get a random boolean
	 */
	public static GetBoolean(): boolean
	{
		return ( Math.random() >= 0.5 );
	}

	/**
	 *
	 */
	public static Range( from: number, to: number ): number
	{
		return from + Math.random() * ( to - from );
	}

	/**
	 *
	 */
	public static IntRange( from: number, to: number ): number
	{
		return Math.round( from + Math.random() * ( to - from ) );
	}
}
