import { GLBuffer } from "./GLBuffer";
import { WebGLRenderer } from "./WebGLRenderer";

export class IndexBuffer extends GLBuffer
{
	/**
	 * Creates an instance of IndexBuffer.
	 */
	public constructor( renderer: WebGLRenderer, data: Uint16Array = new Uint16Array( 0 ), usage: number = WebGLRenderingContext.STATIC_DRAW )
	{
		super( renderer, data, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, usage );
	}

	/**
	 * Generate indices for a number of quads
	 */
	public GenerateQuads( count: number ): void
	{
		const data: Uint16Array = new Uint16Array( count * 6 );

		for( let i = 0, j = 0; i < count * 6; i += 6, j += 4 )
		{
			data[ i + 0 ] = j + 0;
			data[ i + 1 ] = j + 2;
			data[ i + 2 ] = j + 1;
			data[ i + 3 ] = j + 0;
			data[ i + 4 ] = j + 3;
			data[ i + 5 ] = j + 2;
		}

		this.SetData( data );
	}

	/**
	 * Generate indices for a number of triangles
	 */
	public GenerateTriangles( count: number ): void
	{
		const data: Uint16Array = new Uint16Array( count * 3 );

		for( let i = 0, j = 0; i < count * 3; i += 3, j += 3 )
		{
			data[ i + 0 ] = j + 0;
			data[ i + 1 ] = j + 2;
			data[ i + 2 ] = j + 1;
		}

		this.SetData( data );
	}
}
