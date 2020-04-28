export interface IEasingValue
{
	readonly Value: number;
	readonly Dirty: boolean;

	/**
	 *
	 */
	Update( deltaTime: number ): void;
}
