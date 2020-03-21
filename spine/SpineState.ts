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
	public SetState( state: string, force: boolean = false ): Promise< void >
	{
		let promise = Promise.resolve();
		if( force || this.state !== state )
		{
			const transition = this.state + "_" + state;
			this.state = state;
			if( this.spine.HasAnimation( transition ) )
			{
				promise = this.spine.Play( transition ).then( () =>
				{
					this.spine.Play( state, true );
				} );
			}
			else
			{
				this.spine.Play( state, true );
			}
		}
		return promise;
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
