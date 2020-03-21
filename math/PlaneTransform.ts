import { mat4, vec4 } from "gl-matrix";
import { Camera } from "../engine";
import { Point2D } from "./Point2D";
import { Transform } from "./Transform";

export class PlaneTransform
{
	/**
	 * Transform a screen position into a plane in world space (Ortho only)
	 */
	public static ScreenToPlane( camera: Camera, transform: Transform, screenPosition: Point2D ): Point2D
	{
		const matrix = mat4.create();
		mat4.multiply( matrix, camera.Projection, camera.View );
		mat4.multiply( matrix, matrix, transform.Get() );
		mat4.invert( matrix, matrix );

		const normalizedX = ( 2.0 * screenPosition.X ) / camera.Size.X - 1.0;
		const normalizedY = 1.0 - ( 2.0 * screenPosition.Y ) / camera.Size.Y;

		const point = vec4.fromValues( normalizedX, normalizedY, 0, 1 );
		vec4.transformMat4( point, point, matrix );

		return new Point2D( point[ 0 ], point[ 1 ] );
	}
}
