import { mat4 } from "gl-matrix";
import { Point2D } from "../math";
import { WebGLRenderer } from "../render";

export class Camera
{
	public readonly View: mat4 = mat4.create();
	public readonly Projection: mat4 = mat4.create();
	public readonly Size: Point2D = new Point2D( 0, 0 );

	private readonly renderer: WebGLRenderer;

	/**
	 * Creates an instance of Camera.
	 */
	public constructor( renderer: WebGLRenderer )
	{
		this.renderer = renderer;
	}

	/**
	 *
	 */
	public BeginFrame(): void
	{
		const renderer = this.renderer;
		this.SetSize( renderer.WorldSize );
		const gl = renderer.GetContext();
		gl.bindFramebuffer( WebGLRenderingContext.FRAMEBUFFER, null );
		gl.viewport( 0, 0, renderer.RenderSize.X, renderer.RenderSize.Y );
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
	private SetSize( size: Point2D ): void
	{
		if( !this.Size.Equals( size ) )
		{
			this.Size.Set( size );
			const halfWidth = size.X / 2;
			const halfHeight = size.Y / 2;
			mat4.ortho( this.Projection, -halfWidth, halfWidth, -halfHeight, halfHeight, -1, 1 );
		}
	}

}
