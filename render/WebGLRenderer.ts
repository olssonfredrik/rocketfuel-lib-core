import { Point2D } from "../math";
import { Asserts } from "../util";
import { BlendMode } from "./BlendMode";
import { StateStack, StencilStack } from "./stack";
import { IRenderTarget } from "./texture";

export class WebGLRenderer
{
	/** The "screen" size in world units */
	public readonly WorldSize: Point2D;
	/** The "screen" size in pixels */
	public readonly RenderSize: Point2D;

	public readonly UseStencil: boolean;
	public readonly UseDepth: boolean;

	public readonly AlphaMaskStack: StateStack< boolean >;
	public readonly BlendModeStack: StateStack< BlendMode >;
	public readonly CullingStack: StateStack< boolean >;
	public readonly DepthCheckStack: StateStack< boolean >;
	public readonly DepthMaskStack: StateStack< boolean >;
	public readonly RenderTargetStack: StateStack< IRenderTarget >;
	public readonly StencilStack: StencilStack;

	private gl: WebGLRenderingContext;

	private vertexAttribCount: number;

	/**
	 *
	 */
	public constructor( glContext: WebGLRenderingContext, startSize: Point2D, useStencil: boolean = true, useDepth: boolean = false )
	{
		const WebGL = WebGLRenderingContext;
		const gl = glContext;
		gl.getExtension( "OES_standard_derivatives" );

		this.gl = gl;
		this.vertexAttribCount = 0;
		this.RenderSize = startSize.Clone();
		this.WorldSize = startSize.Clone();
		this.UseDepth = useDepth;
		this.UseStencil = useStencil;

		this.AlphaMaskStack = new StateStack< boolean >( false, ( state: boolean ) =>
		{
			gl.colorMask( true, true, true, state );
		} );

		this.BlendModeStack = new StateStack< BlendMode >( BlendMode.Normal, ( state: BlendMode ) =>
		{
			switch( state )
			{
				case BlendMode.Normal:
					gl.blendFunc( WebGL.ONE, WebGL.ONE_MINUS_SRC_ALPHA );
					break;

				case BlendMode.Additive:
					gl.blendFunc( WebGL.SRC_ALPHA, WebGL.ONE );
					break;

				case BlendMode.Multiply:
					gl.blendFunc( WebGL.DST_COLOR, WebGL.ONE_MINUS_SRC_ALPHA );
					break;

				case BlendMode.Screen:
					gl.blendFunc( WebGL.ONE, WebGL.ONE_MINUS_SRC_ALPHA );
					break;

				default:
					Asserts.Assert( false, "Unknown BlendMode:" + state );
			}
		} );

		this.CullingStack = new StateStack< boolean >( false, ( state: boolean ) =>
		{
			state ? gl.enable( WebGL.CULL_FACE ) : gl.disable( WebGL.CULL_FACE );
		} );

		this.DepthCheckStack = new StateStack< boolean >( false, ( state: boolean ) =>
		{
			state ? gl.enable( WebGL.DEPTH_TEST ) : gl.disable( WebGL.DEPTH_TEST );
		} );

		this.DepthMaskStack = new StateStack< boolean >( false, ( state: boolean ) =>
		{
			gl.depthMask( state );
		} );

		this.StencilStack = new StencilStack();

		const screen = { Size: this.RenderSize, WebGLFramebuffer: null, TextureId: "", Resize: () => {} };
		this.RenderTargetStack = new StateStack< IRenderTarget >( screen, ( state: IRenderTarget ) =>
		{
			gl.bindFramebuffer( WebGL.FRAMEBUFFER, state.WebGLFramebuffer );
			gl.viewport( 0, 0, state.Size.X, state.Size.Y );
			this.StencilStack.Clear( this ); // Todo: should this only be called on push?
		} );
	}

	/**
	 *
	 */
	public GetContext(): WebGLRenderingContext
	{
		return this.gl;
	}

	/**
	 * Clear the current rendering target
	 */
	public Clear( r: number, g: number, b: number, a: number )
	{
		const gl = this.gl;

		gl.clearColor( r, g, b, a );
		gl.clear( WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT );
	}

	/**
	 * Called by the Engine at the start of each frame
	 */
	public BeginFrame()
	{
		const gl = this.gl;

		gl.depthFunc( WebGLRenderingContext.GREATER );
		gl.cullFace( WebGLRenderingContext.BACK );
		gl.enable( WebGLRenderingContext.BLEND );

		this.AlphaMaskStack.Reset();
		this.BlendModeStack.Reset();
		this.CullingStack.Reset();
		this.DepthCheckStack.Reset();
		this.DepthMaskStack.Reset();
		this.RenderTargetStack.Reset();
		this.StencilStack.Reset( this );

		this.Clear( 0.0, 0.0, 0.0, 1.0 );
	}

	/**
	 * Called by the Engine at the end of each frame
	 */
	public EndFrame()
	{
		const gl = this.gl;

		// TODO: Check if this iOS hack is still needed.
		gl.colorMask( false, false, false, true );
		this.Clear( 1.0, 1.0, 1.0, 1.0 );

		gl.flush();

		// TODO: Assert that we ended the frame in a safe state
	}

	/**
	 *
	 */
	public SetActiveVertexAttributeLocations( locations: Array< number > ): void
	{
		const count = locations.reduce( ( total, location ) => total + ( ( location >= 0 ) ? 1 : 0 ), 0 );
		this.SetVertexAttribCount( count );
	}

	/**
	 *
	 */
	private SetVertexAttribCount( count: number ): void
	{
		const gl = this.gl;
		let current = this.vertexAttribCount;

		while( current < count )
		{
			gl.enableVertexAttribArray( current );
			current++;
		}
		while( current > count )
		{
			current--;
			gl.disableVertexAttribArray( current );
		}
		this.vertexAttribCount = current;
	}

}
