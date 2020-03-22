import { Point2D } from "../math";
import { Asserts } from "../util";
import { WebGLRenderer } from "./WebGLRenderer";

export class Texture
{
	public readonly WebGLTexture: WebGLTexture;
	public readonly Size: Point2D;

	/**
	 * Creates an instance of Texture.
	 */
	public constructor( renderer: WebGLRenderer, image: HTMLImageElement )
	{
		const texture = renderer.GetContext().createTexture();
		Asserts.AssertNotNull( texture, "Failed to create texture" );
		this.WebGLTexture = texture;

		const gl = renderer.GetContext();

		gl.pixelStorei( WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1 );
		gl.bindTexture( WebGLRenderingContext.TEXTURE_2D, texture );
		gl.texImage2D( WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, image );
		gl.texParameteri( WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR );
		gl.texParameteri( WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR );
		gl.texParameteri( WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE );
		gl.texParameteri( WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE );

		gl.activeTexture( WebGLRenderingContext.TEXTURE0 );
		gl.bindTexture( WebGLRenderingContext.TEXTURE_2D, texture );

		this.Size = new Point2D( image.width, image.height );
	}
}
