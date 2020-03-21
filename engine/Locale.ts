import { ICurrencyConfig } from ".";

export class Locale
{

	/**
	 *
	 */
	public static FormatCurrency( money: number ): string
	{
		return money.toLocaleString( Locale.locale, Locale.currency );
	}

	/**
	 *
	 */
	public static FormatNumber( value: number, options?: Intl.NumberFormatOptions ): string
	{
		return value.toLocaleString( Locale.locale, options );
	}

	/**
	 *
	 */
	public static GetLocale(): string
	{
		return Locale.locale;
	}

	/**
	 *
	 */
	public static Init( locale?: string, currency?: ICurrencyConfig )
	{
		Locale.locale = locale ?? Intl.DateTimeFormat().resolvedOptions().locale;

		const display = ( currency?.use_symbol ) ? "symbol" : "code";
		const code = currency?.code;
		Locale.currency =
		{
			style: "currency",
			currency: code,
			currencyDisplay: display,
		};
	}

	private static locale: string = "";
	private static currency: Intl.NumberFormatOptions =
	{
		style: "currency",
		currencyDisplay: "symbol",
	};
}
