import { vec3 } from "gl-matrix";
import { Camera, Engine } from "../engine";
import { WebGLRenderer } from "../render";
import { IJSONObject, JSONUtil } from "../util";
import { ITransformNodeConfig, TransformNode } from "./TransformNode";

export class AspectRatioScaleNode extends TransformNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): AspectRatioScaleNode
	{
		const nodeConfig = JSONUtil.AsType< IAspectRatioScaleNodeConfig >( config );
		const node = new AspectRatioScaleNode( nodeConfig.Name, nodeConfig.MaxScale );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private scale: vec3;
	private readonly extraScale: number;

	/**
	 *
	 */
	public constructor( name: string, maxScale: number )
	{
		super( name );

		this.extraScale = maxScale - 1.0;
		this.scale = vec3.fromValues( 1, 1, 1 );
	}

	/**
	 *
	 */
	public Render( renderer: WebGLRenderer, camera: Camera ): void
	{
		super.Render( renderer, camera );

		const glContext = renderer.GetContext();
		const aspect = glContext.drawingBufferWidth / glContext.drawingBufferHeight;
		const factor = Math.min( 1.0, Math.max( 0.0, 2 * ( 1 - aspect ) ) );
		const scale = 1.0 + this.extraScale * factor;
		if( scale !== this.scale[ 0 ] )
		{
			this.scale = vec3.set( this.scale, scale, scale, scale );
			// This will update this transformnode in the Render() instead of Update()
			// Because of this changes wont take affect until the next Update()
			this.SetScale( this.scale );
		}
	}
}

interface IAspectRatioScaleNodeConfig extends ITransformNodeConfig
{
	MaxScale: number;
}
