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
	Resize( renderer: WebGLRenderer, size: Point2D ): void;
}