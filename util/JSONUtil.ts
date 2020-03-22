import { Asserts } from "./Asserts";

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | IJSONObject | IJSONArray;
export interface IJSONObject { [member: string]: JSONValue; }
export interface IJSONArray extends Array< JSONValue > {}
export type JSONData = IJSONObject | IJSONArray;

export class JSONUtil
{

	/**
	 *
	 */
	public static AsType< T >( data: IJSONObject ): T
	{
		return ( data as unknown ) as T;
	}

	/**
	 *
	 */
	public static GetOrDefault< T >( data: IJSONObject | undefined, key: string, defaultValue: T ): T
	{
		if( !!data && !!data[ key ] )
		{
			return ( data[ key ] as unknown ) as T;
		}
		return defaultValue;
	}

	/**
	 *
	 */
	public static GetAssertedAsType< T >( data: IJSONObject, id: string ): T
	{
		const obj = JSONUtil.GetAssertedJSONObject( data, id );
		return JSONUtil.AsType< T >( obj );
	}

	/**
	 *
	 */
	public static GetAssertedJSONObject( data: IJSONObject, id: string ): IJSONObject
	{
		const output = data[ id ] as IJSONObject;
		Asserts.AssertNotNull( output, "Could not find JSONObject with id \"" + id + "\"" );
		return output;
	}

	/**
	 *
	 */
	public static GetAssertedJSONArray( data: IJSONObject, id: string ): IJSONArray
	{
		const output = data[ id ] as IJSONArray;
		Asserts.AssertNotNull( output, "Could not find JSONArray with id \"" + id + "\"" );
		return output;
	}

	/**
	 *
	 */
	public static GetAssertedString( data: IJSONObject, id: string ): string
	{
		const value = data[ id ] as string;
		Asserts.Assert( typeof value === "string", "Expected string but found \"" + value + "\" of type \"" + ( typeof value ) + "\"" );
		return value;
	}

	/**
	 *
	 */
	public static GetAssertedNumber( data: IJSONObject, id: string ): number
	{
		const value = data[ id ] as number;
		Asserts.Assert( typeof value === "number", "Expected number but found \"" + value + "\" of type \"" + ( typeof value ) + "\"" );
		return value;
	}

	/**
	 *
	 */
	public static GetAssertedBoolean( data: IJSONObject, id: string ): boolean
	{
		const value = data[ id ] as boolean;
		Asserts.Assert( typeof value === "boolean", "Expected boolean but found \"" + value + "\" of type \"" + ( typeof value ) + "\"" );
		return value;
	}
}
