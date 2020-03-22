import { Point2D } from "../math";

export class CanvasTransform
{
	private canvas: HTMLCanvasElement;

	/**
	 *
	 */
	public constructor( canvas: HTMLCanvasElement )
	{
		this.canvas = canvas;
		this.SetStyleTransform( "0% 0%" );
	}

	/**
	 *
	 */
	public SetTransform( position: Point2D, scale: number )
	{
		const offset = new Point2D( -this.canvas.width, -this.canvas.height ).Scale( 0.5 ).Add( position );
		this.SetStyleTransform( this.Translate( offset ) + this.Scale( scale ) );
	}

	/**
	 *
	 */
	private Scale( scale: number ): string
	{
		return "scale(" + scale + ") ";
	}

	/**
	 *
	 */
	private Translate( point: Point2D ): string
	{
		return "translate(" + point.X + "px, " + point.Y + "px) ";
	}

	/**
	 *
	 */
	private SetStyleTransform( transform: string ): void
	{
		this.canvas.style.transform = transform;
		this.canvas.style.webkitTransform = transform;
	}
}
