import { Asserts, Logging } from "../util";
import { Uniforms } from "./Uniforms";
import { WebGLRenderer } from "./WebGLRenderer";

export class Shader
{
	private vertexSource: string;
	private fragmentSource: string;
	private renderer: WebGLRenderer;
	private program: WebGLProgram | null = null;
	private id: string;
	private uniforms: Uniforms | null = null;
	private attributeLocations: Map< string, number > = new Map< string, number >();

	/**
	 * Creates an instance of Shader.
	 */
	public constructor( renderer: WebGLRenderer, id: string, vertexSource: string, fragmentSource: string )
	{
		this.vertexSource = vertexSource;
		this.fragmentSource = fragmentSource;
		this.renderer = renderer;
		this.id = id;

		this.Compile();
	}

	/**
	 *
	 */
	public GetId(): string
	{
		return this.id;
	}

	/**
	 *
	 */
	public SetUniform( name: string, value: number | Array< number > | Float32List | Int32List ): void
	{
		this.uniforms?.SetValue( name, value );
	}

	/**
	 * Set this shader as the currently active shader
	 */
	public SetActive(): void
	{
		this.program = Asserts.AssertDefinedNotNull( this.program, "Tried to use uncompiled shader." );

		this.renderer.GetContext().useProgram( this.program );
	}

	/**
	 *
	 */
	public GetAttributeLocations( attributes: Array< string > ): Array< number >
	{
		const output: Array< number > = new Array< number >();

		for( const attribute of attributes )
		{
			const location = this.attributeLocations.get( attribute ) ?? -1;
			output.push( location );
		}

		return output;
	}

	/**
	 * Compile & link the shader
	 */
	private Compile(): void
	{
		const gl = this.renderer.GetContext();

		const vertexShader = this.CompileShader( gl, this.vertexSource, WebGLRenderingContext.VERTEX_SHADER );
		const fragmentShader = this.CompileShader( gl, this.fragmentSource, WebGLRenderingContext.FRAGMENT_SHADER );

		const shaderProgram = Asserts.AssertDefinedNotNull( gl.createProgram() as WebGLProgram, "Failed to create shader program!" );

		gl.attachShader( shaderProgram, vertexShader );
		gl.attachShader( shaderProgram, fragmentShader );
		gl.linkProgram( shaderProgram );

		Asserts.Assert( !!gl.getProgramParameter( shaderProgram, WebGLRenderingContext.LINK_STATUS ), "Shader linker failed" );

		this.uniforms = new Uniforms( this.renderer, shaderProgram );

		// Attributes
		const attributeCount: number = gl.getProgramParameter( shaderProgram, WebGLRenderingContext.ACTIVE_ATTRIBUTES );
		for( let i = 0; i < attributeCount; i++ )
		{
			const attribute = Asserts.AssertDefinedNotNull( gl.getActiveAttrib( shaderProgram, i ) as WebGLActiveInfo, "Failed to get attribute" );
			const location = gl.getAttribLocation( shaderProgram, attribute.name );
			this.attributeLocations.set( attribute.name, location );
		}

		this.program = shaderProgram;
	}

	/**
	 *
	 */
	private CompileShader( gl: WebGLRenderingContext, shaderSource: string, shaderType: number ): WebGLShader
	{
		const shader = Asserts.AssertDefinedNotNull( gl.createShader( shaderType ) as WebGLShader, "Failed to create shader." );

		gl.shaderSource( shader, shaderSource );
		gl.compileShader( shader );

		if( !gl.getShaderParameter( shader, WebGLRenderingContext.COMPILE_STATUS ) )
		{
			Logging.Error( "Shader compilation failed: " + gl.getShaderInfoLog( shader ) );
		}

		return shader;
	}
}
