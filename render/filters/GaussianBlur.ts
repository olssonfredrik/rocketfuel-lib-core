import { Point2D } from "../../math";
import { ShaderManager } from "../shader";
import { IRenderTarget, TextureManager } from "../texture";
import { WebGLRenderer } from "../WebGLRenderer";
import { Filter } from "./Filter";

export class GaussianBlur extends Filter
{
	private readonly bufferA: IRenderTarget;
	private readonly bufferB: IRenderTarget;
	private readonly scale: number;
	private readonly shaderManager: ShaderManager;

	/**
	 *
	 */
	public constructor( name: string, renderer: WebGLRenderer, shaderManager: ShaderManager, textureManager: TextureManager, scale: number = 0.1, alpha: boolean = false )
	{
		super( name, renderer, textureManager );

		this.scale = scale;
		this.shaderManager = shaderManager;

		const dummySize = new Point2D( 8, 8 );
		this.bufferA = textureManager.CreateRenderTarget( name + ":GaussianBlur:A", dummySize, alpha );
		this.bufferB = textureManager.CreateRenderTarget( name + ":GaussianBlur:B", dummySize, alpha );
	}

	/**
	 *
	 */
	public Process( renderer: WebGLRenderer, input: string ): string
	{
		const size = this.textureManager.Size( input ).Clone().Scale( this.scale );
		this.bufferA.Resize( size );
		this.bufferB.Resize( size );

		// Scale the source down by rendering straight to this smaller buffer
		const filter = this.shaderManager.Get( "RFLib/Filter" );
		filter.SetActive();
		filter.SetUniform( "uTexture0", 0 );
		this.Apply( input, this.bufferA, filter.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );

		// Setup the blur shader
		const blur = this.shaderManager.Get( "RFLib/Blur" );
		blur.SetActive();
		blur.SetUniform( "uSize", [ this.bufferA.Size.X, this.bufferA.Size.Y ] );
		blur.SetUniform( "uTexture0", 0 );

		// Blur horizontally
		blur.SetUniform( "uOffset", [ 1, 0 ] );
		this.Apply( this.bufferA.TextureId, this.bufferB, blur.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );

		// Blur vertically
		blur.SetUniform( "uOffset", [ 0, 1 ] );
		this.Apply( this.bufferB.TextureId, this.bufferA, blur.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );

		return this.bufferA.TextureId;
	}
}
