import { spine } from "esotericsoftware-spine";
import { mat4 } from "gl-matrix";
import { Camera } from "../../engine";
import { Transform } from "../../math";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../../render";
import { ShaderHelper } from "../../util";

export class RegionAttachment extends spine.RegionAttachment
{
	private vbo: VertexBufferObject;
	private xyBuffer: VertexBuffer;
	private transform: Transform;
	private colorMatrix: Transform;
	private buffer: Float32Array;
	private textureManager: TextureManager;

	/**
	 *
	 */
	public constructor( renderer: WebGLRenderer, textureManager: TextureManager, name: string )
	{
		super( name );

		const indexBuffer = IndexBuffer.CreateQuads( renderer );

		const uvData = new Float32Array( [ 0, 1, 0, 0, 1, 0, 1, 1 ] );
		const uvBuffer = new VertexBuffer( renderer, uvData, [ 2 ] );

		const buffer = new Float32Array( 8 );
		const xyBuffer = new VertexBuffer( renderer, buffer, [ 2 ], WebGLRenderingContext.DYNAMIC_DRAW );

		this.vbo = new VertexBufferObject( indexBuffer, new Array< VertexBuffer >( xyBuffer, uvBuffer ) );
		this.xyBuffer = xyBuffer;
		this.buffer = buffer;
		this.textureManager = textureManager;
		this.transform = new Transform();
		this.colorMatrix = new Transform();
	}

	/**
	 *
	 */
	public SetColor( matrix: mat4 ): void
	{
		this.colorMatrix.Set( matrix );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform, slot: spine.Slot ): void
	{
		const data = this.buffer;
		this.computeWorldVertices( slot.bone, data, 0, 2 );
		this.xyBuffer.SetData( data );
		this.transform = transform;
		this.colorMatrix.SetParent( color );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera, shader: Shader ): void
	{
		const offsets = this.textureManager.SetActive( [ this.path ] );
		ShaderHelper.SetStandard( shader, camera, this.transform, this.colorMatrix, offsets );
		this.vbo.Draw( renderer, shader.GetAttributeLocations( [ "aVertexPosition", "aTexturePosition" ] ) );
	}
}
