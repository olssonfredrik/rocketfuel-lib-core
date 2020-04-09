export class Asserts
{

	/**
	 * Throw an error if the condition is false.
	 */
	public static Assert( condition: boolean, message?: string ): asserts condition
	{
		if( !condition )
		{
			throw new Error( message );
		}
	}

	/**
	 * Throw an error if mightBeUndefined is undefined.
	 */
	public static AssertDefined< T >( mightBeUndefined: T | undefined, message?: string ): asserts mightBeUndefined is Exclude< T, null >
	{
		Asserts.Assert( mightBeUndefined !== undefined, message );
	}

	/**
	 * Throw an error if mightBeUndefinedOrNull is undefined or null.
	 */
	public static AssertNotNull< T >( mightBeUndefinedOrNull: T | undefined, message?: string ): asserts mightBeUndefinedOrNull is NonNullable< T >
	{
		Asserts.Assert( mightBeUndefinedOrNull !== undefined && mightBeUndefinedOrNull !== null, message );
	}

	/**
	 * Throw an error if the function is called.
	 */
	public static Fail(): never
	{
		throw new Error( "This function should not be called" );
	}
}
