import { Camera, Engine } from "../engine";
import { IndexBuffer, Shader, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { IJSONObject, ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class DebugNode extends LeafNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): DebugNode
	{
		return new DebugNode( engine );
	}

	private shader: Shader;
	private vbo: VertexBufferObject;

	/**
	 *
	 */
	public constructor( engine: Engine )
	{
		super( "DebugNode" );

		this.shader = engine.ShaderManager.Get( "RFLib/SolidColor" );

		const renderer = engine.Renderer;
		const indexBuffer = new IndexBuffer( renderer, new Uint16Array( [ 0, 1, 2, 1, 2, 3, 4, 5, 6, 5, 6, 7 ] ) );
		const size = 100;
		const verts: Array< number > =
		[
			-size, -1, size, -1, -size, 1, size, 1,
			-1, size, -1, -size, 1, size, 1, -size,
		];
		const vertexBuffer = new VertexBuffer( renderer, new Float32Array( verts ), [ 2 ] );

		this.vbo = new VertexBufferObject( indexBuffer, vertexBuffer );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		ShaderHelper.SetStandard( this.shader, camera, this.transform, this.color, [] );
		this.vbo.Draw( renderer, this.shader.GetAttributeLocations( [ "aVertexPosition" ] ) );
	}
}
