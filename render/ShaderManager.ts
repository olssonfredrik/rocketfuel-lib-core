import { DownloadManager } from "../download";
import { IJSONArray, MapUtil } from "../util";
import { Shader } from "./Shader";
import { WebGLRenderer } from "./WebGLRenderer";

export class ShaderManager
{
	private renderer: WebGLRenderer;
	private shaders: Map< string, Shader > = new Map< string, Shader >();

	/**
	 * Creates an instance of ShaderManager.
	 */
	public constructor( renderer: WebGLRenderer )
	{
		this.renderer = renderer;
	}

	/**
	 *
	 */
	public Init( data: IJSONArray, downloadManager: DownloadManager )
	{
		const shaders = data as ( Array< { Id: string, Vert: string, Frag: string } > );
		shaders.forEach( ( shader ) => this.Add( shader.Id, downloadManager.GetText( shader.Vert ), downloadManager.GetText( shader.Frag ) ) );
	}

	/**
	 *
	 */
	public Add( id: string, vertex: string, fragment: string ): void
	{
		this.shaders.set( id, new Shader( this.renderer, id, vertex, fragment ) );
	}

	/**
	 *
	 */
	public Get( id: string ): Shader
	{
		return MapUtil.AssertedGet( this.shaders, id, "Failed to find shader [" + id + "]" );
	}
}
