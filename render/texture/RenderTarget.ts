import { Point2D } from "../../math";
import { Asserts } from "../../util";
import { WebGLRenderer } from "../WebGLRenderer";
import { ITexture } from "./ITexture";

export class RenderTarget implements ITexture
{
	public readonly WebGLTexture: WebGLTexture;
	public readonly Size: Point2D;

	private readonly WebGLFramebuffer: WebGLFramebuffer;
	private readonly WebGLRenderbuffer?: WebGLRenderbuffer;

	private readonly format: number;
	private readonly attachment: number;

	/**
	 * Creates an instance of RenderTarget.
	 */
	public constructor( renderer: WebGLRenderer, width: number, height: number, useAlpha: boolean = true )
	{
		const gl = renderer.GetContext();
		const texture = gl.createTexture();
		Asserts.AssertNotNull( texture, "Failed to create texture" );
		const WebGL = WebGLRenderingContext;
		this.format = ( useAlpha ? WebGL.RGBA : WebGL.RGB );
		this.attachment = ( renderer.UseDepth ? WebGL.DEPTH_STENCIL_ATTACHMENT : WebGL.STENCIL_ATTACHMENT );

		gl.bindTexture( WebGL.TEXTURE_2D, texture );

		gl.texImage2D( WebGL.TEXTURE_2D, 0, this.format, width, height, 0, this.format, WebGL.UNSIGNED_BYTE, null );

		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_MIN_FILTER, WebGL.LINEAR );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_MAG_FILTER, WebGL.LINEAR );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_WRAP_S, WebGL.CLAMP_TO_EDGE );
		gl.texParameteri( WebGL.TEXTURE_2D, WebGL.TEXTURE_WRAP_T, WebGL.CLAMP_TO_EDGE );

		const framebuffer = gl.createFramebuffer();
		Asserts.AssertNotNull( framebuffer, "Failed to create framebuffer" );
		gl.bindFramebuffer( WebGL.FRAMEBUFFER, framebuffer );
		gl.framebufferTexture2D( WebGL.FRAMEBUFFER, WebGL.COLOR_ATTACHMENT0, WebGL.TEXTURE_2D, texture, 0 );

		if( this.attachment !== 0 )
		{
			const renderbuffer = gl.createRenderbuffer();
			Asserts.AssertNotNull( renderbuffer, "Failed to create renderbuffer" );
			gl.bindRenderbuffer( WebGL.RENDERBUFFER, renderbuffer );
			gl.renderbufferStorage( WebGL.RENDERBUFFER, WebGL.STENCIL_INDEX8, width, height );
			gl.framebufferRenderbuffer( WebGL.FRAMEBUFFER, this.attachment, gl.RENDERBUFFER, renderbuffer );
			gl.bindRenderbuffer( WebGL.RENDERBUFFER, null );
			this.WebGLRenderbuffer = renderbuffer;
		}

		gl.bindFramebuffer( WebGL.FRAMEBUFFER, null );

		this.WebGLTexture = texture;
		this.WebGLFramebuffer = framebuffer;
		this.Size = new Point2D( width, height );
	}

	/**
	 *
	 */
	public Resize( renderer: WebGLRenderer, width: number, height: number ): void
	{
		const WebGL = WebGLRenderingContext;
		const gl = renderer.GetContext();
		const texture = this.WebGLTexture;

		gl.bindTexture( WebGL.TEXTURE_2D, texture );
		gl.texImage2D( WebGL.TEXTURE_2D, 0, this.format, width, height, 0, this.format, WebGL.UNSIGNED_BYTE, null );

		if( !!this.WebGLRenderbuffer )
		{
			gl.bindRenderbuffer( WebGL.RENDERBUFFER, this.WebGLRenderbuffer );
			gl.renderbufferStorage( WebGL.RENDERBUFFER, this.attachment, width, height );
			gl.bindRenderbuffer( WebGL.RENDERBUFFER, null );
		}
		this.Size.SetValues( width, height );
	}

	/**
	 *
	 */
	public SetActive( renderer: WebGLRenderer ): void
	{
		const WebGL = WebGLRenderingContext;
		const gl = renderer.GetContext();
		gl.bindFramebuffer( WebGL.FRAMEBUFFER, this.WebGLFramebuffer );
		gl.viewport( 0, 0, this.Size.X, this.Size.Y );
	}
}
