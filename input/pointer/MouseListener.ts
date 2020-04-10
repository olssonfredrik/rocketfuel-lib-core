import { Point2D } from "../../math";
import { InputEvent } from "./InputEvent";
import { PointerState } from "./PointerState";
import { HtmlHelper } from "../../dom";

export class MouseListener
{
	private current: InputEvent;
	private canvas: HTMLCanvasElement;

	/**
	 * Creates an instance of MouseListener.
	 */
	public constructor( canvas: HTMLCanvasElement )
	{
		this.canvas = canvas;
		canvas.addEventListener( "mousedown", this.MouseEvent.bind( this ) );
		canvas.addEventListener( "mousemove", this.MouseEvent.bind( this ) );
		canvas.addEventListener( "mouseup", this.MouseEvent.bind( this ) );
		canvas.addEventListener( "mouseout", this.Cancel.bind( this ) );

		this.current = new InputEvent( new Point2D( -1000, -1000 ), false );
	}

	/**
	 *
	 */
	public GetState( state: PointerState )
	{
		const current = this.current;

		state.IsTouch = false;
		state.Active = ( current.Position.X >= -1 );
		state.Position.Set( current.Position );
		state.Pressed = current.Pressed;
		state.Last = current.Last;

		current.Last = current.Pressed;
	}

	/**
	 *
	 */
	private Cancel( event: MouseEvent )
	{
		this.current.Pressed = false;
		this.current.Position.SetValues( -1000, -1000 );
	}

	/**
	 *
	 */
	private MouseEvent( event: MouseEvent )
	{
		if( event.type === "mousedown" && event.button === 0 )
		{
			this.current.Pressed = true;
		}

		if( event.type === "mouseup" && event.button === 0 )
		{
			this.current.Pressed = false;
		}
		this.current.Position.SetValues( event.offsetX, event.offsetY );
		HtmlHelper.NormalizeInput( this.current.Position, this.canvas );
	}

}
