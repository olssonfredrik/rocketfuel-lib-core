import { Asserts } from "./Asserts";

export class MapUtil
{
	/**
	 *
	 */
	public static GetOrDefault< T >( map: Map< string, T > | undefined, key: string, defaultValue: T ): T
	{
		return map?.get( key ) ?? defaultValue;
	}

	/**
	 *
	 */
	public static AssertedGet< T >( map: Map< string, T >, key: string, message?: string ): T
	{
		const value = map.get( key );
		Asserts.AssertNotNull( value, message );
		return value;
	}
}
