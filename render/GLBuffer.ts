import { Asserts } from "../util";
import { WebGLRenderer } from "./WebGLRenderer";

type BufferData = Float32Array | Uint16Array;

export class GLBuffer
{
	/**
	 *
	 */
	private static Create( renderer: WebGLRenderer ): WebGLBuffer
	{
		return Asserts.AssertDefinedNotNull( renderer.GetContext().createBuffer() as WebGLBuffer, "Failed to create buffer" );
	}

	protected renderer: WebGLRenderer;
	private data: BufferData;
	private type: number;
	private usage: number;
	private buffer: WebGLBuffer;

	public constructor( renderer: WebGLRenderer, data: BufferData, type: number = WebGLRenderingContext.ARRAY_BUFFER, usage: number = WebGLRenderingContext.STATIC_DRAW )
	{
		this.renderer = renderer;
		this.data = data;
		this.type = type;
		this.usage = usage;

		this.buffer = GLBuffer.Create( renderer );
		this.SetData( data );
	}

	/**
	 * Get the number of items in the data
	 */
	public GetCount(): number
	{
		return this.data.length;
	}

	/**
	 *
	 */
	public Bind(): void
	{
		const gl = this.renderer.GetContext();
		gl.bindBuffer( this.type, this.buffer );
	}

	/**
	 *
	 */
	public SetData( data: BufferData ): void
	{
		this.Bind();

		const gl = this.renderer.GetContext();
		gl.bufferData( this.type, data, this.usage );
		this.data = data;
	}
}
