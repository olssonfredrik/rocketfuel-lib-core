import { mat4 } from "gl-matrix";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class ColorNode extends SingleChildNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): ColorNode
	{
		const nodeConfig = JSONUtil.AsType< IColorNodeConfig >( config );
		const node = new ColorNode( nodeConfig.Name );
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private readonly color: Transform = new Transform();
	private readonly identity: mat4 = mat4.create();

	public Reset(): void
	{
		this.color.Set( this.identity );
	}

	/**
	 *
	 */
	public SetMatrix( matrix: mat4 ): void
	{
		this.color.Set( matrix );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.color.SetParent( color );
		this.child.Update( deltaTime, transform, this.color );
	}
}

export interface IColorNodeConfig
{
	Name: string;
	Child: IJSONObject;
}
