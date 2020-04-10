import { Point2D } from "../../math";

export interface IRenderTarget
{
	readonly WebGLFramebuffer: WebGLFramebuffer | null;
	readonly Size: Point2D;
	readonly TextureId: string;

	/**
	 *
	 */
	Resize( size: Point2D ): void;
}
