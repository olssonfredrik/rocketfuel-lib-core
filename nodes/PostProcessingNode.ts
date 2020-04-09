import { Camera, Engine } from "../engine";
import { IndexBuffer, IRenderTarget, ShaderManager, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class PostProcessingNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): PostProcessingNode
	{
		const nodeConfig = JSONUtil.AsType< IPostProcessingNodeConfig >( config );
		const node = new PostProcessingNode( nodeConfig.Name, engine.Renderer, engine.TextureManager, engine.ShaderManager, nodeConfig.Shader );
		return node;
	}

	protected composeShader: string;
	protected vbo: VertexBufferObject;
	protected shaderManager: ShaderManager;
	protected textureManager: TextureManager;

	private renderTargetMain: IRenderTarget;

	/**
	 *
	 */
	public constructor( name: string, renderer: WebGLRenderer, textureManager: TextureManager, shaderManager: ShaderManager, composeShader: string = "RFLib/Filter" )
	{
		super( name );

		const verts: Array< number > = [ -1, -1, 0, 0, 1, -1, 1, 0, 1, 1, 1, 1, -1, 1, 0, 1 ];
		const vertexBuffer = new VertexBuffer( renderer, new Float32Array( verts ), [ 2, 2 ] );
		this.vbo = new VertexBufferObject( IndexBuffer.CreateQuads( renderer ), vertexBuffer );

		this.composeShader = composeShader;
		this.shaderManager = shaderManager;
		this.textureManager = textureManager;
		this.renderTargetMain = textureManager.CreateRenderTarget( name + ":PostProcessing", renderer.RenderSize, false );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		this.renderTargetMain.Resize( renderer.RenderSize );

		renderer.RenderTargetStack.Push( this.renderTargetMain );
		this.child.Render( renderer, camera );
		renderer.RenderTargetStack.Pop();

		this.Process( renderer, this.renderTargetMain.TextureId );
	}

	/**
	 * Override this to customize the effect
	 */
	protected Process( renderer: WebGLRenderer, input: string ): void
	{
		const compose = this.shaderManager.Get( this.composeShader );
		compose.SetActive();
		this.textureManager.SetActive( [ input ] );
		this.vbo.Draw( renderer, compose.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );
	}
}

interface IPostProcessingNodeConfig
{
	Name: string;
	Shader?: string;
}
