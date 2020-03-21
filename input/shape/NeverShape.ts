import { Point2D } from "../../math";
import { IShape } from "./IShape";

export class NeverShape implements IShape
{
	/**
	 *
	 */
	public IsInside( point: Point2D )
	{
		return false;
	}

	/**
	 *
	 */
	public Normalize( point: Point2D ): Point2D
	{
		return point;
	}
}
