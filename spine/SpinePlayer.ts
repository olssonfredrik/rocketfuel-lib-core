import { spine } from "esotericsoftware-spine";
import { EventManager } from "../engine";
import { IPlayer } from "../player";
import { Asserts } from "../util";

export class SpinePlayer implements IPlayer
{
	private animationState: spine.AnimationState;
	private animationData: spine.SkeletonData;
	private eventManager: EventManager;
	private stopFlag: boolean;

	/**
	 *
	 */
	public constructor( state: spine.AnimationState, data: spine.SkeletonData, eventManager: EventManager )
	{
		this.animationState = state;
		this.animationData = data;
		this.eventManager = eventManager;
		this.stopFlag = false;
	}

	/**
	 *
	 */
	public Play( animation: string, loop: boolean = false ): Promise< boolean >
	{
		Asserts.Assert( !this.stopFlag, "Don't trigger a Play on a stopped Promise." );

		// Todo: Only resolving won't trigger any remaining events in the animation
		this.Resolve();

		const track = this.animationState.setAnimation( 0, animation, loop );
		track.loop = track.loop && ( track.animation.duration > 0 );

		return new Promise< boolean >( ( resolve ) =>
		{
			track.listener =
			{
				end: ( entry ) => {},
				dispose: ( entry ) => {},
				complete: ( entry ) => resolve( this.stopFlag ),
				event: ( entry, event ) => {
					const name = event.data.name;
					if( name === "Resolve" )
					{
						resolve( this.stopFlag );
					}
					else
					{
						const params = event.stringValue.length > 0 ? JSON.parse( event.stringValue ) : undefined;
						this.eventManager.Send( { EventId: name, Params: params } );
					}
				},
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
			const flag = this.stopFlag;
			this.stopFlag = true;
			track.loop = false;
			this.animationState.update( track.animationEnd - track.getAnimationTime() );
			this.stopFlag = flag;
			this.Resolve();
		}
	}

	/**
	 *
	 */
	public HasAnimation( name: string ): boolean
	{
		return !!this.animationData.findAnimation( name );
	}

	/**
	 * Send the 'complete' event for the currently playing animation.
	 */
	private Resolve(): void
	{
		const track = this.animationState.tracks[ 0 ];
		if( !!track )
		{
			const flag = this.stopFlag;
			this.stopFlag = true;
			track.listener.complete( track );
			this.stopFlag = flag;
		}
	}
}
