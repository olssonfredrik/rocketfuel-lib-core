import { Point2D } from "../../math";

export class InputEvent
{
	public readonly Position: Point2D;
	public Pressed: boolean;
	public Last: boolean;

	/**
	 * Creates an instance of InputEvent.
	 */
	public constructor( position: Point2D, pressed: boolean )
	{
		this.Position = position;
		this.Pressed = pressed;
		this.Last = pressed;
	}
}
