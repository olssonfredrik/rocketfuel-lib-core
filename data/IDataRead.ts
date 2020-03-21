export interface IDataRead< T >
{
	IsMoney: boolean;
	Get(): T;
	GetText(): string;
	OnChange( func: ( value: T ) => void ): void;
}

export type DataCallback< T > = ( value: T ) => void;
