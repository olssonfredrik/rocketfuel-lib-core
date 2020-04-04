import { Camera, Engine } from "../engine";
import { Transform } from "../math";
import { LeafNode } from "../nodes";
import { BlendMode, IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { Asserts, IJSONObject, JSONUtil, ShaderHelper } from "../util";
import { IStatelessParticleSystemData } from "./IStatelessParticleSystemData";

export class StatelessParticleSystemNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): StatelessParticleSystemNode
	{
		const nodeConfig = JSONUtil.AsType< IStatelessParticleSystemData >( config );
		const node = new StatelessParticleSystemNode( engine, nodeConfig );
		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;
	private time: number;
	private textureManager: TextureManager;
	private data: IStatelessParticleSystemData;

	/**
	 * Creates an instance of StatelessParticleNode.
	 */
	public constructor( engine: Engine, data: IStatelessParticleSystemData )
	{
		super( data.Name );

		Asserts.Assert( data.Textures.length === 1, "Only single texture particle system supported." );

		this.data = data;
		this.textureManager = engine.TextureManager;
		this.shader = engine.ShaderManager.Get( this.data.Shader );

		const halfWidth = 0.5 * engine.TextureManager.Size( data.Textures[ 0 ] ).X;
		const halfHeight = 0.5 * engine.TextureManager.Size( data.Textures[ 0 ] ).Y;
		const vertData: Array< number > =
		[
			-halfWidth, -halfHeight, 0.0, 0.0, 0.0, 0.0,
			halfWidth, -halfHeight, 1.0, 0.0, 0.0, 0.0,
			halfWidth, halfHeight, 1.0, 1.0, 0.0, 0.0,
			-halfWidth, halfHeight, 0.0, 1.0, 0.0, 0.0,
		];
		const verts: Array< number > = new Array< number >( this.data.MaxParticles * vertData.length );
		for( let i = 0; i < this.data.MaxParticles; i++ )
		{
			vertData[ 4 ] = vertData[ 10 ] = vertData[ 16 ] = vertData[ 22 ] = i / 16384.0;
			vertData[ 5 ] = vertData[ 11 ] = vertData[ 17 ] = vertData[ 23 ] = Math.random();
			for( let j = 0; j < vertData.length; j++ )
			{
				verts[ i * vertData.length + j ] = vertData[ j ];
			}
		}

		const indexBuffer = IndexBuffer.CreateQuads( engine.Renderer, this.data.MaxParticles );
		const vertexBuffer = new VertexBuffer( engine.Renderer, new Float32Array( verts ), [ 2, 2, 2 ] );

		this.vbo = new VertexBufferObject( indexBuffer, vertexBuffer );
		this.time = this.data.Looping ? 13.37 * this.data.Life[ 1 ] : 0.0;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		super.Update( deltaTime, transform, color );
		this.time += deltaTime;
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		const offsets = this.textureManager.SetActive( this.data.Textures );
		ShaderHelper.SetStandard( this.shader, camera, this.transform, this.color, offsets );

		this.shader.SetUniform( "uTime", this.time );
		this.shader.SetUniform( "uShapeType", this.data.ShapeType );
		this.shader.SetUniform( "uShapes[0]", this.data.Shapes );
		this.shader.SetUniform( "uSizeAlpha[0]", this.data.SizeAlpha );
		this.shader.SetUniform( "uLife", this.data.Life );

		renderer.BlendModeStack.Push( BlendMode.Additive );
		this.vbo.Draw( renderer, this.shader.GetAttributeLocations( [ "aVertexPosition", "aTextureCoordinates", "aSeed" ] ) );
		renderer.BlendModeStack.Pop();
	}
}
