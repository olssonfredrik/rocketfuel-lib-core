export interface IInitConfig
{
	readonly resource_server: string;
	readonly resource_file: string;
	readonly locale?: string;
	readonly currency?: ICurrencyConfig;
	readonly analytics_key?: string;
}

export interface ICurrencyConfig
{
	readonly code: string;
	readonly use_symbol: boolean;
}
