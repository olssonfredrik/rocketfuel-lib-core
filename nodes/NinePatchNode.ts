import { Camera, Engine } from "../engine";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { Asserts, IJSONObject, JSONUtil, ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class NinePatchNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): NinePatchNode
	{
		const nodeConfig = JSONUtil.AsType< INinePatchNodeConfig >( config );
		const shader = engine.ShaderManager.Get( nodeConfig.Shader ?? "RFLib/TexturedRect" );
		const layout = nodeConfig.Layout ?? [ 0.3333, 0.6666, 0.3333, 0.6666 ];
		const node = new NinePatchNode( nodeConfig.Name, engine.Renderer, engine.TextureManager, shader, nodeConfig.Texture, layout, nodeConfig.Width, nodeConfig.Height );
		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;
	private textures: Array< string >;
	private textureManager: TextureManager;

	/**
	 * Creates an instance of NinePatchNode.
	 * This is a technique to stretch a mesh while preserving the pixel size of the corners.
	 * Where layout is [u1, u2, v7, v11]
	 * 		0--1----2--3
	 * 		|  |    |  |
	 * 		4--5----6--7
	 * 		|  |    |  |
	 * 		|  |    |  |
	 * 		8--9----10-11
	 * 		|  |    |  |
	 * 		12-13---14-15
	 */
	public constructor( name: string, renderer: WebGLRenderer, textureManager: TextureManager, shader: Shader, texture: string,
						layout: Array< number >, width: number, height: number )
	{
		super( name );
		Asserts.Assert( layout.length === 4, "NinePatchNode Layout must contain 4 numbers" );

		this.textures = [ texture ];
		this.textureManager = textureManager;

		this.shader = shader;

		const indexBuffer = new IndexBuffer( renderer, new Uint16Array(
		[
			0, 5, 1, 0, 4, 5, 1, 6, 2, 1, 5, 6, 2, 7, 3, 2, 6, 7,
			4, 9, 5, 4, 8, 9, 5, 10, 6, 5, 9, 10, 6, 11, 7, 6, 10, 11,
			8, 13, 9, 8, 12, 13, 9, 14, 10, 9, 13, 14, 10, 15, 11, 10, 14, 15,
		] ) );

		const size = textureManager.Size( texture );
		const left = -width / 2;
		const top = height / 2;

		const u0 = 0;
		const u1 = layout[ 0 ];
		const u2 = layout[ 1 ];
		const u3 = 1;
		const v0 = 0;
		const v1 = layout[ 2 ];
		const v2 = layout[ 3 ];
		const v3 = 1;

		const x0 = left + u0 * size.X;
		const x1 = left + u1 * size.X;
		const x2 = left + width - ( 1 - u2 ) * size.X;
		const x3 = left + width - ( 1 - u3 ) * size.X;
		const y0 = top - v0 * size.Y;
		const y1 = top - v1 * size.Y;
		const y2 = top - height + ( 1 - v2 ) * size.Y;
		const y3 = top - height + ( 1 - v3 ) * size.Y;

		const verts: Array< number > =
		[
			x0, y0, u0, v0,  x1, y0, u1, v0,  x2, y0, u2, v0,  x3, y0, u3, v0,
			x0, y1, u0, v1,  x1, y1, u1, v1,  x2, y1, u2, v1,  x3, y1, u3, v1,
			x0, y2, u0, v2,  x1, y2, u1, v2,  x2, y2, u2, v2,  x3, y2, u3, v2,
			x0, y3, u0, v3,  x1, y3, u1, v3,  x2, y3, u2, v3,  x3, y3, u3, v3,
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

interface INinePatchNodeConfig
{
	Name: string;
	Texture: string;
	Width: number;
	Height: number;
	Shader?: string;
	Layout?: Array< number >;
}
