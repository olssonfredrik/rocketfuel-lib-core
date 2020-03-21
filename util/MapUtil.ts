import { Asserts } from "./Asserts";

export class MapUtil
{
	/**
	 *
	 */
	public static GetOrDefault< T >( map: Map< string, T > | undefined, key: string, defaultValue: T ): T
	{
		let result = defaultValue;
		if( map )
		{
			result = map.get( key ) ?? result;
		}
		return result;
	}

	/**
	 *
	 */
	public static AssertedGet< T >( map: Map< string, T >, key: string, message?: string ): T
	{
		return Asserts.AssertDefinedNotNull( map.get( key ), message );
	}
}
