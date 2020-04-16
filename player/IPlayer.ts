export interface IPlayer
{
	/**
	 *
	 */
	Play( animation: string, loop: boolean ): Promise< boolean >;

	/**
	 *
	 */
	Stop(): void;

	/**
	 *
	 */
	HasAnimation( name: string ): boolean;
}
