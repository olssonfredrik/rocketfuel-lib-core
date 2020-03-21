import { mat4, vec3 } from "gl-matrix";
import { Camera } from "../engine";
import { Point2D, Transform } from "../math";
import { Shader, TextureManager, WebGLRenderer } from "../render";
import { ShaderHelper } from "../util";

export class RenderPass
{
	private shader: Shader;
	private textureManager: TextureManager;
	private uniformData: Map< string, ( number | Array< number > ) >;
	private transform: Transform;
	private readonly textures: Array< string >;

	/**
	 * Creates an instance of RenderPass.
	 */
	public constructor( shader: Shader, textureManager: TextureManager, textures: Array< string >, uniformData: Map< string, ( number | Array< number > ) >, offset: Point2D )
	{
		const transform = new Transform();
		transform.Set( mat4.fromTranslation( mat4.create(), vec3.fromValues( offset.X, offset.Y, 0 ) ) );

		this.textures = textures.slice();
		this.textures.unshift( "" );

		this.shader = shader;
		this.textureManager = textureManager;
		this.uniformData = uniformData;
		this.transform = transform;
	}

	/**
	 *
	 */
	public SetActive( renderer: WebGLRenderer, camera: Camera, transform: Transform, color: Transform, sdfTexture: string ): void
	{
		const shader = this.shader;
		this.transform.SetParent( transform );

		this.textures[ 0 ] = sdfTexture;
		const offsets = this.textureManager.SetActive( this.textures );
		ShaderHelper.SetStandard( shader, camera, this.transform, color, offsets );
		this.uniformData.forEach( ( value, name ) => shader.SetUniform( name, value ) );
	}

	/**
	 *
	 */
	public GetAttributeLocations( attributes: Array< string > ): Array< number >
	{
		return this.shader.GetAttributeLocations( attributes );
	}

}
