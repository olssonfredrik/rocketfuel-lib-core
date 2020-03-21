import { mat4, vec3 } from "gl-matrix";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class FloatNode extends SingleChildNode
{
	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): FloatNode
	{
		const nodeConfig = JSONUtil.AsType< IFloatNodeConfig >( config );
		const node = new FloatNode( nodeConfig.Name );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private transform: Transform = new Transform();
	private matrix: mat4 = this.transform.GetLocal();
	private rotation: mat4 = mat4.create();
	private time: number;
	private scale: number;

	/**
	 * Creates an instance of FloatNode.
	 */
	public constructor( name: string )
	{
		super( name );
		this.time = Math.random() * 100;
		this.scale = 0.95 + Math.random() * 0.1;
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.time += deltaTime * this.scale;
		this.UpdateMatrix();
		this.transform.SetParent( transform );
		super.Update( deltaTime, this.transform, color );
	}

	/**
	 *
	 */
	private UpdateMatrix(): void
	{
		const x = Math.cos( 0.0893484 * this.time ) * 6 - 3;
		const y = Math.sin( 0.1038738 * this.time ) * 6 - 3;
		mat4.fromTranslation( this.matrix, [ x, y, 0 ] );

		const rotation = Math.cos( 0.05 * this.time ) * 0.08;
		mat4.fromZRotation( this.rotation, rotation );

		mat4.multiply( this.matrix, this.matrix, this.rotation );
	}
}

interface IFloatNodeConfig
{
	Name: string;
	Child: IJSONObject;
}
