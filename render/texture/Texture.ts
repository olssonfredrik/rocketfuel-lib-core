import { Point2D } from "../../math";
import { Asserts } from "../../util";
import { WebGLRenderer } from "../WebGLRenderer";
import { ITexture } from "./ITexture";

export class Texture implements ITexture
{
	public readonly WebGLTexture: WebGLTexture;
	public readonly Size: Point2D;

	/**
	 * Creates an instance of Texture.
	 */
	public constructor( renderer: WebGLRenderer, image: HTMLImageElement )
	{
		const gl = renderer.GetContext();
		const texture = gl.createTexture();
		Asserts.AssertNotNull( texture, "Failed to create texture" );
		const WebGL = WebGLRenderingContext;

		gl.pixelStorei( WebGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1 );
		gl.bindTexture( WebGL.TEXTURE_2D, texture );

		gl.texImage2D( WebGL.TEXTURE_2D, 0, WebGL.RGBA, WebGL.RGBA, WebGL.UNSIGNED_BYTE, image );

		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_MIN_FILTER, WebGL.LINEAR );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_MAG_FILTER, WebGL.LINEAR );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_WRAP_S, WebGL.CLAMP_TO_EDGE );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_WRAP_T, WebGL.CLAMP_TO_EDGE );

		this.WebGLTexture = texture;
		this.Size = new Point2D( image.width, image.height );
	}
}
