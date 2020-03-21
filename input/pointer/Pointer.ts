import { MouseListener } from "./MouseListener";
import { PointerState } from "./PointerState";
import { TouchListener } from "./TouchListener";

export class Pointer
{
	private mouse: MouseListener;
	private touch: TouchListener;
	private state: PointerState;

	/**
	 * Creates an instance of Pointer.
	 */
	public constructor( element: HTMLCanvasElement )
	{
		this.mouse = new MouseListener( element );
		this.touch = new TouchListener( element );
		this.state = new PointerState();
	}

	/**
	 *
	 */
	public GetState(): PointerState
	{
		this.touch.GetState( this.state );
		if( !this.state.Active )
		{
			this.mouse.GetState( this.state );
		}

		return this.state;
	}
}
