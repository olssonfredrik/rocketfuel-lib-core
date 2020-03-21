import { Point2D } from "../math";
import { Asserts } from "../util";
import { BlendMode } from "./BlendMode";
import { StateStack } from "./StateStack";
import { StencilStack } from "./StencilStack";

export class WebGLRenderer
{
	public readonly Size: Point2D;

	public readonly AlphaMaskStack: StateStack< boolean >;
	public readonly BlendModeStack: StateStack< BlendMode >;
	public readonly CullingStack: StateStack< boolean >;
	public readonly DepthCheckStack: StateStack< boolean >;
	public readonly DepthMaskStack: StateStack< boolean >;
	public readonly StencilStack: StencilStack;

	private gl: WebGLRenderingContext;

	private vertexAttribCount: number;

	/**
	 *
	 */
	public constructor( glContext: WebGLRenderingContext )
	{
		const gl = glContext;
		gl.getExtension( "OES_standard_derivatives" );

		this.AlphaMaskStack = new StateStack< boolean >( false, ( state: boolean ): void =>
		{
			gl.colorMask( true, true, true, state );
		} );

		this.BlendModeStack = new StateStack< BlendMode >( BlendMode.Normal, ( state: BlendMode ): void =>
		{
			switch( state )
			{
				case BlendMode.Normal:
					gl.blendFunc( WebGLRenderingContext.ONE, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA );
					break;
				case BlendMode.Additive:
					gl.blendFunc( WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE );
					break;
				default:
					Asserts.Assert( false, "Unknown BlendMode:" + state );
			}
		} );

		this.CullingStack = new StateStack< boolean >( false, ( state: boolean ): void =>
		{
			state ? gl.enable( WebGLRenderingContext.CULL_FACE ) : gl.disable( WebGLRenderingContext.CULL_FACE );
		} );

		this.DepthCheckStack = new StateStack< boolean >( false, ( state: boolean ): void =>
		{
			state ? gl.enable( WebGLRenderingContext.DEPTH_TEST ) : gl.disable( WebGLRenderingContext.DEPTH_TEST );
		} );

		this.DepthMaskStack = new StateStack< boolean >( false, ( state: boolean ): void =>
		{
			gl.depthMask( state );
		} );

		this.StencilStack = new StencilStack();
		this.vertexAttribCount = 0;
		this.Size = new Point2D( 1920, 960 );
		this.gl = gl;
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
		this.StencilStack.Reset( this );

		this.Clear( 0.0, 0.0, 0.0, 0.0 ); // start with an all black screen
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
