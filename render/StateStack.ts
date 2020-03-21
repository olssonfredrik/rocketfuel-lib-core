export class StateStack< T >
{
	private defaultState: T;
	private currentState: T;
	private stack: Array< T >;
	private setFunction: ( state: T ) => void;

	/**
	 * Creates an instance of StateStack.
	 */
	public constructor( defaultState: T, setFunction: ( state: T ) => void )
	{
		this.defaultState = defaultState;
		this.currentState = defaultState;
		this.setFunction = setFunction;
		this.stack = [ defaultState ];
	}

	/**
	 *
	 */
	public Push( state: T ): void
	{
		this.stack.push( state );
		this.Set( false );
	}

	/**
	 *
	 */
	public Pop(): void
	{
		this.stack.pop();
		this.Set( false );
	}

	/**
	 *
	 */
	public Peek(): T
	{
		return this.stack[ this.stack.length - 1 ];
	}

	/**
	 *
	 */
	public Reset(): void
	{
		this.stack = [ this.defaultState ];
		this.Set( true );
	}

	/**
	 *
	 */
	private Set( force: boolean ): void
	{
		const state = this.Peek();
		if( force || state !== this.currentState )
		{
			this.setFunction( state );
			this.currentState = state;
		}
	}
}
