import { Camera, Engine } from "../engine";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil, ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class RectangleNode extends LeafNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): RectangleNode
	{
		const nodeConfig = JSONUtil.AsType< IRectangleNodeConfig >( config );
		const shader = engine.ShaderManager.Get( "RFLib/SolidColor" );
		const node = new RectangleNode( nodeConfig.Name, engine.Renderer, shader, nodeConfig.Width, nodeConfig.Height );
		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;

	/**
	 * Creates an instance of TexturedRectNode.
	 */
	public constructor( name: string, renderer: WebGLRenderer, shader: Shader, width: number, height: number )
	{
		super( name );

		this.shader = shader;

		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const indexBuffer = new IndexBuffer( renderer, new Uint16Array( [ 0, 2, 1, 0, 3, 2 ] ) );
		const verts: Array< number > =
		[
			-halfWidth, halfHeight,
			halfWidth, halfHeight,
			halfWidth, -halfHeight,
			-halfWidth, -halfHeight,
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

interface IRectangleNodeConfig
{
	Name: string;
	Width: number;
	Height: number;
}
