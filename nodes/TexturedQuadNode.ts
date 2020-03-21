import { Camera, Engine } from "../engine";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil, ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class TexturedQuadNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): TexturedQuadNode
	{
		const nodeConfig = JSONUtil.AsType< ITexturedRectNodeConfig >( config );
		const shader = engine.ShaderManager.Get( nodeConfig.Shader );
		const node = new TexturedQuadNode( nodeConfig.Name, engine.Renderer, engine.TextureManager, shader, nodeConfig.Textures, nodeConfig.Width, nodeConfig.Height );
		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;
	private textures: Array< string >;
	private textureManager: TextureManager;

	/**
	 * Creates an instance of TexturedRectNode.
	 */
	public constructor( name: string, renderer: WebGLRenderer, textureManager: TextureManager, shader: Shader, textures: Array< string >, width: number, height: number )
	{
		super( name );

		this.textures = textures;
		this.textureManager = textureManager;

		this.shader = shader;

		const halfWidth = width / 2;
		const halfHeight = height / 2;
		const indexBuffer = new IndexBuffer( renderer, new Uint16Array( [ 0, 2, 1, 0, 3, 2 ] ) );
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

interface ITexturedRectNodeConfig
{
	Name: string;
	Shader: string;
	Textures: Array< string >;
	Width: number;
	Height: number;
}
