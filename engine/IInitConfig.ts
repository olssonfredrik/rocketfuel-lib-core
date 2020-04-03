import { IPoint2DConfig } from "../math";

export interface IInitConfig
{
	readonly resource_server: string;
	readonly resource_file: string;
	readonly locale?: string;
	readonly currency?: ICurrencyConfig;
	readonly analytics_key?: string;
	Render: IRenderConfig;
}

export interface ICurrencyConfig
{
	readonly code: string;
	readonly use_symbol: boolean;
}

export interface IRenderConfig
{
	MaxSize: IPoint2DConfig;
	SafeZone: IPoint2DConfig;
	UseStencil?: boolean;
	UseDepth?: boolean;
}
