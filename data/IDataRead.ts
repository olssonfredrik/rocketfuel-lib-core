import { DataFormatter } from "./DataFormatter";

export interface IDataRead< T >
{
	Get(): T;
	GetText(): string;
	GetFormatter(): DataFormatter;
	OnChange( func: ( value: T ) => void ): void;
}

export type DataCallback< T > = ( value: T ) => void;
