import { Camera, Engine } from "../engine";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil, ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class SpriteNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): SpriteNode
	{
		const nodeConfig = JSONUtil.AsType< ISpriteNodeConfig >( config );
		const shader = engine.ShaderManager.Get( nodeConfig.Shader ?? "RFLib/TexturedRect" );
		const node = new SpriteNode( nodeConfig.Name, engine.Renderer, engine.TextureManager, shader, nodeConfig.Texture );
		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;
	private textures: Array< string >;
	private textureManager: TextureManager;

	/**
	 * Creates an instance of SpriteNode.
	 */
	public constructor( name: string, renderer: WebGLRenderer, textureManager: TextureManager, shader: Shader, texture: string )
	{
		super( name );

		this.textures = [ texture ];
		this.textureManager = textureManager;

		this.shader = shader;

		const size = textureManager.Size( texture );
		const halfWidth = size.X / 2;
		const halfHeight = size.Y / 2;
		const indexBuffer = IndexBuffer.CreateQuads( renderer );
		const verts: Array< number > =
		[
			-halfWidth, halfHeight, 0, 0,
			halfWidth, halfHeight, 1, 0,
			halfWidth, -halfHeight, 1, 1,
			-halfWidth, -halfHeight, 0, 1,
		];
		const vertexBuffer = new VertexBuffer( renderer, new Float32Array( verts ), [ 2, 2 ] );

		this.vbo = new VertexBufferObject( indexBuffer, vertexBuffer );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		const offsets = this.textureManager.SetActive( this.textures );
		ShaderHelper.SetStandard( this.shader, camera, this.transform, this.color, offsets );

		this.vbo.Draw( renderer, this.shader.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );
	}
}

interface ISpriteNodeConfig
{
	Name: string;
	Texture: string;
	Shader?: string;
}
