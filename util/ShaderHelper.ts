import { Camera } from "../engine";
import { Transform } from "../math";
import { Shader } from "../render";

export class ShaderHelper
{
	/**
	 *
	 */
	public static SetStandard( shader: Shader, camera: Camera, transform: Transform, color: Transform, textureOffsets: Array< Array< number > > ): void
	{
		shader.SetActive();
		shader.SetUniform( "uProjMatrix", camera.Projection );
		shader.SetUniform( "uViewMatrix", camera.View );
		shader.SetUniform( "uModelMatrix", transform.Get() );
		shader.SetUniform( "uColorMatrix", color.Get() );

		for( let i = 0; i < textureOffsets.length; i++ )
		{
			shader.SetUniform( "uTexture" + i, i );
			shader.SetUniform( "uTextureOffset" + i, textureOffsets[ i ] );
		}
	}
}
