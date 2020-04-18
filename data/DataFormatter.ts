import { Locale } from "../engine";
import { DataValueFormat } from "./DataValueFormat";

export class DataFormatter
{
	private format: DataValueFormat;
	private readonly formatOptions: Intl.NumberFormatOptions;

	public constructor( format: DataValueFormat )
	{
		this.format = format;

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

	/**
	 *
	 */
	public IsMoney(): boolean
	{
		return ( this.format === DataValueFormat.Money );
	}

	/**
	 *
	 */
	public FormatValue( value: number ): string
	{
		switch( this.format )
		{
			case DataValueFormat.Money:
				return Locale.FormatCurrency( value );

			case DataValueFormat.Unformatted:
				return "" + value;

			default:
				return Locale.FormatNumber( value, this.formatOptions );
		}
	}
}
