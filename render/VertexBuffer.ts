import { GLBuffer } from "./GLBuffer";
import { WebGLRenderer } from "./WebGLRenderer";

interface ILocation { size: number; offset: number; }

export class VertexBuffer extends GLBuffer
{
	private layout: Array< ILocation >;
	private stride: number;

	/**
	 * Creates an instance of VertexBuffer.
	 */
	public constructor( renderer: WebGLRenderer, data: Float32Array, layout: Array< number >, usage: number = WebGLRenderingContext.STATIC_DRAW )
	{
		super( renderer, data, WebGLRenderingContext.ARRAY_BUFFER, usage );

		let offset = 0;
		this.layout = new Array< ILocation >();
		for( const size of layout )
		{
			this.layout.push( { size, offset } );
			offset += size * 4; // sizeof(Float32)
		}

		this.stride = offset;
	}

	/**
	 *
	 */
	public BindAttributes( locations: Array< number > ): void
	{
		this.Bind();

		const gl = this.renderer.GetContext();
		for( let i = 0; i < this.layout.length; i++ )
		{
			const layout = this.layout[ i ];
			if( locations.length > i && locations[ i ] >= 0 )
			{
				gl.vertexAttribPointer( locations[ i ], layout.size, WebGLRenderingContext.FLOAT, false, this.stride, layout.offset );
			}
		}
	}
}
