import { Asserts } from "../util";
import { DataFormatter } from "./DataFormatter";
import { DataValueFormat } from "./DataValueFormat";
import { DataCallback, IDataRead } from "./IDataRead";
import { IDataWrite } from "./IDataWrite";

export class DataValue implements IDataRead< number >, IDataWrite< number >
{
	private value: number;

	private readonly callbacks: Array< DataCallback< number > >;
	private readonly divisor: number;
	private readonly formatter: DataFormatter;

	/**
	 *
	 */
	public constructor( value: number, format: DataValueFormat, max: number = -1 )
	{
		this.value = value;
		this.divisor = max + 1;
		this.formatter = new DataFormatter( format );
		this.callbacks = new Array< DataCallback< number > >();
	}

	/**
	 *
	 */
	public Get(): number
	{
		return this.value;
	}

	/**
	 *
	 */
	public GetText(): string
	{
		return this.formatter.FormatValue( this.value );
	}

	/**
	 *
	 */
	public GetFormatter(): DataFormatter
	{
		return this.formatter;
	}

	/**
	 *
	 */
	public Set( newValue: number )
	{
		if( this.value !== newValue )
		{
			this.value = newValue;
			this.callbacks.forEach( ( func ) => func( newValue ) );
		}
	}

	/**
	 *
	 */
	public Subtract( amount: IDataRead< number > ): boolean
	{
		if( this.value < amount.Get() )
		{
			return false;
		}
		this.Set( this.value - amount.Get() );
		return true;
	}

	/**
	 *
	 */
	public Add( amount: IDataRead< number > ): void
	{
		this.Set( this.value + amount.Get() );
	}

	/**
	 *
	 */
	public Step(): void
	{
		Asserts.Assert( !this.formatter.IsMoney() && this.divisor > 0, "Step() only allowed on values with a max limit set" );
		this.Set( ( this.value + 1 ) % this.divisor );
	}

	/**
	 *
	 */
	public OnChange( callback: DataCallback< number > ): void
	{
		this.callbacks.push( callback );
	}
}
