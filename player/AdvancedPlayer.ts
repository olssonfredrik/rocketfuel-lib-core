import { Random } from "../util";
import { IPlayer } from "./IPlayer";

export class AdvancedPlayer implements IPlayer
{
	private player: IPlayer;
	private animations: Map< string, Array< string > >;
	private stopped: boolean;

	/**
	 *
	 */
	public constructor( player: IPlayer, animations: Map< string, Array< string > > )
	{
		this.player = player;
		this.animations = animations;
		this.stopped = false;
	}

	/**
	 *
	 */
	public Play( animation: string, loop: boolean = false ): Promise< void >
	{
		const animationList = this.animations.get( animation );
		let nextAnimation = animation;
		if( !!animationList )
		{
			nextAnimation = Random.FromArray( animationList );
			if( loop )
			{
				return this.player.Play( nextAnimation, false ).then( () =>
				{
					if( !this.stopped )
					{
						this.Play( animation, true );
					}
				} );
			}
		}
		this.stopped = false;
		return this.player.Play( nextAnimation, loop );
	}

	/**
	 *
	 */
	public Stop(): void
	{
		this.stopped = true;
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
