import { Point2D } from "../../math";
import { ShaderManager } from "../shader";
import { IRenderTarget, TextureManager } from "../texture";
import { WebGLRenderer } from "../WebGLRenderer";
import { Filter } from "./Filter";

export class ScaleFilter extends Filter
{
	private readonly buffer: IRenderTarget;
	private readonly scale: number;
	private readonly shader: string;
	private readonly shaderManager: ShaderManager;

	/**
	 *
	 */
	public constructor( name: string, renderer: WebGLRenderer, shaderManager: ShaderManager, textureManager: TextureManager,
						scale: number = 0.1, shader: string = "RFLib/Filter", alpha: boolean = false )
	{
		super( name, renderer, textureManager );

		this.scale = scale;
		this.shader = shader;
		this.shaderManager = shaderManager;

		const dummySize = new Point2D( 8, 8 );
		this.buffer = textureManager.CreateRenderTarget( name + ":ScaleFilter", dummySize, alpha );
	}

	/**
	 *
	 */
	public Process( renderer: WebGLRenderer, input: string ): string
	{
		const size = this.textureManager.Size( input ).Clone().Scale( this.scale );
		this.buffer.Resize( size );

		// Scale the source down by rendering straight to this smaller buffer
		const filter = this.shaderManager.Get( this.shader );
		filter.SetActive();
		filter.SetUniform( "uTexture0", 0 );
		this.Apply( input, this.buffer, filter.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );

		return this.buffer.TextureId;
	}
}
