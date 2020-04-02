import { spine } from "esotericsoftware-spine";
import { Camera } from "../../engine";
import { Transform } from "../../math";
import { IndexBuffer, Shader, TextureManager, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../../render";
import { Asserts, ShaderHelper } from "../../util";

export class ClipAttachment extends spine.ClippingAttachment
{
	public Shader?: Shader;

	private triangulator: spine.Triangulator;
	private vertBuffer: VertexBuffer;
	private buffer: Float32Array;
	private vbo: VertexBufferObject;
	private indexBuffer: IndexBuffer;
	private transform: Transform;
	private colorMatrix: Transform;
	private count: number;

	/**
	 *
	 */
	public constructor( renderer: WebGLRenderer, name: string )
	{
		super( name );

		const indexBuffer = new IndexBuffer( renderer, new Uint16Array( 0 ) );
		const buffer = new Float32Array( 0 );
		const vertBuffer = new VertexBuffer( renderer, buffer, [ 2 ], WebGLRenderingContext.DYNAMIC_DRAW );

		this.vbo = new VertexBufferObject( indexBuffer, vertBuffer );
		this.indexBuffer = indexBuffer;
		this.vertBuffer = vertBuffer;
		this.buffer = buffer;
		this.count = 0;

		this.triangulator = new spine.Triangulator();
		this.transform = new Transform();
		this.colorMatrix = new Transform();
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform, slot: spine.Slot ): void
	{
		if( this.buffer.length !== this.worldVerticesLength )
		{
			this.Init();
		}

		const data = this.buffer;

		const transformVerts = new Array( this.worldVerticesLength );
		this.computeWorldVertices( slot, 0, transformVerts.length, transformVerts, 0, 2 );
		spine.SkeletonClipping.makeClockwise( transformVerts );
		const output = this.triangulator.triangulate( transformVerts );
		for( let i = 0; i < output.length; i++ )
		{
			data[ i * 2 ] = transformVerts[ output[ i ] * 2 ];
			data[ i * 2 + 1 ] = transformVerts[ output[ i ] * 2 + 1 ];
		}
		this.vertBuffer.SetData( data );
		this.count = output.length;

		this.transform = transform;
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		Asserts.AssertNotNull( this.Shader );
		const shader = this.Shader;
		ShaderHelper.SetStandard( shader, camera, this.transform, this.colorMatrix, [] );
		this.vbo.Draw( renderer, shader.GetAttributeLocations( [ "aVertexPosition" ] ), this.count );
	}

	/**
	 *
	 */
	private Init(): void
	{
		this.indexBuffer.GenerateTriangles( this.worldVerticesLength );
		this.buffer = new Float32Array( this.worldVerticesLength * 2 );
	}
}
