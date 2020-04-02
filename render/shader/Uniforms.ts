import { Asserts } from "../../util";
import { WebGLRenderer } from "../WebGLRenderer";

export class Uniforms
{
	private uniformFunctions = new Map< string, UniformSetter >();

	/**
	 *
	 */
	constructor( renderer: WebGLRenderer, program: WebGLProgram )
	{
		const gl = renderer.GetContext();
		const count: number = gl.getProgramParameter( program, WebGLRenderingContext.ACTIVE_UNIFORMS );

		for( let i = 0; i < count; i++ )
		{
			const uniformInfo = gl.getActiveUniform( program, i );
			if( !!uniformInfo )
			{
				const location = gl.getUniformLocation( program, uniformInfo.name );
				if( !!location )
				{
					this.uniformFunctions.set( uniformInfo.name, this.GetUniformSetter( gl, uniformInfo, location ) );
				}
			}
		}
	}

	/**
	 * Set the value of a uniform. Silently ignore any unknown uniforms.
	 * Note: No type checking is done on the value
	 */
	public SetValue( name: string, value: number | Array< number > | Float32List | Int32List ): void
	{
		const uniform = this.uniformFunctions.get( name );
		switch( uniform?.type )
		{
			case "Number":
				uniform.set( value as number );
				break;

			case "FloatArray":
				uniform.set( value as Float32List );
				break;

			case "IntArray":
				uniform.set( value as Int32List );
				break;
		}
	}

	/**
	 *
	 */
	private GetUniformSetter( gl: WebGLRenderingContext, uniformInfo: WebGLActiveInfo, location: WebGLUniformLocation ): UniformSetter
	{
		const isNumber = uniformInfo.name.indexOf( "[0]" ) < 0;
		switch( uniformInfo.type )
		{
			case WebGLRenderingContext.INT:
			case WebGLRenderingContext.BOOL:
			case WebGLRenderingContext.SAMPLER_2D:
				return isNumber
					? { type: "Number", set: ( value: number ) => gl.uniform1i( location, value ) }
					: { type: "IntArray", set: ( value: Int32List ) => gl.uniform1iv( location, value ) };
			case WebGLRenderingContext.INT_VEC2:
			case WebGLRenderingContext.BOOL_VEC2:
				return { type: "IntArray", set: ( value: Int32List ) => gl.uniform2iv( location, value ) };
			case WebGLRenderingContext.INT_VEC3:
			case WebGLRenderingContext.BOOL_VEC3:
				return { type: "IntArray", set: ( value: Int32List ) => gl.uniform3iv( location, value ) };
			case WebGLRenderingContext.INT_VEC4:
			case WebGLRenderingContext.BOOL_VEC4:
				return { type: "IntArray", set: ( value: Int32List ) => gl.uniform4iv( location, value ) };

			case WebGLRenderingContext.FLOAT:
				return isNumber
					? { type: "Number", set: ( value: number ) => gl.uniform1f( location, value ) }
					: { type: "FloatArray", set: ( value: Float32List ) => gl.uniform1fv( location, value ) };
			case WebGLRenderingContext.FLOAT_VEC2:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniform2fv( location, value ) };
			case WebGLRenderingContext.FLOAT_VEC3:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniform3fv( location, value ) };
			case WebGLRenderingContext.FLOAT_VEC4:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniform4fv( location, value ) };

			case WebGLRenderingContext.FLOAT_MAT2:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniformMatrix2fv( location, false, value ) };
			case WebGLRenderingContext.FLOAT_MAT3:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniformMatrix3fv( location, false, value ) };
			case WebGLRenderingContext.FLOAT_MAT4:
				return { type: "FloatArray", set: ( value: Float32List ) => gl.uniformMatrix4fv( location, false, value ) };

			default:
				Asserts.Assert( false, "Unknown uniform type: 0x" + uniformInfo.type.toString( 16 ) );
		}
	}
}

interface IUniformNumber
{
	type: "Number";
	set: ( value: number ) => void;
}

interface IUniformFloatArray
{
	type: "FloatArray";
	set: ( value: Float32List ) => void;
}

interface IUniformIntArray
{
	type: "IntArray";
	set: ( value: Int32List ) => void;
}

type UniformSetter = IUniformNumber | IUniformFloatArray | IUniformIntArray;
