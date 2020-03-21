export class Logging
{
	/**
	 *
	 */
	public static Log( message: string, ...optionalParams: Array< unknown > ): void
	{
		console.log( message, optionalParams );
	}

	/**
	 *
	 */
	public static Error( message?: string ): void
	{
		throw new Error( message );
	}
}
