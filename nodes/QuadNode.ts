import { Camera } from "../engine";
import { IndexBuffer, Shader, VertexBuffer, VertexBufferObject, WebGLRenderer } from "../render";
import { ShaderHelper } from "../util";
import { LeafNode } from "./LeafNode";

export class QuadNode extends LeafNode
{
	private shader: Shader;
	private vbo: VertexBufferObject;

	/**
	 * Creates an instance of RectNode.
	 */
	public constructor( renderer: WebGLRenderer, shader: Shader )
	{
		super( "Rect Node" );

		this.shader = shader;

		const indexBuffer = new IndexBuffer( renderer, new Uint16Array( [ 0, 2, 1, 0, 3, 2 ] ) );
		const verts: Array< number > = [ -64, -64, 64, -64, 64, 64, -64, 64 ];
		const vertexBuffer = new VertexBuffer( renderer, new Float32Array( verts ), [ 2 ] );

		this.vbo = new VertexBufferObject( indexBuffer, vertexBuffer );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		ShaderHelper.SetStandard( this.shader, camera, this.transform, this.color, [] );
		this.vbo.Draw( renderer, this.shader.GetAttributeLocations( [ "aVertexPosition" ] ) );
	}
}
