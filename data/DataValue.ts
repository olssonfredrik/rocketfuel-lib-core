import { Locale } from "../engine/Locale";
import { Asserts } from "../util";
import { DataCallback, IDataRead } from "./IDataRead";
import { IDataWrite } from "./IDataWrite";

export class DataValue implements IDataRead< number >, IDataWrite< number >
{
	public readonly IsMoney: boolean;
	private value: number;

	private readonly callbacks: Array< DataCallback< number > >;
	private readonly formatOptions?: Intl.NumberFormatOptions;
	private readonly divisor: number;
	private readonly format: DataValueFormat;

	/**
	 *
	 */
	public constructor( value: number, format: DataValueFormat, max: number = -1 )
	{
		this.format = format;
		this.value = value;
		this.divisor = max + 1;
		this.IsMoney = ( format === DataValueFormat.Money );
		this.callbacks = new Array< DataCallback< number > >();

		if( !this.IsMoney )
		{
			const fractions = ( format === DataValueFormat.Decimal ) ? 2 : 0;
			const style = ( format === DataValueFormat.Percent ) ? "percent" : "decimal";
			const digits = ( format === DataValueFormat.DoubleDigit ) ? 2 : undefined;
			this.formatOptions =
			{
				minimumFractionDigits: fractions,
				maximumFractionDigits: fractions,
				style: style,
				minimumIntegerDigits: digits,
			};
		}
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
		if( this.IsMoney )
		{
			return Locale.FormatCurrency( this.value );
		}
		if( this.format === DataValueFormat.Unformatted )
		{
			return "" + this.value;
		}
		return Locale.FormatNumber( this.value, this.formatOptions );
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
		Asserts.Assert( !this.IsMoney && this.divisor > 0, "Step() only allowed on values with a max limit set" );
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

export enum DataValueFormat
{
	Money = "money",
	Integer = "integer",
	Percent = "percent",
	Decimal = "decimal",
	DoubleDigit = "doubledigits",
	Unformatted = "unformatted",
}
