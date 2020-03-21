import { IndexBuffer } from "./IndexBuffer";
import { VertexBuffer } from "./VertexBuffer";
import { WebGLRenderer } from "./WebGLRenderer";

export class VertexBufferObject
{
	private indexBuffer: IndexBuffer;
	private vertexBuffers: Array< VertexBuffer >;

	/**
	 * Creates an instance of VertexBufferObject.
	 */
	public constructor( indexBuffer: IndexBuffer, vertexBuffers: ( VertexBuffer | Array< VertexBuffer > ) )
	{
		this.indexBuffer = indexBuffer;
		if( vertexBuffers instanceof VertexBuffer )
		{
			this.vertexBuffers = [ vertexBuffers ];
		}
		else
		{
			this.vertexBuffers = vertexBuffers;
		}
	}

	/**
	 *
	 */
	public Draw( renderer: WebGLRenderer, locations: Array< number >, count: number = this.indexBuffer.GetCount() ): void
	{
		renderer.SetActiveVertexAttributeLocations( locations );
		if( this.vertexBuffers.length === 1 )
		{
			this.vertexBuffers[ 0 ].BindAttributes( locations );
		}
		else
		{
			for( let i = 0; i < locations.length; i++ )
			{
				this.vertexBuffers[ i ].BindAttributes( [ locations[ i ] ] );
			}
		}
		this.indexBuffer.Bind();
		renderer.GetContext().drawElements( WebGLRenderingContext.TRIANGLES, count, WebGLRenderingContext.UNSIGNED_SHORT, 0 );
	}
}
