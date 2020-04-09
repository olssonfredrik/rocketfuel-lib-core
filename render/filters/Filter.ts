import { IndexBuffer, VertexBuffer, VertexBufferObject } from "../buffer";
import { IRenderTarget, TextureManager } from "../texture";
import { WebGLRenderer } from "../WebGLRenderer";
import { IFilter } from "./IFilter";

export class Filter implements IFilter
{
	protected readonly vbo: VertexBufferObject;
	protected readonly textureManager: TextureManager;
	protected readonly renderer: WebGLRenderer;
	protected runtime: number;

	/**
	 *
	 */
	public constructor( name: string, renderer: WebGLRenderer, textureManager: TextureManager )
	{
		const verts: Array< number > = [ -1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1 ];
		const vertexBuffer = new VertexBuffer( renderer, new Float32Array( verts ), [ 2, 2 ] );
		this.vbo = new VertexBufferObject( IndexBuffer.CreateQuads( renderer ), vertexBuffer );
		this.runtime = 0;
		this.textureManager = textureManager;
		this.renderer = renderer;
	}

	/**
	 *
	 */
	public Update( deltaTime: number ): void
	{
		this.runtime += deltaTime;
	}

	/**
	 *
	 */
	public Process( renderer: WebGLRenderer, input: string ): string
	{
		return input;
	}

	/**
	 *
	 */
	protected Apply( from: string, to: IRenderTarget, attributeLocations: Array< number > ): void
	{
		this.renderer.RenderTargetStack.Push( to );
		this.textureManager.SetActive( [ from ] );
		this.vbo.Draw( this.renderer, attributeLocations );
		this.renderer.RenderTargetStack.Pop();
	}
}
