import { Point2D } from "../../math";
import { IShape } from "./IShape";
import { IShapeConfig } from "./Shape";

export class CircleShape implements IShape
{
	private radiusSquared: number;
	private radius: number;

	/**
	 *
	 */
	public constructor( radius: number )
	{
		this.radius = radius;
		this.radiusSquared = radius * radius;
	}

	/**
	 *
	 */
	public IsInside( point: Point2D )
	{
		const lengthSquared = point.X * point.X + point.Y * point.Y;
		return ( lengthSquared < this.radiusSquared );
	}

	/**
	 *
	 */
	public Normalize( point: Point2D ): Point2D
	{
		return point.SetValues( point.X / this.radius, point.Y / this.radius );
	}
}

export interface ICircleShapeConfig extends IShapeConfig
{
	Radius: number;
}
