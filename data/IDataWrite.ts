import { IDataRead } from "./IDataRead";

export interface IDataWrite< T >
{
	Set( value: T ): void;

	Subtract( amount: IDataRead< T > ): boolean;

	Add( amount: IDataRead< T > ): void;

	Step(): void;
}
