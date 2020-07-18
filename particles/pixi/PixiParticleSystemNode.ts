import { Camera, Engine } from "../../engine";
import { Transform } from "../../math";
import { LeafNode } from "../../nodes";
import { BlendMode, IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../../render";
import { Asserts, IJSONObject, JSONUtil, ShaderHelper } from "../../util";
import { IPixiParticleSystemNodeData } from "./IPixiParticleSystemData";
import { PixiParticleSystem } from "./PixiParticleSystem";

export class PixiParticleSystemNode extends LeafNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): PixiParticleSystemNode
	{
		const nodeConfig = JSONUtil.AsType< IPixiParticleSystemNodeData >( config );
		const node = new PixiParticleSystemNode( engine, nodeConfig );

		if( !!nodeConfig.Events )
		{
			if( !!nodeConfig.Events.Start )
			{
				engine.EventManager.Subscribe( nodeConfig.Events.Start, () => node.system.Play() );
			}
			if( !!nodeConfig.Events.Stop )
			{
				engine.EventManager.Subscribe( nodeConfig.Events.Stop, () => node.system.Stop() );
			}
		}

		return node;
	}

	private shader: Shader;
	private vbo: VertexBufferObject;
	private textureManager: TextureManager;
	private system: PixiParticleSystem;
	private textures: Array< string >;
	private vertData: Float32Array;
	private vertBuffer: VertexBuffer;

	/**
	 * Creates an instance of StatelessParticleNode.
	 */
	public constructor( engine: Engine, data: IPixiParticleSystemNodeData )
	{
		super( data.Name );

		Asserts.Assert( data.Textures.length > 0 && data.Textures.length <= 8, "PixiParticleSystemNode[" + data.Name + "]: Number of textures must be [1-8]." );

		const sizes = data.Textures.map( ( id ) => engine.TextureManager.Size( id ) );
		const offsets = data.Textures.map( ( id ) => engine.TextureManager.TextureOffset( id ) );

		this.textures = data.Textures;
		this.shader = engine.ShaderManager.Get( data.Shader ?? "RFLib/PixiParticles" );
		this.textureManager = engine.TextureManager;
		this.system = new PixiParticleSystem( data.System, sizes, offsets );

		const maxParticles = this.system.MaxParticles;
		const floatsPerParticle = 4 * 8; // 4 * [x, y, u, v, r, g, b, a]
		const verts: Array< number > = new Array< number >( maxParticles * floatsPerParticle );

		this.vertData = new Float32Array( verts );
		this.vertBuffer = new VertexBuffer( engine.Renderer, this.vertData, [ 2, 2, 4 ], WebGLRenderingContext.DYNAMIC_DRAW );
		const indexBuffer = IndexBuffer.CreateQuads( engine.Renderer, maxParticles );
		this.vbo = new VertexBufferObject( indexBuffer, this.vertBuffer );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		super.Update( deltaTime, transform, color );
		this.system.Update( deltaTime, transform );

		if( this.system.ParticleCount > 0 )
		{
			this.system.GetData( this.vertData );
			this.vertBuffer.SetData( this.vertData );
		}
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		const vertCount = this.system.ParticleCount * 6;
		if( vertCount <= 0 )
		{
			return;
		}

		const offsets = this.textureManager.SetActive( this.textures );
		ShaderHelper.SetStandard( this.shader, camera, this.transform, this.color, offsets );

		const blendStack = this.system.IsAdditive ? renderer.BlendModeStack : null;

		blendStack?.Push( BlendMode.Additive );
		this.vbo.Draw( renderer, this.shader.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition", "aTint" ] ), vertCount );
		blendStack?.Pop();
	}
}
