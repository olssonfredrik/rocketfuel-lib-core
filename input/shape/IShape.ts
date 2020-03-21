import { Point2D } from "../../math";

export interface IShape
{
	/**
	 *
	 */
	IsInside( point: Point2D ): boolean;

	/**
	 *
	 */
	Normalize( point: Point2D ): Point2D;
}
