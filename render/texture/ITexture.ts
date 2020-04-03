import { Point2D } from "../../math";

export interface ITexture
{
	readonly WebGLTexture: WebGLTexture;
	readonly Size: Point2D;
}
