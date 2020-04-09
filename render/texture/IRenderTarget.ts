import { Point2D } from "../../math";
import { WebGLRenderer } from "../WebGLRenderer";

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
