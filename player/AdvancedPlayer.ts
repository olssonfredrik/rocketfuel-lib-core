import { Random } from "../util";
import { IPlayer } from "./IPlayer";

export class AdvancedPlayer implements IPlayer
{
	private player: IPlayer;
	private animations: Map< string, Array< string > >;

	/**
	 *
	 */
	public constructor( player: IPlayer, animations: Map< string, Array< string > > )
	{
		this.player = player;
		this.animations = animations;
	}

	/**
	 *
	 */
	public Play( animation: string, loop: boolean = false ): Promise< boolean >
	{
		const animationList = this.animations.get( animation );
		if( !!animationList )
		{
			const randomAnimation = Random.FromArray( animationList );
			if( loop )
			{
				return this.player.Play( randomAnimation, false ).then( ( stopped ) => stopped || this.Play( animation, true ) );
			}
		}
		return this.player.Play( animation, loop );
	}

	/**
	 *
	 */
	public Stop(): void
	{
		this.player.Stop();
	}

	/**
	 *
	 */
	public HasAnimation( name: string ): boolean
	{
		return ( this.animations.has( name ) || this.player.HasAnimation( name ) );
	}
}
