export class Point2D
{

	/**
	 *
	 */
	public static FromConfig( config: IPoint2DConfig ): Point2D
	{
		return new Point2D( config.X, config.Y );
	}

	public X: number;
	public Y: number;

	/**
	 * Creates an instance of Point2D.
	 */
	constructor( x: number = 0, y: number = 0 )
	{
		this.X = x;
		this.Y = y;
	}

	/**
	 *
	 */
	public Set( a: Point2D ): Point2D
	{
		this.X = a.X;
		this.Y = a.Y;
		return this;
	}

	/**
	 *
	 */
	public SetValues( a: number, b: number ): Point2D
	{
		this.X = a;
		this.Y = b;
		return this;
	}

	/**
	 *
	 */
	public Scale( scale: number ): Point2D
	{
		this.X *= scale;
		this.Y *= scale;
		return this;
	}

	/**
	 *
	 */
	public Add( a: Point2D ): Point2D
	{
		this.X += a.X;
		this.Y += a.Y;
		return this;
	}

	/**
	 *
	 */
	public Subtract( a: Point2D ): Point2D
	{
		this.X -= a.X;
		this.Y -= a.Y;
		return this;
	}

	/**
	 *
	 */
	public Normalize(): Point2D
	{
		return this.Scale( 1 / this.Length() );
	}

	/**
	 *
	 */
	public Length(): number
	{
		return Math.sqrt( this.X * this.X + this.Y * this.Y );
	}

	/**
	 *
	 */
	public Equals( a: Point2D ): boolean
	{
		return ( this.X === a.X && this.Y === a.Y );
	}

	/**
	 *
	 */
	public Clone(): Point2D
	{
		return new Point2D( this.X, this.Y );
	}
}

export interface IPoint2DConfig
{
	X: number;
	Y: number;
}
