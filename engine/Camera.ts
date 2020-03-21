import { mat4 } from "gl-matrix";
import { Point2D } from "../math";
import { WebGLRenderer } from "../render";

export class Camera
{
	public readonly View: mat4 = mat4.create();
	public readonly Projection: mat4 = mat4.create();
	public readonly Size: Point2D = new Point2D( 0, 0 );

	private safeZone: Point2D;

	/**
	 * Creates an instance of Camera.
	 */
	public constructor( safeZone: Point2D )
	{
		this.safeZone = safeZone;
	}

	/**
	 *
	 */
	public BeginFrame( renderer: WebGLRenderer ): void
	{
		const size = this.SetSize( renderer.Size );
		const gl = renderer.GetContext();
		gl.bindFramebuffer( WebGLRenderingContext.FRAMEBUFFER, null );
		gl.viewport( 0, 0, size.X, size.Y );
	}

	/**
	 *
	 */
	public EndFrame(): void
	{
		// apply post-processing, etc
	}

	/**
	 *
	 */
	private SetSize( size: Point2D ): Point2D
	{
		if( !this.Size.Equals( size ) )
		{
			this.Size.Set( size );

			const ratio = size.X / size.Y;
			const safeRatio = this.safeZone.X / this.safeZone.Y;
			let width = this.safeZone.X;
			let height = this.safeZone.X / ratio;
			if( ratio > safeRatio )
			{
				width = this.safeZone.Y * ratio;
				height = this.safeZone.Y;
			}
			const halfWidth = width / 2;
			const halfHeight = height / 2;
			mat4.ortho( this.Projection, -halfWidth, halfWidth, -halfHeight, halfHeight, -1, 1 );
		}
		return this.Size;
	}

}
