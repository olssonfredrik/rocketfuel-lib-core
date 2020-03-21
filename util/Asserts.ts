export class Asserts
{

	/**
	 *
	 */
	public static Assert( condition: boolean, message?: string ): asserts condition
	{
		if( !condition )
		{
			throw new Error( message );
		}
	}

	/**
	 *
	 */
	public static AssertDefined< T >( mightBeUndefined: T | undefined, message?: string ): T
	{
		Asserts.Assert( mightBeUndefined !== undefined, message );
		return mightBeUndefined;
	}

	/**
	 *
	 */
	public static AssertDefinedNotNull< T >( mightBeUndefinedOrNull: T | undefined, message?: string ): T
	{
		Asserts.Assert( mightBeUndefinedOrNull !== undefined && mightBeUndefinedOrNull !== null, message );
		return mightBeUndefinedOrNull;
	}

	/**
	 *
	 */
	public static AssertType< T >( toTypeCheck: T | undefined, type: string, message?: string ): T
	{
		Asserts.Assert( !!toTypeCheck && typeof toTypeCheck === type, message );
		return toTypeCheck;
	}
}
