import { IDataRead } from "../IDataRead";

export interface IDataView extends IDataRead< number >
{
	Update( deltaTime: number ): void;
	Restart(): void;
}
