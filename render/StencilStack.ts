import { Camera } from "../engine";
import { Asserts } from "../util";
import { WebGLRenderer } from "./WebGLRenderer";

export class StencilStack
{
	private readonly BASE_LAYER = 0x80;
	private readonly MASK_ALL = 0xff;
	private readonly MASK_NONE = 0x00;

	private layer: number;

	/**
	 *
	 */
	public constructor()
	{
		this.layer = 0;
	}

	/**
	 *
	 */
	public Push( renderer: WebGLRenderer, camera: Camera, renderFunc: ( renderer: WebGLRenderer, camera: Camera ) => void ): void
	{
		Asserts.Assert( this.layer < 7, "Pushing on a full StencilStack" );

		const gl = renderer.GetContext();
		const alpha = renderer.AlphaMaskStack.Peek();
		const currentLayerMask = this.BASE_LAYER >> this.layer;
		const nextLayerMask = this.BASE_LAYER >> ( this.layer + 1 );
		const combinedMask = currentLayerMask | nextLayerMask;

		if( this.layer === 0 )
		{
			gl.enable( WebGLRenderingContext.STENCIL_TEST );
		}

		// clear only the bit for the next layer
		gl.stencilMask( nextLayerMask );
		gl.clearStencil( 0x00 );
		gl.clear( WebGLRenderingContext.STENCIL_BUFFER_BIT );

		// set the stencil to only draw on the next layer where it overlaps the current layer
		gl.stencilOp( WebGLRenderingContext.KEEP, WebGLRenderingContext.KEEP, WebGLRenderingContext.REPLACE );
		gl.stencilFunc( WebGLRenderingContext.LESS, nextLayerMask, combinedMask );

		// draw the stencil
		gl.colorMask( false, false, false, false );
		renderFunc( renderer, camera );
		gl.colorMask( true, true, true, alpha );
		gl.stencilMask( this.MASK_NONE );

		// make the next layer the current layer
		this.layer++;
		this.UseStencil( renderer, this.layer );
	}

	/**
	 *
	 */
	public Pop( renderer: WebGLRenderer ): void
	{
		Asserts.Assert( this.layer >= 1, "Popping an empty StencilStack" );
		this.layer--;
		this.UseStencil( renderer, this.layer );
		if( this.layer === 0 )
		{
			renderer.GetContext().disable( WebGLRenderingContext.STENCIL_TEST );
		}
	}

	/**
	 * Reset to layer 0 and clear the stencil
	 */
	public Reset( renderer: WebGLRenderer ): void
	{
		const gl = renderer.GetContext();
		gl.clearStencil( this.BASE_LAYER );
		gl.stencilMask( this.MASK_ALL );
		gl.clear( WebGLRenderingContext.STENCIL_BUFFER_BIT );
		gl.stencilMask( this.MASK_NONE );
		gl.disable( WebGLRenderingContext.STENCIL_TEST );
		this.layer = 0;
	}

	/**
	 *
	 */
	private UseStencil( renderer: WebGLRenderer, layer: number )
	{
		const mask = this.BASE_LAYER >> layer;
		renderer.GetContext().stencilFunc( WebGLRenderingContext.EQUAL, mask, mask );
	}
}
