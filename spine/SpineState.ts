import { SpineNode } from "./SpineNode";

export class SpineState
{
	private state: string;
	private startState: string;
	private spine: SpineNode;

	/**
	 *
	 */
	public constructor( spine: SpineNode, startState: string )
	{
		this.state = startState;
		this.startState = startState;
		this.spine = spine;
		this.Reset();
	}

	/**
	 *
	 */
	public SetSpine( spine: SpineNode ): void
	{
		this.spine = spine;
		this.Reset();
	}

	/**
	 *
	 */
	public SetState( state: string, force: boolean = false ): Promise< boolean >
	{
		if( force || this.state !== state )
		{
			const transition = this.state + "_" + state;
			this.state = state;
			if( !force && this.spine.HasAnimation( transition ) )
			{
				return this.spine.Play( transition ).then( ( stopped ) =>
				{
					if( !stopped )
					{
						this.spine.Play( state, true );
					}
					return stopped;
				} );
			}
			else
			{
				if( force )
				{
					this.spine.Stop();
				}
				return this.spine.Play( state, true );
			}
		}
		return Promise.resolve( false );
	}

	/**
	 *
	 */
	public GetState(): string
	{
		return this.state;
	}

	/**
	 *
	 */
	public Reset(): void
	{
		this.SetState( this.startState, true );
	}
}
