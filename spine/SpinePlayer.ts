import { spine } from "esotericsoftware-spine";
import { IPlayer } from "../player";

export class SpinePlayer implements IPlayer
{
	private animationState: spine.AnimationState;
	private animationData: spine.SkeletonData;

	/**
	 *
	 */
	public constructor( state: spine.AnimationState, data: spine.SkeletonData )
	{
		this.animationState = state;
		this.animationData = data;
	}

	/**
	 *
	 */
	public Play( animation: string, loop: boolean = false ): Promise< void >
	{
		const track = this.animationState.setAnimation( 0, animation, loop );

		return new Promise< void >( ( resolve ) =>
		{
			track.listener =
			{
				end: ( entry ) => {},
				dispose: ( entry ) => {},
				complete: ( entry ) => resolve(),
				event: ( entry, event ) => {},
				interrupt: ( entry ) => {},
				start: ( entry ) => {},
			};
		} );
	}

	/**
	 *
	 */
	public Stop(): void
	{
		const track = this.animationState.tracks[ 0 ];
		if( !!track )
		{
			track.loop = false;
			this.animationState.update( track.trackEnd - track.trackTime );
		}
	}

	/**
	 *
	 */
	public HasAnimation( name: string ): boolean
	{
		return !!this.animationData.findAnimation( name );
	}
}
