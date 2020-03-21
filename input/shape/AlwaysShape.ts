import { Point2D } from "../../math";
import { IShape } from "./IShape";

export class AlwaysShape implements IShape
{
	/**
	 *
	 */
	public IsInside( point: Point2D )
	{
		return true;
	}

	/**
	 *
	 */
	public Normalize( point: Point2D ): Point2D
	{
		return point;
	}
}
