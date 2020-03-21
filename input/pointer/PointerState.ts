import { Point2D } from "../../math";

export class PointerState
{
	public Active: boolean = false;
	public IsTouch: boolean = false;
	public Position: Point2D = new Point2D( -1000, -1000 );

	public Pressed: boolean = false;
	public Last: boolean = false;
}
