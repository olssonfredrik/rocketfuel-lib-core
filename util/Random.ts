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

	/**
	 * Shuffle array in place
	 */
	public static ShuffleArray< T >( array: Array< T > ): Array< T >
	{
		let currentIndex = array.length;

		while( currentIndex > 0 )
		{
			const targetIndex = Math.floor( Math.random() * currentIndex );
			currentIndex--;

			const temp = array[currentIndex];
			array[currentIndex] = array[targetIndex];
			array[targetIndex] = temp;
		}

		return array;
	}
}
