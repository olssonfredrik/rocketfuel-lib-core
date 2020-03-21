export interface IPlayer
{
	/**
	 *
	 */
	Play( animation: string, loop: boolean ): Promise< void >;

	/**
	 *
	 */
	Stop(): void;

	/**
	 *
	 */
	HasAnimation( name: string ): boolean;
}
