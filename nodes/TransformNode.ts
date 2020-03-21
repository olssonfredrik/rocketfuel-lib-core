import { mat4, vec3 } from "gl-matrix";
import { Engine } from "../engine";
import { Transform } from "../math";
import { IJSONObject, JSONUtil } from "../util";
import { SingleChildNode } from "./SingleChildNode";

export class TransformNode extends SingleChildNode
{

	/**
	 *
	 */
	public static Create( engine: Engine, config: IJSONObject ): TransformNode
	{
		const nodeConfig = JSONUtil.AsType< ITransformNodeConfig >( config );
		const node = new TransformNode( nodeConfig.Name );
		if( !!nodeConfig.Position )
		{
			node.SetPosition( nodeConfig.Position );
		}
		if( !!nodeConfig.Scale )
		{
			node.SetScale( nodeConfig.Scale );
		}
		node.SetChild( engine.NodeFactory.Create( engine, nodeConfig.Child ) );
		return node;
	}

	private transform: Transform = new Transform();
	private matrix: mat4 = this.transform.GetLocal();

	/**
	 *
	 */
	public SetPosition( position: vec3 ): void
	{
		mat4.fromTranslation( this.matrix, position );
		this.transform.SetDirty();
	}

	/**
	 *
	 */
	public SetScale( scale: vec3 ): void
	{
		mat4.fromScaling( this.matrix, scale );
		this.transform.SetDirty();
	}

	/**
	 *
	 */
	public SetMatrix( matrix: mat4 ): void
	{
		this.transform.Set( matrix );
	}

	/**
	 *
	 */
	public Update( deltaTime: number, transform: Transform, color: Transform ): void
	{
		this.transform.SetParent( transform );
		this.child.Update( deltaTime, this.transform, color );
	}
}

export interface ITransformNodeConfig
{
	Name: string;
	Child: IJSONObject;
	Position?: vec3;
	Scale?: vec3;
}
