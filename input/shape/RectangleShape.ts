import { Point2D } from "../../math";
import { IShape } from "./IShape";
import { IShapeConfig } from "./Shape";

export class RectangleShape implements IShape
{
	private halfWidth: number;
	private halfHeight: number;

	/**
	 *
	 */
	public constructor( width: number, height: number )
	{
		this.halfWidth = width * 0.5;
		this.halfHeight = height * 0.5;
	}

	/**
	 *
	 */
	public IsInside( point: Point2D )
	{
		return ( point.Y > -this.halfHeight && point.Y < this.halfHeight && point.X > -this.halfWidth && point.X < this.halfWidth );
	}

	/**
	 *
	 */
	public Normalize( point: Point2D ): Point2D
	{
		return point.SetValues( point.X / this.halfWidth, point.Y / this.halfHeight );
	}
}

export interface IRectangleShapeConfig extends IShapeConfig
{
	Width: number;
	Height: number;
}
