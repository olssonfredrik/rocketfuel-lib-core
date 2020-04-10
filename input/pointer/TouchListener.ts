import { Point2D } from "../../math";
import { InputEvent } from "./InputEvent";
import { PointerState } from "./PointerState";
import { HtmlHelper } from "../../dom";

export class TouchListener
{
	private current: InputEvent;
	private canvas: HTMLCanvasElement;

	/**
	 * Creates an instance of TouchListener.
	 */
	public constructor( canvas: HTMLCanvasElement )
	{
		canvas.addEventListener( "touchstart", this.TouchEvent.bind( this ) );
		canvas.addEventListener( "touchend", this.TouchEvent.bind( this ) );
		canvas.addEventListener( "touchmove", this.TouchEvent.bind( this ) );
		canvas.addEventListener( "touchcancel", this.Cancel.bind( this ) );

		this.canvas = canvas;
		this.current = new InputEvent( new Point2D( -1000, -1000 ), false );
	}

	/**
	 *
	 */
	public GetState( state: PointerState )
	{
		const current = this.current;

		state.IsTouch = false;
		state.Active = ( current.Position.X >= -1 ) && ( current.Pressed || current.Last );
		state.Position.Set( current.Position );
		state.Pressed = current.Pressed;
		state.Last = current.Last;

		current.Last = current.Pressed;
	}

	/**
	 *
	 */
	private Cancel( event: TouchEvent )
	{
		this.current.Pressed = false;
		this.current.Position.SetValues( -1000, -1000 );
	}

	/**
	 *
	 */
	private TouchEvent( event: TouchEvent )
	{
		event.preventDefault();
		if( event.type === "touchstart" || event.type === "touchmove" )
		{
			this.current.Pressed = true;
			this.ConvertPosition( event.changedTouches[ 0 ].clientX, event.changedTouches[ 0 ].clientY, this.current.Position );
			HtmlHelper.NormalizeInput( this.current.Position, this.canvas );
		}
		this.current.Pressed = ( event.type !== "touchend" );
	}

	/**
	 *
	 */
	private ConvertPosition( x: number, y: number, result: Point2D )
	{
		const rect = this.canvas.getBoundingClientRect();
		const resolutionMultiplier = 1.0 / 1.0; // device pixel ratio;
		const targetX = ( ( x - rect.left ) * ( this.canvas.width / rect.width ) ) * resolutionMultiplier;
		const targetY = ( ( y - rect.top ) * ( this.canvas.height / rect.height ) ) * resolutionMultiplier;
		result.SetValues( targetX, targetY );
	}
}
